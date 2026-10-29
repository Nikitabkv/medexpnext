import type { MetadataRoute } from 'next'
import { cms } from '@/lib/cms'
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (process.env.ALLOW_INDEXING !== 'true') return []
  const base = process.env.SERVER_URL || 'http://localhost:3100', payload = await cms()
  const doctors = await payload.find({ collection: 'doctors', overrideAccess: false, limit: 1000, depth: 0, select: { slug: true, updatedAt: true } })
  const routes = ['', '/price', '/specialists', '/about_services', '/med_points', '/laboratory', '/questions', '/feedback', '/articles', '/news']
  return [...routes.map(path => ({ url: `${base}${path}` })), ...doctors.docs.map(d => ({ url: `${base}/specialists/${d.slug}`, lastModified: d.updatedAt }))]
}
