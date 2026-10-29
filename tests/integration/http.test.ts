import { before, after, test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import nextEnv from '@next/env'
import { fixturePDF } from '../fixtures/pdf'
nextEnv.loadEnvConfig(process.cwd())

const base = 'http://127.0.0.1:3100'
const credentials = JSON.parse(await readFile('.local/bootstrap.json', 'utf8'))
const ids = JSON.parse(await readFile('.local/seed-ids.json', 'utf8'))
let adminToken = '', editorToken = '', reviewID = 0, doctorID = 0, docID = 0
const unique = randomUUID().slice(0,8)
function headers(token?: string) { return { 'Content-Type': 'application/json', Origin: base, ...(token ? { Authorization: `JWT ${token}` } : {}) } }
async function login(email: string, password: string) {
  const response = await fetch(`${base}/api/users/login`, { method: 'POST', headers: headers(), body: JSON.stringify({ email, password }) })
  assert.equal(response.status, 200, 'staff login must work')
  return (await response.json()).token as string
}
before(async () => {
  adminToken = await login(credentials.adminEmail, credentials.adminPassword)
  editorToken = await login(credentials.editorEmail, credentials.editorPassword)
})
after(async () => {
  for (const [collection, id] of [['documents', docID], ['doctors', doctorID], ['reviews', reviewID]] as const) if (id) await fetch(`${base}/api/${collection}/${id}`, { method: 'DELETE', headers: headers(adminToken) })
})
test('anonymous API creation, staff enumeration and bootstrap registration are denied', async () => {
  for (const path of ['/api/users', '/api/audit-log', '/api/rate-limits']) {
    const response = await fetch(base + path)
    const body = await response.json()
    assert.ok([401,403].includes(response.status) || body.totalDocs === 0, `${path} must not expose records`)
  }
  for (const collection of ['users', 'reviews', 'doctors', 'documents']) {
    const response = await fetch(`${base}/api/${collection}`, { method: 'POST', headers: headers(), body: JSON.stringify({ name: 'attack', status: 'published', role: 'admin' }) })
    assert.ok([401,403].includes(response.status), `anonymous ${collection} creation denied`)
  }
  const bootstrap = await fetch(`${base}/api/users/first-register`, { method: 'POST', headers: headers(), body: '{}' })
  assert.equal(bootstrap.status, 403)
})
test('prototype keys and foreign origins are rejected before mutation', async () => {
  const poisoned = await fetch(`${base}/api/users/${ids.doctors[0]}`, { method: 'PATCH', headers: headers(adminToken), body: '{"__proto__":{"role":"admin"}}' })
  assert.equal(poisoned.status, 400)
  const foreign = await fetch(`${base}/api/review-submissions`, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://evil.example' }, body: '{}' })
  assert.equal(foreign.status, 403)
})
test('document file route enforces publication of the file and its parent doctor', async () => {
  const doctor = await fetch(`${base}/api/doctors`, { method: 'POST', headers: headers(adminToken), body: JSON.stringify({ name: 'HTTP проверка', slug: `http-${unique}`, specialty: 'Терапевт', cities: [ids.voronezh], status: 'draft', externalDoctorID: `000-http-${unique}` }) })
  assert.equal(doctor.status, 201)
  doctorID = (await doctor.json()).doc.id
  const form = new FormData()
  form.set('_payload', JSON.stringify({ title: 'Документ для HTTP-проверки', doctor: doctorID, kind: 'other', status: 'published' }))
  form.set('file', new Blob([fixturePDF()], { type: 'application/pdf' }), 'http-test.pdf')
  const uploaded = await fetch(`${base}/api/documents`, { method: 'POST', headers: { Authorization: `JWT ${adminToken}`, Origin: base }, body: form })
  assert.equal(uploaded.status, 201, await uploaded.clone().text())
  const document = (await uploaded.json()).doc
  docID = document.id
  const fileURL = `${base}${new URL(document.url).pathname}`
  assert.ok([401,403,404].includes((await fetch(fileURL)).status), 'file attached to draft doctor must be private')
  const publish = await fetch(`${base}/api/doctors/${doctorID}`, { method: 'PATCH', headers: headers(adminToken), body: JSON.stringify({ status: 'published' }) })
  assert.equal(publish.status, 200)
  const file = await fetch(fileURL)
  assert.equal(file.status, 200)
  assert.equal(file.headers.get('x-content-type-options'), 'nosniff')
  assert.match(file.headers.get('content-disposition') ?? '', /attachment/)
  const publicDoctor = await (await fetch(`${base}/api/doctors/${doctorID}`)).json()
  assert.equal(publicDoctor.externalDoctorID, undefined)
})
test('review flows through pending, rejected, published and separately published official reply', async () => {
  const tokenResponse = await fetch(`${base}/api/review-token`)
  assert.equal(tokenResponse.status, 200)
  const cookie = tokenResponse.headers.getSetCookie().map(c => c.split(';')[0]).join('; ')
  const { token } = await tokenResponse.json()
  const input = { name: `Проверка ${unique}`, text: 'Тест отправки отзыва через публичную форму.', rating: 5, city: ids.voronezh, branch: ids.v1, consent: true, website: '', token }
  await new Promise(resolve => setTimeout(resolve, 1200))
  const injected = await fetch(`${base}/api/review-submissions`, { method: 'POST', headers: { ...headers(), Cookie: cookie }, body: JSON.stringify({ ...input, status: 'published', reply: 'attack' }) })
  assert.equal(injected.status, 400)
  const sent = await fetch(`${base}/api/review-submissions`, { method: 'POST', headers: { ...headers(), Cookie: cookie }, body: JSON.stringify(input) })
  assert.equal(sent.status, 201, await sent.clone().text())
  const found = await (await fetch(`${base}/api/reviews?where[name][equals]=${encodeURIComponent(input.name)}`, { headers: headers(adminToken) })).json()
  reviewID = found.docs[0].id
  assert.equal(found.docs[0].status, 'pending')
  assert.equal((await fetch(`${base}/api/reviews/${reviewID}`)).status, 404)
  const replay = await fetch(`${base}/api/review-submissions`, { method: 'POST', headers: { ...headers(), Cookie: cookie }, body: JSON.stringify(input) })
  assert.equal(replay.status, 409)
  let changed = await fetch(`${base}/api/reviews/${reviewID}`, { method: 'PATCH', headers: headers(editorToken), body: JSON.stringify({ status: 'rejected', reply: 'Спасибо за отзыв.', replyPublished: true }) })
  assert.equal(changed.status, 200)
  assert.equal((await fetch(`${base}/api/reviews/${reviewID}`)).status, 404)
  changed = await fetch(`${base}/api/reviews/${reviewID}`, { method: 'PATCH', headers: headers(editorToken), body: JSON.stringify({ status: 'published', replyPublished: false }) })
  assert.equal(changed.status, 200)
  let publicReview = await (await fetch(`${base}/api/reviews/${reviewID}`)).json()
  assert.equal(publicReview.reply, undefined)
  for (const field of ['contactEmail','moderationNote','consentAt','consentVersion','submissionKey']) assert.equal(publicReview[field], undefined)
  changed = await fetch(`${base}/api/reviews/${reviewID}`, { method: 'PATCH', headers: headers(editorToken), body: JSON.stringify({ replyPublished: true }) })
  assert.equal(changed.status, 200)
  publicReview = await (await fetch(`${base}/api/reviews/${reviewID}`)).json()
  assert.equal(publicReview.reply, 'Спасибо за отзыв.')
})
test('security response headers and legacy URLs are served', async () => {
  for (const path of ['/price.php','/news.php#80','/about_services?service=mrt','/med_points?center=19']) {
    const response = await fetch(base + path)
    assert.equal(response.status, 200, path)
    assert.match(response.headers.get('content-security-policy') ?? '', /nonce-/)
    assert.equal(response.headers.get('x-frame-options'), 'DENY')
    assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow')
  }
})
test('legacy branch URLs retain their canonical and explicit city prices render the right city', async () => {
  const branch = await (await fetch(`${base}/med_points?center=19`)).text()
  assert.match(branch, /href="http:\/\/localhost:3100\/med_points\?center=19"/)
  const service = await (await fetch(`${base}/about_services?service=kt`)).text()
  assert.match(service, /href="http:\/\/localhost:3100\/about_services\?service=kt"/)
  const prices = await (await fetch(`${base}/price?city=belgorod&branch=${ids.b1}`)).text()
  assert.ok(prices.replace(/<!--.*?-->/g, '').includes('Голова: услуги и цены в Белгороде'))
})
