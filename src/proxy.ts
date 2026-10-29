import { NextResponse, type NextRequest } from 'next/server'
import { readLimitedJSON } from '@/lib/http-security'

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  if (pathname === '/api/users/first-register') return Response.json({ error: 'Регистрация закрыта.' }, { status: 403 })
  // Defense in depth for a currently unpatched deepmerge advisory in upstream Payload.
  if (pathname.startsWith('/api/') && ['POST', 'PATCH', 'PUT'].includes(request.method) && request.headers.get('content-type')?.includes('application/json')) {
    try { await readLimitedJSON(request.clone(), 131_072) }
    catch (error) { return Response.json({ error: 'Некорректный запрос.' }, { status: (error as Error).message === 'BODY_TOO_LARGE' ? 413 : 400 }) }
  }
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const dev = process.env.NODE_ENV !== 'production'
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}'${dev ? " 'unsafe-eval'" : ''}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    `connect-src 'self'${dev ? ' ws: wss:' : ''}`,
    "worker-src 'self' blob:",
    'frame-src https://rutube.ru',
    "object-src 'none'", "base-uri 'self'", "form-action 'self'", "frame-ancestors 'none'",
  ].join('; ')
  const headers = new Headers(request.headers)
  headers.set('x-nonce', nonce)
  headers.set('Content-Security-Policy', csp)
  const response = NextResponse.next({ request: { headers } })
  response.headers.set('Content-Security-Policy', csp)
  if (pathname.startsWith('/api/') || pathname.startsWith('/admin')) response.headers.set('Cache-Control', 'private, no-store')
  if (pathname.startsWith('/api/documents/file/')) {
    response.headers.set('Content-Disposition', 'attachment')
    response.headers.set('Content-Security-Policy', "default-src 'none'; sandbox")
  }
  if (pathname.startsWith('/documents/') && pathname.endsWith('.pdf')) {
    response.headers.set('Content-Security-Policy', "default-src 'none'; sandbox")
    response.headers.set('Content-Disposition', 'attachment')
  }
  if (process.env.ALLOW_INDEXING !== 'true' || pathname.startsWith('/admin') || pathname.startsWith('/api/')) response.headers.set('X-Robots-Tag', 'noindex, nofollow')
  if (!dev && request.nextUrl.protocol === 'https:') response.headers.set('Strict-Transport-Security', 'max-age=31536000')
  return response
}
export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico|reference/).*)'] }
