import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto'
import { z } from 'zod'

function secret() {
  const key = process.env.REVIEW_TOKEN_SECRET
  if (!key || key.length < 32) throw new Error('REVIEW_TOKEN_SECRET must contain at least 32 random characters.')
  return key
}
function signature(value: string) { return createHmac('sha256', secret()).update(value).digest('base64url') }
export function createReviewToken(session: string, now = Date.now()): string {
  const content = `${now}.${randomBytes(16).toString('hex')}`
  return `${content}.${signature(`${session}.${content}`)}`
}
export function checkReviewToken(token: string, session: string, now = Date.now()): boolean {
  if (!/^[a-f0-9]{48}$/.test(session)) return false
  const parts = token.split('.')
  if (parts.length !== 3 || !/^\d{13}$/.test(parts[0]) || !/^[a-f0-9]{32}$/.test(parts[1])) return false
  const age = now - Number(parts[0])
  if (age < 1000 || age > 2 * 60 * 60 * 1000) return false
  const expected = signature(`${session}.${parts[0]}.${parts[1]}`)
  const a = Buffer.from(expected), b = Buffer.from(parts[2])
  return a.length === b.length && timingSafeEqual(a, b)
}
export const reviewSchema = z.object({
  name: z.string().trim().min(2).max(80),
  text: z.string().trim().min(10).max(3000),
  rating: z.number().int().min(1).max(5),
  city: z.number().int().positive(),
  branch: z.number().int().positive(),
  doctor: z.number().int().positive().optional(),
  contactEmail: z.union([z.email().max(254), z.literal('')]).optional(),
  consent: z.literal(true),
  website: z.literal(''),
  token: z.string().min(50).max(200),
}).strict()
export function privateDigest(value: string): string { return signature(value) }
