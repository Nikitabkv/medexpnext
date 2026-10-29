import type { Metadata } from 'next'
import { getDoctors, getBranches } from '@/lib/site-data'
import { DoctorCard } from '@/components/DoctorCard'
import { PageIntro } from '@/components/PageIntro'
import { LegacyDoctorLink } from '@/components/LegacyDoctorLink'
import { Icon } from '@/components/Icon'
import { CustomSelect } from '@/components/CustomSelect'
import { relationID } from '@/lib/access'
export const metadata: Metadata = { title: 'Специалисты', alternates: { canonical: '/specialists' } }
export default async function Specialists({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const [params, doctors, branches] = await Promise.all([searchParams, getDoctors(), getBranches()])
  const q = (params.q ?? '').slice(0, 100), specialty = params.specialty ?? '', branch = params.branch ?? ''
  const specialties = [...new Set(doctors.map(d => d.specialty))]
  const filtered = doctors.filter(d => d.name.toLocaleLowerCase('ru').includes(q.toLocaleLowerCase('ru')) && (!specialty || d.specialty === specialty) && (!branch || d.branches?.map(relationID).includes(branch)))
  return <div className="container page-body"><PageIntro title="Специалисты" description="Выберите врача и удобный филиал."/><LegacyDoctorLink/>
    <form className="filter-bar" action="/specialists"><label className="search-control"><Icon name="search"/><span className="sr-only">Поиск по ФИО</span><input name="q" placeholder="Поиск по ФИО" defaultValue={q} maxLength={100}/></label><CustomSelect label="Специальность" name="specialty" defaultValue={specialty} options={[{ value: '', label: 'Все специальности' }, ...specialties.map(s => ({ value: s, label: s }))]}/><CustomSelect label="Филиал" name="branch" defaultValue={branch} options={[{ value: '', label: 'Все центры' }, ...branches.map(b => ({ value: String(b.id), label: b.address }))]}/><button className="button" type="submit">Найти</button></form>
    {filtered.length ? <div className="doctors-grid">{filtered.map(d => <DoctorCard key={d.id} doctor={d}/>)}</div> : <div className="empty-state"><h2>Врачи не найдены</h2><p>Попробуйте изменить имя, специальность или филиал.</p><a className="text-link" href="/specialists">Сбросить фильтры</a></div>}
  </div>
}
