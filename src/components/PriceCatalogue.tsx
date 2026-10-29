'use client'
import { useState } from 'react'
import Link from 'next/link'
import { CustomSelect } from './CustomSelect'
import { Icon } from './Icon'

export type CatalogueRow = { id: number; name: string; group: string; amount: string; available: { branchID: number; amount: string }[] }
type Props = { categories: { id: number; slug: string; shortName: string }[]; branches: { id: number; legacyID?: string | null; name: string; address: string; hours: string }[]; rows: CatalogueRow[]; category: string; title: string; query: string; branch: string; city: string; cityNameIn: string }

export function PriceCatalogue({ categories, branches, rows, category, title, query, branch, city, cityNameIn }: Props) {
  const [hovered, setHovered] = useState<number | null>(null), [pinned, setPinned] = useState<number | null>(null)
  const selected = rows.find(row => row.id === (hovered ?? pinned))
  const groups = new Map<string, CatalogueRow[]>()
  for (const row of rows) groups.set(row.group, [...(groups.get(row.group) ?? []), row])
  const pin = (id: number) => { setHovered(id); setPinned(current => current === id ? null : id) }
  const centreList = (row: CatalogueRow) => <div className="mobile-centres"><strong>Где пройти исследование</strong>{branches.filter(b => row.available.some(a => a.branchID === b.id)).map(b => <Link href={`/med_points?center=${b.legacyID || b.id}`} key={b.id}><Icon name="hospital"/><span>{b.address}<small>{row.available.find(a => a.branchID === b.id)?.amount}</small></span><Icon name="arrow" width="16" height="16"/></Link>)}</div>
  return <div className="prices-workspace">
    <aside className="price-directions"><h2>Виды услуг</h2><nav aria-label="Разделы прайса">{categories.map(c => <Link key={c.id} href={`/price?category=${c.slug}&city=${city}${branch ? `&branch=${branch}` : ''}`} aria-current={!query && category === c.slug ? 'page' : undefined}><Icon name={c.slug} width="26" height="26"/><span>{c.shortName}</span><Icon name="chevron" width="14" height="14"/></Link>)}</nav><a className="button" href="https://atlas-patient.ru/" target="_blank" rel="noopener noreferrer">Записаться онлайн <Icon name="arrow" width="17" height="17"/></a></aside>
    <section className="price-table-panel" aria-label="Каталог цен">
      <form action="/price" className="price-toolbar"><label className="search-control"><Icon name="search"/><span className="sr-only">Поиск услуги</span><input name="q" placeholder="Введите название услуги" defaultValue={query} maxLength={100}/></label><CustomSelect label="Филиал" name="branch" defaultValue={branch} options={[{ value: '', label: 'Все центры' }, ...branches.map(b => ({ value: String(b.id), label: b.address }))]}/><input type="hidden" name="category" value={category}/><input type="hidden" name="city" value={city}/><button className="button">Найти</button></form>
      <h2 className="price-category-heading"><Icon name={category} width="29" height="29"/>{title}</h2><p className="price-instruction" id="price-help"><Icon name="hospital" width="17" height="17"/>Наведите на услугу, чтобы увидеть центры. Нажмите, чтобы закрепить выбор.</p>
      {[...groups].map(([group, entries]) => <div className="price-section" key={group}><h3>{group}</h3><table><caption className="sr-only">{group}: услуги и цены в {cityNameIn}</caption><colgroup><col/><col className="price-col-centres"/><col className="price-col-amount"/></colgroup><thead className="sr-only"><tr><th>Услуга</th><th>Центры</th><th>Цена</th></tr></thead><tbody>{entries.map(row => <PriceRow key={row.id} row={row} active={selected?.id === row.id} pinned={pinned === row.id} onHover={setHovered} onPin={pin} centres={centreList(row)}/>)}</tbody></table></div>)}
      {!rows.length && <div className="empty-state"><Icon name="search" width="36" height="36"/><p>По вашему запросу услуг не найдено.</p><Link href={`/price?city=${city}`}>Сбросить фильтры</Link></div>}
      <p className="caption catalog-note">Демонстрационный прайс. Стоимость и доступность уточняйте в выбранном центре.</p>
    </section>
    <aside className="price-centres" id="price-centres" aria-label="Доступность по центрам"><h2>Где пройти исследование</h2><p className="caption">{selected ? 'Для выбранной услуги' : 'Наведите на услугу — покажем центры'}</p><div className="selected-procedure" aria-live="polite">{selected ? <><Icon name="hospital"/><strong>{selected.name}</strong><span>{selected.available.length} {selected.available.length === 1 ? 'центр' : 'центра'}</span></> : <span>Выберите исследование в списке</span>}</div>
      <ul>{branches.map(b => { const offering = selected?.available.find(a => a.branchID === b.id); return <li key={b.id} className={selected ? offering ? 'is-available' : 'is-unavailable' : ''} data-branch={b.id} data-available={selected ? !!offering : undefined}><Icon name={offering ? 'check' : 'pin'} width="20" height="20"/><div><Link href={`/med_points?center=${b.legacyID || b.id}`}>{b.name}</Link><p>{b.address}</p>{selected && <small>{offering ? `Доступно · ${offering.amount}` : 'Услуга здесь недоступна'}</small>}</div></li> })}</ul><a className="centres-phone" href="tel:88003330800"><Icon name="phone"/><span><small>Поможем выбрать центр</small>8-800-333-0-800</span></a>
    </aside>
  </div>
}
function PriceRow({ row, active, pinned, onHover, onPin, centres }: { row: CatalogueRow; active: boolean; pinned: boolean; onHover: (id: number | null) => void; onPin: (id: number) => void; centres: React.ReactNode }) {
  return <><tr className={`procedure-row ${active ? 'is-active' : ''}`} onPointerEnter={event => { if (event.pointerType === 'mouse') onHover(row.id) }}><td><button className="procedure-name" type="button" onClick={() => onPin(row.id)} onFocus={() => onHover(row.id)} aria-expanded={pinned} aria-controls={`centres-row-${row.id}`} aria-describedby="price-help">{row.name}</button></td><td className="procedure-centres"><button type="button" aria-label={`Центры для услуги «${row.name}»`} aria-pressed={pinned} onClick={() => onPin(row.id)} onFocus={() => onHover(row.id)}><Icon name="hospital" width="23" height="23"/></button></td><td className="procedure-amount">{row.amount}</td></tr><tr className="price-mobile-availability" hidden={!pinned} id={`centres-row-${row.id}`}><td colSpan={3}>{centres}</td></tr></>
}
