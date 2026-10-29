import Link from 'next/link'
export function PageIntro({ title, description }: { title: string; description?: string }) {
  return <div className="page-intro"><nav aria-label="Хлебные крошки" className="breadcrumbs"><Link href="/">Главная</Link><span>/</span><span>{title}</span></nav><h1>{title}</h1>{description && <p>{description}</p>}</div>
}
