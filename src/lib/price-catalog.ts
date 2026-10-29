import type { Price, Branch, Category, Service } from '@/payload-types'
import { relationID } from './access'

export function buildPriceCatalog(prices: Price[], branches: Branch[], categories: Category[]) {
  const publishedBranches = branches.filter(branch => branch.status === 'published')
  const publishedCategories = categories.filter(category => category.status === 'published')
  const categoryIDs = new Set(publishedCategories.map(category => String(category.id)))
  const byService = new Map<number, { service: Service; prices: Price[] }>()
  for (const price of prices) {
    const service = typeof price.service === 'object' ? price.service : undefined
    if (!service || service.status !== 'published' || !categoryIDs.has(relationID(service.category))) continue
    const entry = byService.get(service.id)
    if (entry) entry.prices.push(price)
    else byService.set(service.id, { service, prices: [price] })
  }
  const services = [...byService.values()].filter(entry => resolveServicePrices(entry.prices, publishedBranches) !== null)
  const availableCategoryIDs = new Set(services.map(entry => relationID(entry.service.category)))
  return {
    branches: publishedBranches,
    categories: publishedCategories.filter(category => availableCategoryIDs.has(String(category.id))),
    services,
  }
}

export function resolveServicePrices(prices: Price[], branches: Pick<Branch, 'id'>[], selectedBranch?: string) {
  const fallback = prices.find(price => !price.branch)
  const available = branches.flatMap(branch => {
    const price = prices.find(p => relationID(p.branch) === String(branch.id)) ?? fallback
    return price?.available && price.status === 'published' ? [{ branchID: branch.id, price }] : []
  })
  const visible = selectedBranch ? available.filter(item => String(item.branchID) === selectedBranch) : available
  if (!visible.length) return null
  const ordered = [...visible].sort((a, b) => (a.price.kind === 'free' ? 0 : a.price.amount ?? Infinity) - (b.price.kind === 'free' ? 0 : b.price.amount ?? Infinity))
  const first = ordered[0].price
  const different = visible.some(item => item.price.kind !== first.kind || item.price.amount !== first.amount)
  return { price: { ...first, amount: first.kind === 'free' ? 0 : first.amount, kind: different && ['fixed', 'free'].includes(first.kind) ? 'from' as const : first.kind }, available }
}
