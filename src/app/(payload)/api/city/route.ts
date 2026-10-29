import { cookies } from 'next/headers'
import { cms } from '@/lib/cms'
import { isAllowedOrigin, readLimitedJSON } from '@/lib/http-security'
export async function POST(request: Request) {
  if (!isAllowedOrigin(request.headers.get('origin'))) return new Response(null, { status: 403 })
  try {
    const body = await readLimitedJSON(request, 1024) as { city?: string }
    if (typeof body.city !== 'string' || !/^[a-z0-9-]{2,50}$/.test(body.city)) return new Response(null, { status: 400 })
    const payload = await cms()
    const cities = await payload.find({ collection: 'cities', overrideAccess: false, where: { slug: { equals: body.city } }, limit: 1 })
    if (!cities.docs.length) return new Response(null, { status: 400 })
    ;(await cookies()).set('medexp-city', body.city, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 31_536_000 })
    return Response.json({ ok: true })
  } catch { return new Response(null, { status: 400 }) }
}
