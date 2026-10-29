import test from 'node:test'
import assert from 'node:assert/strict'
import { checkReviewToken, createReviewToken, reviewSchema } from '../src/lib/review-security'
import { detectFileType } from '../src/lib/upload-security'
import { hasUnsafeKeys, readLimitedJSON } from '../src/lib/http-security'
import { assertCities } from '../src/lib/access'

process.env.REVIEW_TOKEN_SECRET = 'test-only-secret-not-used-by-the-application-123456789'
test('review tokens are signed, session-bound, expire and reject instant submissions', () => {
  const session = 'a'.repeat(48), timestamp = 1_793_000_000_000
  const token = createReviewToken(session, timestamp)
  assert.equal(checkReviewToken(token, session, timestamp + 1500), true)
  assert.equal(checkReviewToken(token, session, timestamp + 500), false)
  assert.equal(checkReviewToken(token, 'b'.repeat(48), timestamp + 1500), false)
  assert.equal(checkReviewToken(`${token.slice(0,-2)}xx`, session, timestamp + 1500), false)
  assert.equal(checkReviewToken(token, session, timestamp + 7_200_001), false)
})
test('submission schema rejects injected publication, replies, missing consent and honeypot data', () => {
  const input = { name: 'Анна', text: 'Спасибо за внимательное отношение.', rating: 5, city: 1, branch: 1, consent: true, website: '', token: 'a'.repeat(80) }
  assert.equal(reviewSchema.safeParse(input).success, true)
  for (const patch of [{ status: 'published' }, { reply: 'injected' }, { consent: false }, { website: 'spam' }, { rating: 6 }, { doctor: -1 }]) assert.equal(reviewSchema.safeParse({ ...input, ...patch }).success, false)
})
test('unsafe JSON keys and excessively nested objects are rejected', () => {
  assert.equal(hasUnsafeKeys(JSON.parse('{"__proto__":{"admin":true}}')), true)
  assert.equal(hasUnsafeKeys({ user: { constructor: { prototype: {} } } }), true)
  assert.equal(hasUnsafeKeys({ text: '<script>alert(1)</script>' }), false)
  assert.equal(hasUnsafeKeys({ name: 'Анна' }), false)
})
test('request body limit works even without content-length', async () => {
  const request = new Request('http://localhost', { method: 'POST', body: JSON.stringify({ text: 'x'.repeat(200) }) })
  await assert.rejects(readLimitedJSON(request, 50), /BODY_TOO_LARGE/)
})
test('upload signature detection rejects HTML and SVG disguised as images or PDF', () => {
  assert.equal(detectFileType(Buffer.from('<svg onload="alert(1)"></svg>')), null)
  assert.equal(detectFileType(Buffer.from('<html>not a PDF</html>')), null)
  assert.equal(detectFileType(Buffer.from('%PDF-1.4\nfixture')), 'application/pdf')
  assert.equal(detectFileType(Buffer.from([255,216,255,0])), 'image/jpeg')
})
test('an editor without module permission cannot change city-scoped records', () => {
  const req = { user: { id: 1, collection: 'users', role: 'editor', cities: [1], modules: ['reviews'] } } as never
  assert.throws(() => assertCities(req, [1], 'prices'), /Нет доступа/)
})
