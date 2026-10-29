import Link from 'next/link'
import { navigation } from '@/lib/navigation'
import { LegalDocuments } from './LegalDocuments'
export function SiteFooter() {
  return <footer className="site-footer"><LegalDocuments/><div className="container footer-main">
    <div className="footer-top"><div><img className="logo" src="/reference/logo.svg" alt="МедЭксперт" width="225" height="40"/><p>Сеть медицинских центров</p></div><nav aria-label="Навигация в подвале">{navigation.slice(1).map(([href, name]) => <Link key={href} href={href}>{name}</Link>)}</nav><div><a className="footer-phone" href="tel:88003330800">8-800-333-0-800</a><p>Уточнить информацию и записаться</p><Link href="/admin">Вход для сотрудников</Link></div></div>
    <div className="footer-bottom"><span>© 2026 МедЭксперт</span><LegalDocuments policyOnly/><span>Демонстрационная версия. Цены и данные требуют проверки клиникой.</span></div>
    <p className="medical-notice">Имеются противопоказания. Необходима консультация специалиста. Информация на сайте носит справочный характер.</p>
  </div></footer>
}
