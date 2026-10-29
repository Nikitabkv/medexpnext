import { before, after, test } from 'node:test'
import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import nextEnv from '@next/env'
import type { Payload } from 'payload'
import type { User } from '../../src/payload-types'
import { fixturePDF } from '../fixtures/pdf'
import { rateLimit } from '../../src/lib/rate-limit'

nextEnv.loadEnvConfig(process.cwd())
const { getPayload } = await import('payload')
const { default: config } = await import('../../src/payload.config')
let payload: Payload
let editor: User & { collection: 'users' }
let doctor: number, otherDoctor: number, document: number
let city: number, otherCity: number
const unique = randomUUID().slice(0,8)
before(async () => {
  payload = await getPayload({ config })
  const cities = await payload.find({ collection: 'cities', overrideAccess: true, sort: 'order', limit: 2 })
  city = cities.docs[0].id; otherCity = cities.docs[1].id
  const created = await payload.create({ collection: 'users', data: { name: 'Проверка прав', email: `test-${unique}@example.test`, password: randomUUID(), role: 'editor', cities: [city], modules: ['doctors', 'prices', 'reviews'] } })
  editor = { ...created, collection: 'users' } as unknown as typeof editor
})
after(async () => {
  if (document) await payload.delete({ collection: 'documents', id: document, overrideAccess: true })
  if (doctor) await payload.delete({ collection: 'doctors', id: doctor, overrideAccess: true })
  if (otherDoctor) await payload.delete({ collection: 'doctors', id: otherDoctor, overrideAccess: true })
  if (editor) await payload.delete({ collection: 'users', id: editor.id, overrideAccess: true })
})
test('regional editor can add own doctor, preserving a manually entered MIS ID', async () => {
  const created = await payload.create({ collection: 'doctors', overrideAccess: false, user: editor, data: { name: 'Тестовый врач', slug: `test-${unique}`, cities: [city], specialty: 'Терапевт', externalDoctorID: `000-${unique}`, status: 'draft' } })
  doctor = created.id
  assert.equal(created.externalDoctorID, `000-${unique}`)
  const publicResult = await payload.find({ collection: 'doctors', overrideAccess: false, where: { id: { equals: doctor } } })
  assert.equal(publicResult.totalDocs, 0)
})
test('regional editor cannot create, move, edit or delete records belonging to another city', async () => {
  await assert.rejects(payload.create({ collection: 'doctors', overrideAccess: false, user: editor, data: { name: 'Чужой врач', slug: `foreign-${unique}`, cities: [otherCity], specialty: 'Терапевт', status: 'draft' } }))
  await assert.rejects(payload.update({ collection: 'doctors', id: doctor, overrideAccess: false, user: editor, data: { cities: [otherCity] } }))
  const shared = await payload.create({ collection: 'doctors', data: { name: 'Общий врач', slug: `shared-${unique}`, cities: [city, otherCity], specialty: 'Терапевт', status: 'published' } })
  otherDoctor = shared.id
  await assert.rejects(payload.update({ collection: 'doctors', id: otherDoctor, overrideAccess: false, user: editor, data: { name: 'Изменён' } }))
  await assert.rejects(payload.delete({ collection: 'doctors', id: otherDoctor, overrideAccess: false, user: editor }))
})
test('editor cannot escalate own role, cities or modules', async () => {
  await payload.update({ collection: 'users', id: editor.id, user: editor, overrideAccess: false, data: { role: 'admin', cities: [otherCity], modules: ['content'] } })
  const actual = await payload.findByID({ collection: 'users', id: editor.id, overrideAccess: true })
  assert.equal(actual.role, 'editor')
  assert.deepEqual(actual.cities?.map(x => typeof x === 'object' ? x.id : x), [city])
  assert.deepEqual(actual.modules, ['doctors', 'prices', 'reviews'])
})
test('public doctor responses hide the MIS ID and document access follows parent publication', async () => {
  assert.ok(doctor)
  const file = fixturePDF()
  const created = await payload.create({ collection: 'documents', overrideAccess: false, user: editor, data: { title: 'Тестовый документ', doctor, kind: 'other', status: 'published' }, file: { data: file, mimetype: 'application/pdf', name: 'test.pdf', size: file.length } })
  document = created.id
  assert.equal((await payload.find({ collection: 'documents', overrideAccess: false, where: { id: { equals: document } } })).totalDocs, 0)
  await payload.update({ collection: 'doctors', id: doctor, overrideAccess: false, user: editor, data: { status: 'published' } })
  const publicDoctor = await payload.findByID({ collection: 'doctors', id: doctor, overrideAccess: false })
  assert.equal(publicDoctor.externalDoctorID, undefined)
  assert.equal((await payload.find({ collection: 'documents', overrideAccess: false, where: { id: { equals: document } } })).totalDocs, 1)
})
test('server rejects a forged PDF upload and cross-city document reassignment', async () => {
  const file = Buffer.from('<script>alert(1)</script>')
  await assert.rejects(payload.create({ collection: 'documents', overrideAccess: false, user: editor, data: { title: 'Подделка', doctor, kind: 'other', status: 'published' }, file: { data: file, mimetype: 'application/pdf', name: 'test.pdf', size: file.length } }))
  await assert.rejects(payload.update({ collection: 'documents', id: document, user: editor, overrideAccess: false, data: { doctor: otherDoctor } }))
})
test('moving a doctor to another city immediately revokes former editor access to documents', async () => {
  await payload.update({ collection: 'doctors', id: doctor, data: { cities: [otherCity] }, overrideAccess: true })
  const visible = await payload.find({ collection: 'documents', overrideAccess: false, user: editor, where: { id: { equals: document } } })
  assert.equal(visible.totalDocs, 0)
  await assert.rejects(payload.update({ collection: 'documents', id: document, overrideAccess: false, user: editor, data: { title: 'Чужой документ' } }))
})
test('PostgreSQL request limits are atomic under concurrent requests', async () => {
  const results = await Promise.all(Array.from({ length: 8 }, () => rateLimit('test-concurrency', unique, 3, 300_000)))
  assert.equal(results.filter(Boolean).length, 3)
  assert.equal(results.filter(value => !value).length, 5)
})
