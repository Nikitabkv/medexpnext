import { test } from 'node:test'
import assert from 'node:assert/strict'
import type { Price, Branch, Category, Service } from '../src/payload-types'
import { buildPriceCatalog, resolveServicePrices } from '../src/lib/price-catalog'
const price = (id: number, data: Partial<Price>) => ({ id, service: 1, city: 1, kind: 'fixed', amount: 100, available: true, status: 'published', ...data } as Price)
const branches = [{ id: 1 }, { id: 2 }]
test('branch exclusions override an available city price', () => {
  const result = resolveServicePrices([price(1, {}), price(2, { branch: 2, available: false })], branches)
  assert.deepEqual(result?.available.map(item => item.branchID), [1])
  assert.equal(resolveServicePrices([price(1, {}), price(2, { branch: 2, available: false })], branches, '2'), null)
})
test('explicit branch-only offerings do not leak into other branches', () => {
  const result = resolveServicePrices([price(1, { available: false }), price(2, { branch: 2, amount: 250 })], branches)
  assert.equal(result?.price.amount, 250)
  assert.deepEqual(result?.available.map(item => item.branchID), [2])
})
test('different branch prices show the minimum with from and resolve an exact branch price', () => {
  const data = [price(1, { branch: 1, amount: 200 }), price(2, { branch: 2, amount: 350 })]
  assert.equal(resolveServicePrices(data, branches)?.price.kind, 'from')
  assert.equal(resolveServicePrices(data, branches)?.price.amount, 200)
  assert.equal(resolveServicePrices(data, branches, '2')?.price.amount, 350)
  assert.equal(resolveServicePrices(data, branches, '2')?.price.kind, 'fixed')
})
test('one free branch does not label a paid offering as free everywhere', () => {
  const result = resolveServicePrices([price(1, { branch: 1, kind: 'free' }), price(2, { branch: 2, amount: 350 })], branches)
  assert.equal(result?.price.kind, 'from')
  assert.equal(result?.price.amount, 0)
})

const category = (id: number, status: Category['status'] = 'published') => ({ id, status } as Category)
const service = (id: number, category: number, status: Service['status'] = 'published') => ({ id, category, status } as Service)
const branch = (id: number, status: Branch['status'] = 'published') => ({ id, status } as Branch)

test('a category with an available service appears without any manual city assignment', () => {
  const result = buildPriceCatalog([price(1, { service: service(1, 7), branch: 1 })], [branch(1)], [category(7), category(8)])
  assert.deepEqual(result.categories.map(item => item.id), [7])
  assert.deepEqual(result.services.map(item => item.service.id), [1])
})

test('a published service and price at a draft branch stay hidden until that branch is published', () => {
  const prices = [price(1, { service: service(1, 7), branch: 2, kind: 'free', amount: null })]
  const hidden = buildPriceCatalog(prices, [branch(1), branch(2, 'draft')], [category(7)])
  assert.equal(hidden.services.length, 0)
  assert.equal(hidden.categories.length, 0)
  const visible = buildPriceCatalog(prices, [branch(1), branch(2)], [category(7)])
  assert.deepEqual(visible.categories.map(item => item.id), [7])
  assert.deepEqual(resolveServicePrices(visible.services[0].prices, visible.branches)?.available.map(item => item.branchID), [2])
})

test('draft services, draft prices, draft categories and excluded branches do not create menu sections', () => {
  const prices = [
    price(1, { service: service(1, 1, 'draft'), branch: 1 }),
    price(2, { service: service(2, 2), branch: 1, status: 'draft' }),
    price(3, { service: service(3, 3), branch: 1 }),
    price(4, { service: service(4, 4), branch: 1, available: false }),
  ]
  const result = buildPriceCatalog(prices, [branch(1)], [category(1), category(2), category(3, 'draft'), category(4)])
  assert.equal(result.services.length, 0)
  assert.equal(result.categories.length, 0)
})

test('a category disappears after its last available service is removed while other section order is preserved', () => {
  const categories = [category(9), category(7), category(8)]
  const prices = [price(1, { service: service(1, 7), branch: 1 }), price(2, { service: service(2, 9), branch: 1 })]
  assert.deepEqual(buildPriceCatalog(prices, [branch(1)], categories).categories.map(item => item.id), [9, 7])
  assert.deepEqual(buildPriceCatalog(prices.slice(1), [branch(1)], categories).categories.map(item => item.id), [9])
})
