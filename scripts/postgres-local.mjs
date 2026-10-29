import { existsSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import EmbeddedPostgres from 'embedded-postgres'
import nextEnv from '@next/env'

nextEnv.loadEnvConfig(process.cwd())
const url = new URL(process.env.DATABASE_URL)
if (!['localhost', '127.0.0.1'].includes(url.hostname) || url.port !== '55432') {
  throw new Error('Local PostgreSQL helper only accepts localhost:55432. Use your own server for other database URLs.')
}
mkdirSync('.local', { recursive: true })
const databaseDir = path.resolve('.local/postgres')
const pg = new EmbeddedPostgres({
  databaseDir,
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  port: Number(url.port),
  authMethod: 'scram-sha-256',
  persistent: true,
  createPostgresUser: false,
  initdbFlags: ['--encoding=UTF8', '--locale=C'],
  postgresFlags: ['-h', '127.0.0.1'],
  onLog: () => {},
  onError: (error) => console.error(String(error)),
})
if (!existsSync(path.join(databaseDir, 'PG_VERSION'))) await pg.initialise()
await pg.start()
const client = pg.getPgClient()
await client.connect()
const database = url.pathname.slice(1)
const existing = await client.query('SELECT 1 FROM pg_database WHERE datname=$1', [database])
await client.end()
if (!existing.rows.length) await pg.createDatabase(database)
console.log(`PostgreSQL ready on 127.0.0.1:${url.port}; persistent data in .local/postgres`)
let stopping = false
async function stop() {
  if (stopping) return
  stopping = true
  await pg.stop()
  process.exit(0)
}
process.on('SIGINT', stop)
process.on('SIGTERM', stop)
setInterval(() => {}, 60_000)
