'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import type { City } from '@/payload-types'
import { Icon } from './Icon'
import { navigation } from '@/lib/navigation'
import { CustomSelect } from './CustomSelect'

export function SiteHeader({ cities, city }: { cities: City[]; city: City }) {
  const pathname = usePathname(), router = useRouter()
  const [open, setOpen] = useState(false), [changing, setChanging] = useState(false), [error, setError] = useState('')
  async function changeCity(slug: string) {
    setChanging(true); setError('')
    try {
      const response = await fetch('/api/city', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ city: slug }) })
      if (!response.ok) throw new Error()
      const query = new URLSearchParams(window.location.search)
      query.delete('branch'); query.delete('center'); query.delete('city')
      const nextPath = pathname.startsWith('/specialists/') ? '/specialists' : pathname
      const nextURL = `${nextPath}${query.size ? `?${query}` : ''}`
      if (nextURL !== `${window.location.pathname}${window.location.search}`) router.replace(nextURL)
      router.refresh()
    } catch { setError('Не удалось сменить город. Попробуйте ещё раз.') }
    finally { setChanging(false) }
  }
  return <header className="site-header">
    <a className="skip-link" href="#main">Перейти к содержимому</a>
    <div className="container header-main">
      <Link href="/" aria-label="МедЭксперт — главная"><img className="logo" src="/reference/logo.svg" alt="МедЭксперт" width="225" height="40"/></Link>
      <div className="city-control"><Icon name="pin"/><CustomSelect label="Ваш город" compact value={city.slug} disabled={changing} onValueChange={changeCity} options={cities.map(c => ({ value: c.slug, label: c.name }))}/></div>
      <a className="header-phone" href="tel:88003330800"><Icon name="phone"/>8-800-333-0-800</a>
      <a className="button button-outline atlas" href="https://atlas-patient.ru/" target="_blank" rel="noopener noreferrer">Атлас пациента</a>
      <a className="button header-book" href="https://atlas-patient.ru/" target="_blank" rel="noopener noreferrer">Записаться</a>
      <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label={open ? 'Закрыть меню' : 'Открыть меню'} aria-expanded={open}><Icon name={open ? 'close' : 'menu'}/></button>
    </div>
    {error && <p role="alert" className="container form-error">{error}</p>}
    <nav className={`main-nav ${open ? 'is-open' : ''}`} aria-label="Главная навигация"><div className="container nav-links">{navigation.map(([href, name]) => <Link key={href} href={href} aria-current={pathname === href || href !== '/' && pathname.startsWith(`${href}/`) ? 'page' : undefined} onClick={() => setOpen(false)}>{name}</Link>)}</div></nav>
  </header>
}
