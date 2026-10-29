'use client'
export default function ErrorPage({ reset }: { reset: () => void }) { return <div className="container page-body empty-state"><h1>Страница временно недоступна</h1><p>Попробуйте загрузить её ещё раз.</p><button className="button" onClick={reset}>Повторить</button></div> }
