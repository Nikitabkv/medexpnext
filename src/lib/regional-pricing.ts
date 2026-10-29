import { APIError, type CollectionAfterChangeHook, type CollectionBeforeValidateHook, type FieldHook, type PayloadRequest } from 'payload'
import { z } from 'zod'
import type { Branch, Price } from '@/payload-types'
import { can, cityIDs, relationID, staff } from './access'

const rowSchema = z.object({ city: z.number().int().positive(), kind: z.enum(['fixed', 'from', 'free', 'onRequest']), amount: z.number().finite().min(0).max(1_000_000).nullable(), branches: z.array(z.number().int().positive()).max(200) }).strict().refine(row => !['fixed', 'from'].includes(row.kind) || row.amount !== null, 'Укажите цену города.')
const inputSchema = z.array(rowSchema).max(100)
export type RegionalPriceRow = z.infer<typeof rowSchema>
const contextKey = 'medexpRegionalPricing'
const allowedCity = (req: PayloadRequest, city: unknown) => staff(req)?.role === 'admin' || cityIDs(req).includes(relationID(city))

function rowsFromPrices(prices: Price[], branches: Branch[]): RegionalPriceRow[] {
  const cityIDs = [...new Set(prices.map(price => relationID(price.city)))].sort((a, b) => Number(a) - Number(b))
  return cityIDs.map(city => {
    const entries = prices.filter(price => relationID(price.city) === city)
    const base = entries.find(price => !price.branch) ?? entries.find(price => price.available) ?? entries[0]
    const available = branches.filter(branch => relationID(branch.city) === city && (entries.find(price => relationID(price.branch) === String(branch.id)) ?? entries.find(price => !price.branch))?.available)
    return { city: Number(city), kind: base.kind, amount: base.amount ?? null, branches: available.map(branch => branch.id).sort((a, b) => a - b) }
  })
}
async function load(req: PayloadRequest, serviceID: string | number) {
  const priceResult = await req.payload.find({ collection: 'prices', overrideAccess: false, req, where: { service: { equals: serviceID } }, limit: 2000, depth: 0 })
  const branchResult = await req.payload.find({ collection: 'branches', overrideAccess: false, req, limit: 1000, depth: 0 })
  return { prices: priceResult.docs.filter(price => allowedCity(req, price.city)), branches: branchResult.docs }
}
export const readRegionalPricing: FieldHook = async ({ req, siblingData }) => {
  if (!can(req, 'prices') || !siblingData.id) return undefined
  const { prices, branches } = await load(req, siblingData.id)
  return rowsFromPrices(prices, branches)
}
export const validateRegionalPricing: CollectionBeforeValidateHook = async ({ data, originalDoc, req }) => {
  if (!data) return data
  if (!data.code && !originalDoc?.code) data.code = `SVC-${crypto.randomUUID()}`
  if (req.user && staff(req)?.role !== 'admin' && originalDoc) {
    for (const field of ['name', 'category', 'group', 'code', 'order', 'status']) {
      if (data[field] !== undefined && relationID(data[field]) !== relationID(originalDoc[field])) throw new APIError('Название и раздел общей услуги изменяет администратор. Для ваших городов можно менять цены и филиалы.', 403)
    }
  }
  if (data.regionalPricing === undefined) return data
  if (!can(req, 'prices')) throw new APIError('Нет доступа к редактированию цен.', 403)
  const parsed = inputSchema.safeParse(data.regionalPricing)
  if (!parsed.success) throw new APIError('Проверьте цены и выбранные филиалы по городам.', 400)
  const rows = parsed.data.map(row => ({ ...row, branches: [...row.branches].sort((a, b) => a - b) }))
  if (new Set(rows.map(row => row.city)).size !== rows.length) throw new APIError('Город нельзя добавлять дважды.', 400)
  const branches = (await req.payload.find({ collection: 'branches', overrideAccess: true, req, limit: 1000, depth: 0 })).docs
  for (const row of rows) {
    if (!allowedCity(req, row.city)) throw new APIError('Изменение цен другого города запрещено.', 403)
    if (new Set(row.branches).size !== row.branches.length || row.branches.some(id => !branches.some(branch => branch.id === id && relationID(branch.city) === String(row.city)))) throw new APIError('Филиал должен принадлежать своему городу.', 400)
  }
  req.context[contextKey] = { rows, serviceID: originalDoc?.id }
  return data
}
export const saveRegionalPricing: CollectionAfterChangeHook = async ({ doc, req }) => {
  const input = req.context[contextKey] as { rows: RegionalPriceRow[]; serviceID?: number } | undefined
  if (!input || input.serviceID && input.serviceID !== doc.id) return doc
  delete req.context[contextKey]
  // Passing the original req keeps every nested price write in the service transaction.
  const { prices, branches } = await load(req, doc.id)
  const previous = rowsFromPrices(prices, branches)
  const selectedCities = new Set(input.rows.map(row => String(row.city)))
  for (const price of prices) if (!selectedCities.has(relationID(price.city))) await req.payload.delete({ collection: 'prices', id: price.id, overrideAccess: false, req })
  for (const row of input.rows) {
    const entries = prices.filter(price => relationID(price.city) === String(row.city))
    const previousRow = previous.find(item => item.city === row.city)
    if (JSON.stringify(previousRow) === JSON.stringify(row) && entries.every(price => price.status === doc.status)) continue
    const desired = [null, ...row.branches]
    for (const branch of desired) {
      const existing = entries.find(price => (relationID(price.branch) || null) === (branch ? String(branch) : null))
      const data = { service: doc.id, city: row.city, branch, kind: row.kind, amount: row.amount, available: branch !== null, status: doc.status as 'draft' | 'published' }
      if (existing) await req.payload.update({ collection: 'prices', id: existing.id, data, overrideAccess: false, req })
      else await req.payload.create({ collection: 'prices', data, overrideAccess: false, req })
    }
    for (const existing of entries) if (existing.branch && !row.branches.includes(Number(relationID(existing.branch)))) await req.payload.delete({ collection: 'prices', id: existing.id, overrideAccess: false, req })
  }
  return doc
}
