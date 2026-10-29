import type { Metadata } from 'next'
import Link from 'next/link'
import { getCategories } from '@/lib/site-data'
import { PageIntro } from '@/components/PageIntro'
import { Icon } from '@/components/Icon'
import { cms } from '@/lib/cms'
export async function generateMetadata({ searchParams }: { searchParams: Promise<{ service?: string }> }): Promise<Metadata> {
  const [params, payload] = await Promise.all([searchParams, cms()])
  // A section's canonical URL must not depend on the visitor's selected city.
  const selected = params.service ? (await payload.find({ collection: 'categories', overrideAccess: false, where: { slug: { equals: params.service } }, depth: 0, limit: 1 })).docs[0] : undefined
  return { title: selected?.name || 'Об услугах', alternates: { canonical: selected ? `/about_services?service=${selected.slug}` : '/about_services' } }
}
export default async function AboutServices({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const [params, categories] = await Promise.all([searchParams, getCategories()])
  const active = categories.find(c => c.slug === params.service) ?? categories[0]
  if (!active) return <div className="container page-body"><PageIntro title="Об услугах"/><p>В выбранном городе пока нет доступных услуг.</p></div>
  return <div className="container page-body"><PageIntro title="Об услугах"/><div className="catalog-layout"><aside className="category-rail"><h2>Виды услуг</h2>{categories.map(c => <Link key={c.id} href={`/about_services?service=${c.slug}`} aria-current={active?.id === c.id ? 'page' : undefined}>{c.shortName}<Icon name="chevron" width="16"/></Link>)}</aside><article className="prose service-description"><h2>{active?.name}</h2><p className="preserve-lines">{active?.description}</p>{active?.preparation && <><h3>Подготовка к исследованию</h3><p className="preserve-lines">{active.preparation}</p></>}<Link className="button" href={`/price?category=${active?.slug || ''}`}>Посмотреть цены <Icon name="arrow"/></Link></article></div></div>
}
