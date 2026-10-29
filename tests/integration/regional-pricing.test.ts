import { before, after, test } from 'node:test'
import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import nextEnv from '@next/env'
import type { Payload } from 'payload'
import type { User, Branch } from '../../src/payload-types'
import type { RegionalPriceRow } from '../../src/lib/regional-pricing'
import { resolveServicePrices } from '../../src/lib/price-catalog'
nextEnv.loadEnvConfig(process.cwd())
const { getPayload } = await import('payload')
const { default: config } = await import('../../src/payload.config')
let payload: Payload, admin: User & { collection: 'users' }, editor: User & { collection: 'users' }
let serviceID = 0, categoryID: number, cities: number[], branches: Branch[]
const unique = randomUUID().slice(0, 8)
const row = (city: number, amount: number, branch: number): RegionalPriceRow => ({ city, amount, kind: 'fixed', branches: [branch] })
const prices = async () => (await payload.find({ collection: 'prices', where: { service: { equals: serviceID } }, overrideAccess: true, depth: 0, limit: 100 })).docs
before(async () => {
  payload = await getPayload({ config })
  cities = (await payload.find({ collection: 'cities', sort: 'order', limit: 2 })).docs.map(city => city.id)
  categoryID = (await payload.find({ collection: 'categories', sort: 'order', limit: 1 })).docs[0].id
  branches = (await payload.find({ collection: 'branches', depth: 0, limit: 100 })).docs
  admin = { ...await payload.create({ collection: 'users', data: { name: 'Тест карточки цены', email: `pricing-admin-${unique}@example.test`, password: randomUUID(), role: 'admin' } }), collection: 'users' }
  editor = { ...await payload.create({ collection: 'users', data: { name: 'Тест редактора цены', email: `pricing-editor-${unique}@example.test`, password: randomUUID(), role: 'editor', modules: ['prices'], cities: [cities[0]] } }), collection: 'users' }
})
after(async () => {
  if (serviceID) { for (const price of await prices()) await payload.delete({ collection: 'prices', id: price.id }); await payload.delete({ collection: 'services', id: serviceID }) }
  if (admin) await payload.delete({ collection: 'users', id: admin.id })
  if (editor) await payload.delete({ collection: 'users', id: editor.id })
})
test('one service saves both city prices and exact branch availability', async () => {
  const first = branches.find(branch => Number(branch.city) === cities[0])!, second = branches.find(branch => Number(branch.city) === cities[1])!
  const service = await payload.create({ collection: 'services', overrideAccess: false, user: admin, data: { name: `Проверка цены ${unique}`, code: `QA-${unique}`, category: categoryID, status: 'published', regionalPricing: [row(cities[0], 125, first.id), row(cities[1], 225, second.id)] } })
  serviceID = service.id
  const actual = await prices()
  assert.equal(actual.length, 4)
  const own = resolveServicePrices(actual.filter(price => price.city === cities[0]), branches.filter(branch => branch.city === cities[0]))!
  assert.deepEqual(own.available.map(item => item.branchID), [first.id])
  assert.equal(own.price.amount, 125)
  const adminView = await payload.findByID({ collection: 'services', id: serviceID, overrideAccess: false, user: admin, depth: 0 })
  assert.equal((adminView.regionalPricing as RegionalPriceRow[]).length, 2)
  const publicView = await payload.findByID({ collection: 'services', id: serviceID, overrideAccess: false, depth: 0 })
  assert.equal(publicView.regionalPricing, undefined)
})
test('regional editor sees and changes only own city without erasing other city prices', async () => {
  const view = await payload.findByID({ collection: 'services', id: serviceID, overrideAccess: false, user: editor, depth: 0 })
  const rows = view.regionalPricing as RegionalPriceRow[]
  assert.deepEqual(rows.map(item => item.city), [cities[0]])
  const foreignBefore = (await prices()).filter(price => price.city === cities[1]).map(price => [price.id, price.amount, price.branch, price.available])
  await payload.update({ collection: 'services', id: serviceID, overrideAccess: false, user: editor, data: { regionalPricing: [{ ...rows[0], amount: 175 }] } })
  const actual = await prices()
  assert.equal(actual.find(price => price.city === cities[0] && price.branch)?.amount, 175)
  assert.deepEqual(actual.filter(price => price.city === cities[1]).map(price => [price.id, price.amount, price.branch, price.available]), foreignBefore)
})
test('forged city and foreign branches are rejected and shared metadata stays protected', async () => {
  const foreign = branches.find(branch => branch.city === cities[1])!
  const before = (await prices()).map(price => [price.id, price.amount])
  await assert.rejects(payload.create({ collection: 'services', overrideAccess: false, user: editor, data: { name: `Попытка редактора ${unique}`, code: `forged-${unique}`, category: categoryID, status: 'draft' } }))
  await assert.rejects(payload.update({ collection: 'services', id: serviceID, overrideAccess: false, user: editor, data: { regionalPricing: [row(cities[1], 1, foreign.id)] } }))
  await assert.rejects(payload.update({ collection: 'services', id: serviceID, overrideAccess: false, user: editor, data: { regionalPricing: [row(cities[0], 1, foreign.id)] } }))
  await payload.update({ collection: 'services', id: serviceID, overrideAccess: false, user: editor, data: { name: 'Чужое название' } })
  assert.equal((await payload.findByID({ collection: 'services', id: serviceID })).name, `Проверка цены ${unique}`)
  assert.deepEqual((await prices()).map(price => [price.id, price.amount]), before)
})
test('a nested price write failure rolls back the complete service edit', async () => {
  const hooks = payload.collections.prices.config.hooks!.beforeChange!
  const guard = (args: any) => { if (args.data.service === serviceID && args.data.city === cities[1]) throw new Error('Expected rollback'); return args.data }
  hooks.push(guard)
  const before = (await prices()).map(price => [price.id, price.amount])
  try {
    await assert.rejects(payload.update({ collection: 'services', id: serviceID, overrideAccess: false, user: admin, data: { name: `Не сохранить ${unique}`, regionalPricing: cities.map((city, index) => row(city, 1000 + index, branches.find(branch => branch.city === city)!.id)) } }))
    assert.deepEqual((await prices()).map(price => [price.id, price.amount]), before)
    assert.equal((await payload.findByID({ collection: 'services', id: serviceID })).name, `Проверка цены ${unique}`)
  } finally { hooks.splice(hooks.indexOf(guard), 1) }
})
test('removing own city never removes another city offering', async () => {
  await payload.update({ collection: 'services', id: serviceID, overrideAccess: false, user: editor, data: { regionalPricing: [] } })
  const remaining = await prices()
  assert.ok(remaining.length > 0)
  assert.ok(remaining.every(price => price.city === cities[1]))
})
test('deleting a service card deletes its own normalized prices', async () => {
  const id = serviceID
  await payload.delete({ collection: 'services', id, overrideAccess: false, user: admin })
  assert.equal((await payload.find({ collection: 'prices', where: { service: { equals: id } }, overrideAccess: true })).totalDocs, 0)
  serviceID = 0
})
