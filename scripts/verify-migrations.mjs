import { randomBytes } from 'node:crypto'
import { spawnSync } from 'node:child_process'
import nextEnv from '@next/env'
import pg from 'pg'
nextEnv.loadEnvConfig(process.cwd())
const original = new URL(process.env.DATABASE_URL)
if (!['127.0.0.1', 'localhost'].includes(original.hostname)) throw new Error('Migration check only runs against a local test server.')
const name = `medexp_check_${randomBytes(6).toString('hex')}`
const adminURL = new URL(original); adminURL.pathname = '/postgres'
const client = new pg.Client({ connectionString: adminURL.toString() })
await client.connect()
let created = false
try {
  await client.query(`CREATE DATABASE "${name}"`)
  created = true
  const target = new URL(original); target.pathname = `/${name}`
  const result = spawnSync(process.execPath, ['scripts/payload-cli.mjs', 'migrate'], { stdio: 'inherit', env: { ...process.env, NODE_ENV: 'production', DATABASE_URL: target.toString() } })
  if (result.status !== 0) throw new Error('Migration command failed.')
  const bootstrap = spawnSync(process.execPath, ['--import', 'tsx', 'scripts/create-admin.ts'], {
    stdio: ['pipe', 'inherit', 'inherit'],
    input: JSON.stringify({ email: 'migration-check@example.test', password: randomBytes(24).toString('base64url'), name: 'Migration check' }),
    env: { ...process.env, NODE_ENV: 'production', DATABASE_URL: target.toString() },
  })
  if (bootstrap.status !== 0) throw new Error('Initial administrator bootstrap failed.')
  const check = new pg.Client({ connectionString: target.toString() })
  await check.connect()
  const tables = await check.query("SELECT tablename FROM pg_tables WHERE schemaname='public'")
  for (const table of ['doctors', 'documents', 'reviews', 'prices', 'users', 'rate_limits']) if (!tables.rows.some(row => row.tablename === table)) throw new Error(`Missing table: ${table}`)
  const users = await check.query('SELECT role FROM users')
  if (users.rows.length !== 1 || users.rows[0].role !== 'admin') throw new Error('Bootstrap did not create exactly one administrator.')
  await check.end()
  console.log('Production migration verified against a new, empty PostgreSQL database.')
} finally {
  // Only the randomly named database created by this invocation can be removed.
  if (created && /^medexp_check_[a-f0-9]{12}$/.test(name)) await client.query(`DROP DATABASE "${name}" WITH (FORCE)`)
  await client.end()
}
