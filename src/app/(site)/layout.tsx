import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { getSiteContext } from '@/lib/site-data'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { FocusModality } from '@/components/FocusModality'
import './site.css'
import './refresh.css'

const roboto = localFont({ src: '../../fonts/Roboto.ttf', variable: '--font-roboto', weight: '100 900', style: 'normal', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SERVER_URL || 'http://localhost:3100'),
  title: { default: 'МедЭксперт — медицинские центры', template: '%s — МедЭксперт' },
  description: 'Услуги и цены, специалисты и медицинские центры МедЭксперт в вашем городе.',
  robots: process.env.ALLOW_INDEXING === 'true' ? { index: true, follow: true } : { index: false, follow: false },
}
export default async function Layout({ children }: { children: React.ReactNode }) {
  const { cities, city } = await getSiteContext()
  return <html lang="ru" className={roboto.variable} data-scroll-behavior="smooth"><body><FocusModality/><SiteHeader cities={cities} city={city}/><main id="main">{children}</main><SiteFooter/></body></html>
}
