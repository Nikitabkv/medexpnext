'use client'
import { useEffect, useState } from 'react'
import { useAuth, useField } from '@payloadcms/ui'
import type { JSONFieldClientComponent } from 'payload'
import type { Branch, City, User } from '@/payload-types'
import type { RegionalPriceRow } from '@/lib/regional-pricing'

const idOf = (value: unknown) => typeof value === 'object' && value && 'id' in value ? String(value.id) : String(value)
export const RegionalPricingField: JSONFieldClientComponent = ({ path, readOnly }) => {
  const { user } = useAuth<User>()
  const { value, setValue } = useField<RegionalPriceRow[]>({ path })
  const rows = Array.isArray(value) ? value : []
  const [cities, setCities] = useState<City[]>([]), [branches, setBranches] = useState<Branch[]>([]), [error, setError] = useState(''), [loading, setLoading] = useState(true)
  useEffect(() => {
    const controller = new AbortController()
    Promise.all([fetch('/api/cities?limit=100&depth=0&sort=order', { signal: controller.signal }), fetch('/api/branches?limit=1000&depth=0', { signal: controller.signal })]).then(async responses => {
      if (responses.some(response => !response.ok)) throw new Error('Не удалось загрузить города и филиалы. Обновите страницу.')
      const [cityData, branchData] = await Promise.all(responses.map(response => response.json()))
      setCities(cityData.docs); setBranches(branchData.docs); setLoading(false)
    }).catch(reason => { if (!controller.signal.aborted) { setError(reason.message); setLoading(false) } })
    return () => controller.abort()
  }, [])
  const permitted = cities.filter(city => user?.role === 'admin' || user?.cities?.some(item => idOf(item) === String(city.id)))
  const update = (cityID: number, changes: Partial<RegionalPriceRow>) => setValue(rows.map(row => row.city === cityID ? { ...row, ...changes } : row))
  const toggleCity = (cityID: number) => {
    if (rows.some(row => row.city === cityID)) setValue(rows.filter(row => row.city !== cityID))
    else setValue([...rows, { city: cityID, kind: 'fixed', amount: null, branches: branches.filter(branch => idOf(branch.city) === String(cityID)).map(branch => branch.id) }])
  }
  return <div className="regional-pricing-field"><div className="regional-heading"><h3>Города</h3><p>Одна услуга — отдельная цена и список филиалов для каждого города.</p></div>{error && <p role="alert" className="regional-error">{error}</p>}{loading ? <p role="status">Загрузка городов…</p> : <><div className="regional-city-choices">{permitted.map(city => <label key={city.id} className={rows.some(row => row.city === city.id) ? 'is-checked' : ''}><input type="checkbox" checked={rows.some(row => row.city === city.id)} disabled={readOnly} onChange={() => toggleCity(city.id)}/>{city.name}</label>)}</div>{permitted.filter(city => rows.some(row => row.city === city.id)).map(city => {
    const row = rows.find(row => row.city === city.id)!
    const cityBranches = branches.filter(branch => idOf(branch.city) === String(city.id))
    const selectedBranches = cityBranches.filter(branch => row.branches.includes(branch.id))
    const draftBranches = selectedBranches.filter(branch => branch.status !== 'published')
    const hasPublishedBranch = selectedBranches.some(branch => branch.status === 'published')
    return <section className="regional-city-panel" key={city.id} aria-label={`Цена и филиалы — ${city.name}`}>
      <header><h3>{city.name}</h3><span>{row.branches.length} из {cityBranches.length} филиалов</span></header>
      <div className="regional-price-input"><label htmlFor={`${path}-${city.id}`}>Цена — {city.name}, ₽</label><input id={`${path}-${city.id}`} type="number" min="0" max="1000000" step="0.01" placeholder="Введите цену" value={row.amount ?? ''} disabled={readOnly || row.kind === 'onRequest' || row.kind === 'free'} onChange={event => update(city.id, { amount: event.target.value === '' ? null : Number(event.target.value) })}/></div>
      <fieldset className="regional-price-kinds"><legend>Вид цены</legend>{[['fixed', 'Точная цена'], ['from', 'Цена от'], ['onRequest', 'Уточнить'], ['free', 'Бесплатно']].map(([kind, label]) => <label key={kind}><input type="radio" name={`${path}-kind-${city.id}`} checked={row.kind === kind} disabled={readOnly} onChange={() => update(city.id, { kind: kind as RegionalPriceRow['kind'] })}/>{label}</label>)}</fieldset>
      <div className="regional-branches-heading"><h4>Филиалы — {city.name}</h4><button type="button" disabled={readOnly} onClick={() => update(city.id, { branches: row.branches.length === cityBranches.length ? [] : cityBranches.map(branch => branch.id) })}>{row.branches.length === cityBranches.length ? 'Снять все' : 'Выбрать все'}</button></div>
      <div className="regional-branch-choices">{cityBranches.map(branch => <label key={branch.id}><input type="checkbox" disabled={readOnly} checked={row.branches.includes(branch.id)} onChange={() => update(city.id, { branches: row.branches.includes(branch.id) ? row.branches.filter(id => id !== branch.id) : [...row.branches, branch.id].sort((a, b) => a - b) })}/><span>{branch.name}{branch.status !== 'published' && <span className="regional-draft-badge">Черновик</span>}<small>{branch.address}</small></span></label>)}</div>
      {draftBranches.length > 0 && <div className="regional-warning" role="status">
        <p>{hasPublishedBranch ? 'Часть выбранных филиалов — черновики. На сайте услуга будет показана только в опубликованных филиалах.' : `Услуга не появится в городе «${city.name}»: все выбранные филиалы — черновики.`}</p>
        <p>{user?.role === 'admin' ? 'Откройте карточку филиала, выберите статус «Опубликовано» и сохраните.' : 'Попросите администратора опубликовать филиал.'}</p>
        <ul>{draftBranches.map(branch => <li key={branch.id}>{user?.role === 'admin' ? <a href={`/admin/collections/branches/${branch.id}`} target="_blank" rel="noopener noreferrer" aria-label={`Открыть филиал «${branch.name}» в новой вкладке`}>{branch.name} ↗</a> : branch.name}</li>)}</ul>
      </div>}
      {!row.branches.length && <p className="regional-notice">Выберите филиалы, в которых доступна услуга. Сейчас в этом городе она не будет показана.</p>}
    </section>
  })}{!rows.length && <p className="regional-notice">Выберите хотя бы один город, чтобы задать цену и филиалы.</p>}</>}</div>
}
