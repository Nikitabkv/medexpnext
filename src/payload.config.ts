import path from 'node:path'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { ru } from '@payloadcms/translations/languages/ru'
import sharp from 'sharp'
import { Users } from './collections/Users'
import { Cities, Branches, Categories, Services, Prices } from './collections/Catalog'
import { Doctors, Documents, Media } from './collections/Doctors'
import { Reviews } from './collections/Reviews'
import { AuditLog, Pages, Promotions, RateLimits } from './collections/Content'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const serverURL = process.env.SERVER_URL || 'http://localhost:3100'
const origins = process.env.NODE_ENV === 'production' ? [serverURL] : [...new Set([serverURL, 'http://127.0.0.1:3100', 'http://localhost:3100'])]
const secret = process.env.PAYLOAD_SECRET
if (!secret || secret.length < 32) throw new Error('PAYLOAD_SECRET must contain at least 32 random characters. Run setup:local or configure the server environment.')
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required. This project uses PostgreSQL.')
const collections = [Users, Cities, Branches, Categories, Services, Prices, Media, Doctors, Documents, Reviews, Promotions, Pages]
for (const collection of collections) {
  collection.hooks ??= {}
  collection.hooks.afterChange = [...(collection.hooks.afterChange ?? []), async ({ doc, operation, req }) => {
    if (req.user) await req.payload.create({ collection: 'audit-log', data: { actor: `${req.user.id}`, action: operation, collectionName: collection.slug, documentID: String(doc.id) }, overrideAccess: true, req })
    return doc
  }]
  collection.hooks.afterDelete = [...(collection.hooks.afterDelete ?? []), async ({ doc, req }) => {
    if (req.user) await req.payload.create({ collection: 'audit-log', data: { actor: `${req.user.id}`, action: 'delete', collectionName: collection.slug, documentID: String(doc.id) }, overrideAccess: true, req })
    return doc
  }]
}
export default buildConfig({
  serverURL, secret,
  admin: {
    avatar: 'default',
    user: 'users', importMap: { baseDir: dirname },
    meta: { titleSuffix: ' — МедЭксперт', robots: 'noindex, nofollow' },
    components: { beforeDashboard: ['@/components/admin/Welcome#Welcome'] },
    livePreview: { url: serverURL },
  },
  i18n: { supportedLanguages: { ru }, fallbackLanguage: 'ru' },
  collections: [...collections, AuditLog, RateLimits],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
      ...(process.env.DATABASE_CA_FILE ? { ssl: { ca: readFileSync(process.env.DATABASE_CA_FILE, 'utf8'), rejectUnauthorized: true } } : {}),
      max: 10,
    },
    migrationDir: path.resolve(dirname, 'migrations'),
    push: process.env.NODE_ENV !== 'production',
  }),
  sharp,
  email: () => ({
    name: 'disabled', defaultFromAddress: 'no-reply@medexp.local', defaultFromName: 'МедЭксперт',
    sendEmail: async () => { throw new Error('Email delivery is not configured. Password reset messages are never printed to logs.') },
  }),
  graphQL: { disable: true },
  cors: origins, csrf: origins,
  upload: { limits: { fileSize: 8 * 1024 * 1024 }, abortOnLimit: true },
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
})
