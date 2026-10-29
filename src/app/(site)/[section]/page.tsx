import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getSiteContext } from '@/lib/site-data'
import { PageIntro } from '@/components/PageIntro'
async function getPage(section: string) {
  if (!['laboratory', 'questions', 'articles', 'privacy'].includes(section)) return undefined
  const { payload, city } = await getSiteContext()
  return (await payload.find({ collection: 'pages', overrideAccess: false, where: { and: [{ slug: { equals: section } }, { city: { equals: city.id } }] }, limit: 1, depth: 0 })).docs[0]
}
export async function generateMetadata({ params }: { params: Promise<{ section: string }> }): Promise<Metadata> {
  const { section } = await params, page = await getPage(section)
  return { title: page?.title ?? 'Страница не найдена', alternates: { canonical: `/${section}` } }
}
export default async function ContentPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params, page = await getPage(section)
  if (!page) notFound()
  return <div className="container page-body"><PageIntro title={page.title}/><article className="prose"><p className="lead preserve-lines">{page.intro}</p>{section === 'laboratory' && <img className="content-photo" src="/reference/clinic-2.jpg" alt="Забор анализов в МедЭксперт" width="900" height="430"/>}{page.sections?.map((s, i) => <section key={s.id || i}><h2>{s.heading}</h2><p className="preserve-lines">{s.text}</p></section>)}{section === 'articles' && !page.sections?.length && <p className="muted">Материалы ещё не опубликованы.</p>}</article></div>
}
