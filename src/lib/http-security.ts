export async function readLimitedJSON(request: Request, maxBytes = 16_384): Promise<unknown> {
  const length = Number(request.headers.get('content-length') ?? 0)
  if (length > maxBytes) throw new Error('BODY_TOO_LARGE')
  if (!request.body) throw new Error('INVALID_JSON')
  const reader = request.body.getReader()
  let size = 0
  const chunks: Uint8Array[] = []
  try {
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > maxBytes) { await reader.cancel(); throw new Error('BODY_TOO_LARGE') }
      chunks.push(value)
    }
  } finally { reader.releaseLock() }
  const parsed = JSON.parse(Buffer.concat(chunks).toString('utf8'))
  if (hasUnsafeKeys(parsed)) throw new Error('UNSAFE_KEYS')
  return parsed
}
export function hasUnsafeKeys(value: unknown, depth = 0): boolean {
  if (depth > 25) return true
  if (!value || typeof value !== 'object') return false
  return Object.entries(value).some(([key, child]) => ['__proto__', 'prototype', 'constructor'].includes(key) || hasUnsafeKeys(child, depth + 1))
}
export function isAllowedOrigin(origin: string | null): boolean {
  const expected = process.env.SERVER_URL || 'http://localhost:3100'
  if (origin === expected) return true
  return process.env.NODE_ENV !== 'production' && ['http://127.0.0.1:3100', 'http://localhost:3100'].includes(origin ?? '')
}
