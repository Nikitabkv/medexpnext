import type { Metadata } from 'next'
import { getPromotions } from '@/lib/site-data'
import { PageIntro } from '@/components/PageIntro'
export const metadata: Metadata = { title: 'Новости и акции', alternates: { canonical: '/news' } }
export default async function News() {
  const promotions = await getPromotions()
  return <div className="container page-body"><PageIntro title="Новости и акции" description="Предложения центров вашего города."/><div className="news-list">{promotions.map(p => <article id={p.legacyID || `offer-${p.id}`} key={p.id}><div className="news-date">{new Date(p.startsAt).toLocaleDateString('ru-RU')} — {new Date(p.endsAt).toLocaleDateString('ru-RU')}</div><h2>{p.title}</h2><p className="preserve-lines">{p.text}</p><a href="tel:88003330800" className="text-link">Уточнить условия: 8-800-333-0-800</a></article>)}{!promotions.length && <p className="empty-state">Сейчас в вашем городе нет опубликованных акций.</p>}</div></div>
}
