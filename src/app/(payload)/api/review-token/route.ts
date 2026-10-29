import { randomBytes } from 'node:crypto'
import { cookies } from 'next/headers'
import { cms } from '@/lib/cms'
import { createReviewToken } from '@/lib/review-security'
import { rateLimit } from '@/lib/rate-limit'

export async function GET() {
  await cms()
  const jar = await cookies()
  let session = jar.get('medexp-review-session')?.value
  if (!session || !/^[a-f0-9]{48}$/.test(session)) session = randomBytes(24).toString('hex')
  if (!await rateLimit('token-global', 'site', 1000, 3_600_000) || !await rateLimit('token-session', session, 30, 3_600_000)) {
    return Response.json({ error: 'Слишком много запросов. Попробуйте позже.' }, { status: 429, headers: { 'Retry-After': '3600' } })
  }
  jar.set('medexp-review-session', session, { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production', path: '/api', maxAge: 7200 })
  return Response.json({ token: createReviewToken(session) }, { headers: { 'Cache-Control': 'no-store' } })
}
