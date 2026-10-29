import type { Metadata } from 'next'
import Link from 'next/link'
import { getSiteContext, getBranches, getDoctors, objectRelation, type Branch } from '@/lib/site-data'
import { PageIntro } from '@/components/PageIntro'
import { ReviewForm } from '@/components/ReviewForm'
import { Icon } from '@/components/Icon'
export const metadata: Metadata = { title: 'Отзывы пациентов', alternates: { canonical: '/feedback' } }
export default async function Feedback({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const [params, { payload, city }, branches, doctors] = await Promise.all([searchParams, getSiteContext(), getBranches(), getDoctors()])
  const page = Math.max(1, Math.min(1000, Number(params.page) || 1))
  const reviews = await payload.find({ collection: 'reviews', overrideAccess: false, where: { city: { equals: city.id } }, depth: 1, sort: '-publishedAt', limit: 10, page })
  return <div className="container page-body"><PageIntro title="Отзывы пациентов"/><div className="reviews-layout"><section aria-label="Опубликованные отзывы" className="reviews-list">{reviews.docs.map(review => <article className="review" key={review.id}><div className="review-heading"><h2>{review.name}</h2><time dateTime={review.publishedAt ?? review.createdAt}>{new Date(review.publishedAt ?? review.createdAt).toLocaleDateString('ru-RU')}</time></div><div className="review-stars" aria-label={`Оценка ${review.rating} из 5`}>{[1,2,3,4,5].map(n => <Icon key={n} name="star" className={n <= review.rating ? 'filled' : ''} width="22" height="22"/>)}</div><p className="caption">{objectRelation<Branch>(review.branch)?.address}</p><p className="preserve-lines">{review.text}</p>{review.replyPublished && review.reply && <div className="review-reply"><div className="review-heading"><h3>Ответ МедЭксперт</h3>{review.repliedAt && <time dateTime={review.repliedAt}>{new Date(review.repliedAt).toLocaleDateString('ru-RU')}</time>}</div><p className="preserve-lines">{review.reply}</p></div>}</article>)}{!reviews.docs.length && <div className="empty-state"><h2>Отзывов пока нет</h2><p>Здесь появятся отзывы о центрах вашего города после модерации.</p></div>}{reviews.totalPages > 1 && <nav className="pagination" aria-label="Страницы отзывов">{page > 1 && <Link href={`/feedback?page=${page-1}`}>Назад</Link>}<span>{page} / {reviews.totalPages}</span>{reviews.hasNextPage && <Link href={`/feedback?page=${page+1}`}>Далее</Link>}</nav>}</section><ReviewForm key={city.id} cityID={city.id} branches={branches} doctors={doctors}/></div></div>
}
