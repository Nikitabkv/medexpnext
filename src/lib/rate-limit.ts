import pg from 'pg'
import { readFileSync } from 'node:fs'
import { privateDigest } from './review-security'

const globalPool = globalThis as unknown as { medexpRatePool?: pg.Pool }
function pool() {
  return globalPool.medexpRatePool ??= new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    max: 3,
    ...(process.env.DATABASE_CA_FILE ? { ssl: { ca: readFileSync(process.env.DATABASE_CA_FILE, 'utf8'), rejectUnauthorized: true } } : {}),
  })
}
export async function rateLimit(scope: string, identity: string, limit: number, durationMs: number): Promise<boolean> {
  const bucket = Math.floor(Date.now() / durationMs)
  const key = privateDigest(`${scope}:${identity}:${bucket}`)
  const expiresAt = new Date((bucket + 1) * durationMs)
  // Atomic across processes and instances, unlike a process-local Map.
  const result = await pool().query(`INSERT INTO rate_limits (key, count, expires_at, created_at, updated_at)
    VALUES ($1, 1, $2, NOW(), NOW())
    ON CONFLICT (key) DO UPDATE SET count = rate_limits.count + 1, updated_at = NOW()
    RETURNING count`, [key, expiresAt])
  await pool().query('DELETE FROM rate_limits WHERE expires_at < NOW() - INTERVAL \'1 day\'')
  return Number(result.rows[0].count) <= limit
}
