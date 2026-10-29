import Link from 'next/link'
export default function NotFound() { return <div className="container page-body empty-state"><h1>Страница не найдена</h1><p>Проверьте адрес или перейдите в нужный раздел сайта.</p><Link className="button" href="/">На главную</Link></div> }
