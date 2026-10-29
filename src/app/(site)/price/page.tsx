import type { Metadata } from 'next'
import { getSiteContext, getPriceCatalog, formatPrice } from '@/lib/site-data'
import { PageIntro } from '@/components/PageIntro'
import { relationID } from '@/lib/access'
import { SyncCity } from '@/components/SyncCity'
import { PriceCatalogue, type CatalogueRow } from '@/components/PriceCatalogue'
import { resolveServicePrices } from '@/lib/price-catalog'

export const metadata: Metadata = { title: 'Услуги и цены', alternates: { canonical: '/price' } }
export default async function PricePage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams
  const [{ city, branches, categories, services }, currentContext] = await Promise.all([getPriceCatalog(params.city), getSiteContext()])
  const q = (params.q ?? '').slice(0, 100)
  const branch = branches.find(b => String(b.id) === params.branch)
  const category = categories.find(c => c.slug === (params.category || params.service)) ?? categories[0]
  const rows: CatalogueRow[] = []
  for (const { service, prices } of services.toSorted((a, b) => (a.service.order ?? 0) - (b.service.order ?? 0))) {
    if (q ? !service.name.toLocaleLowerCase('ru').includes(q.toLocaleLowerCase('ru')) : relationID(service.category) !== String(category?.id)) continue
    const result = resolveServicePrices(prices, branches, branch ? String(branch.id) : undefined)
    if (result) rows.push({ id: service.id, name: service.name, group: service.group || 'Услуги', amount: formatPrice(result.price), available: result.available.map(item => ({ branchID: item.branchID, amount: formatPrice(item.price) })) })
  }
  return <div className="container page-body price-page"><SyncCity target={city.slug} current={currentContext.city.slug}/><PageIntro title="Услуги и цены"/>
    <PriceCatalogue categories={categories.map(c => ({ id: c.id, slug: c.slug, shortName: c.shortName }))} branches={branches.map(b => ({ id: b.id, name: b.name, legacyID: b.legacyID, address: b.address, hours: b.hours }))} rows={rows} category={category?.slug || ''} title={q ? `Результаты поиска: ${q}` : category?.name || 'Услуги'} query={q} branch={branch ? String(branch.id) : ''} city={city.slug} cityNameIn={city.nameIn}/>
  </div>
}
