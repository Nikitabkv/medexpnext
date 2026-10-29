import type { MetadataRoute } from 'next'
export default function robots(): MetadataRoute.Robots {
  const base = process.env.SERVER_URL || 'http://localhost:3100'
  return process.env.ALLOW_INDEXING === 'true' ? { rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api/'] }, sitemap: `${base}/sitemap.xml` } : { rules: { userAgent: '*', disallow: '/' } }
}
