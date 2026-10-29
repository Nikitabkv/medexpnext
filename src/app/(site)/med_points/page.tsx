import type { Metadata } from 'next'
import Link from 'next/link'
import { getSiteContext, getBranches, objectRelation } from '@/lib/site-data'
import { PageIntro } from '@/components/PageIntro'
import type { City } from '@/payload-types'
import { Icon } from '@/components/Icon'
import { SyncCity } from '@/components/SyncCity'
export async function generateMetadata({ searchParams }: { searchParams: Promise<{ center?: string }> }): Promise<Metadata> {
  const params = await searchParams, { payload } = await getSiteContext()
  const branch = params.center ? (await payload.find({ collection: 'branches', overrideAccess: false, where: { legacyID: { equals: params.center.slice(0, 20) } }, depth: 0, limit: 1 })).docs[0] : undefined
  return { title: branch?.name || 'Наши центры', alternates: { canonical: branch ? `/med_points?center=${branch.legacyID}` : '/med_points' } }
}
export default async function Centers({ searchParams }: { searchParams: Promise<{ center?: string }> }) {
  const [params, { payload, city }, branches] = await Promise.all([searchParams, getSiteContext(), getBranches()])
  const selected = params.center ? (await payload.find({ collection: 'branches', overrideAccess: false, where: { legacyID: { equals: params.center.slice(0, 20) } }, depth: 1, limit: 1 })).docs[0] : undefined
  const shown = selected ? [selected] : branches
  const selectedCity = selected ? objectRelation<City>(selected.city) : undefined
  return <div className="container page-body">{selectedCity && <SyncCity target={selectedCity.slug} current={city.slug}/>}<PageIntro title="Наши центры" description="Адреса, контакты и режим работы."/>{selected && <Link href="/med_points" className="text-link back-link">Все центры выбранного города</Link>}<div className="centers-list">{shown.map((branch, i) => <article className="center-card" key={branch.id}><img src={`/reference/clinic-${i % 2 + 1}.jpg`} alt="Медицинский центр МедЭксперт" width="480" height="290"/><div><h2>{branch.name}</h2><p className="center-address"><Icon name="pin"/>{objectRelation<City>(branch.city)?.name} {branch.address}</p><p>{branch.hours}</p><a href="tel:88003330800">{branch.phone}</a>{branch.directions && <p className="preserve-lines muted">{branch.directions}</p>}<div className="center-actions"><a className="button" href="https://atlas-patient.ru/" target="_blank" rel="noopener noreferrer">Записаться</a><Link className="text-link" href={`/price?city=${objectRelation<City>(branch.city)?.slug || city.slug}&branch=${branch.id}`}>Услуги и цены <Icon name="arrow"/></Link></div></div></article>)}</div></div>
}
