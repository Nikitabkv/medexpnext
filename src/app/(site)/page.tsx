import Link from 'next/link'
import { getSiteContext, getDoctors, getCategories, getPromotions } from '@/lib/site-data'
import { DoctorCard } from '@/components/DoctorCard'
import { Icon } from '@/components/Icon'
import { VideoShowcase } from '@/components/VideoShowcase'

export default async function Home() {
  const [{ city }, doctors, categories, promotions] = await Promise.all([getSiteContext(), getDoctors(), getCategories(), getPromotions()])
  return <>
    <section className="hero"><div className="container hero-inner"><div className="hero-copy"><h1>Диагностика и приём<br className="desktop-break"/> врачей в {city.nameIn}</h1><p>Выберите услугу, специалиста и удобный центр.</p><form action="/price" className="hero-search"><Icon name="search"/><label className="sr-only" htmlFor="home-search">Найти услугу</label><input id="home-search" name="q" placeholder="Найти услугу" maxLength={100}/><button aria-label="Найти услугу"><Icon name="arrow"/></button></form><Link className="text-link" href="/specialists">Найти врача <Icon name="arrow"/></Link></div><img className="hero-photo" src="/reference/room.jpg" alt="Кабинет МРТ в центре МедЭксперт" width="620" height="350" fetchPriority="high"/></div></section>
    <div className="container home-content">
      {categories.length > 0 && <section><div className="section-heading"><h2>Услуги и направления</h2></div><div className="directions">{categories.map(c => <Link key={c.id} href={`/price?category=${c.slug}`}><span className="direction-icon"><Icon name={c.slug} width="32" height="32"/></span><span>{c.shortName}</span></Link>)}</div></section>}
      {promotions.length > 0 && <section><div className="section-heading"><h2>Акции в вашем городе</h2><Link className="text-link" href="/news">Все акции <Icon name="arrow"/></Link></div><div className="promos-grid">{promotions.map((p, i) => <article className="promo" key={p.id}><div><h3>{p.title}</h3><p>{p.text}</p><Link className="button" href={`/news#${p.legacyID || `offer-${p.id}`}`}>Подробнее</Link></div><img src={`/reference/clinic-${i % 2 + 1}.jpg`} alt="Медицинский центр" width="220" height="210" loading="lazy"/></article>)}</div></section>}
      <section><div className="section-heading"><h2>Наши специалисты</h2><Link className="text-link" href="/specialists">Все специалисты <Icon name="arrow"/></Link></div><div className="doctors-grid">{doctors.slice(0, 4).map(d => <DoctorCard doctor={d} key={d.id}/>)}</div></section>
      <VideoShowcase/>
      <section className="home-contact"><div><h2>Удобный центр рядом с вами</h2><p>Адреса, контакты и режим работы филиалов вашего города.</p></div><Link className="button button-outline" href="/med_points">Наши центры <Icon name="arrow"/></Link></section>
    </div>
  </>
}
