import { randomBytes } from 'node:crypto'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'

mkdirSync('.local', { recursive: true })
if (existsSync('.env.local')) {
  console.log('.env.local already exists; existing settings were preserved.')
  process.exit(0)
}
const password = randomBytes(24).toString('hex')
const credentials = {
  adminEmail: 'admin@medexp.local',
  adminPassword: randomBytes(24).toString('base64url'),
  editorEmail: 'editor-voronezh@medexp.local',
  editorPassword: randomBytes(24).toString('base64url'),
}
writeFileSync('.env.local', [
  `DATABASE_URL=postgresql://medexp:${password}@127.0.0.1:55432/medexp`,
  `PAYLOAD_SECRET=${randomBytes(48).toString('hex')}`,
  `REVIEW_TOKEN_SECRET=${randomBytes(48).toString('hex')}`,
  'SERVER_URL=http://localhost:3100',
  'ALLOW_INDEXING=false',
  'TRUST_PROXY=false',
  '',
].join('\n'), { mode: 0o600 })
writeFileSync('.local/bootstrap.json', JSON.stringify(credentials, null, 2), { mode: 0o600 })
console.log('Local secrets generated. Bootstrap login details: .local/bootstrap.json (not tracked by Git).')
