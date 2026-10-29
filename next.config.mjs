import { withPayload } from '@payloadcms/next/withPayload'
import path from 'node:path'

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

export default withPayload({
  poweredByHeader: false,
  devIndicators: false,
  turbopack: { root: path.resolve('.') },
  output: 'standalone',
  outputFileTracingRoot: path.resolve('.'),
  outputFileTracingExcludes: { '/*': ['./storage/**/*', './.local/**/*', './.env*', './.npm-cache/**/*'] },
  experimental: { serverActions: { bodySizeLimit: '2mb' } },
  async rewrites() {
    return [
      { source: '/news.php', destination: '/news' },
      { source: '/specialists.php', destination: '/specialists' },
      { source: '/price.php', destination: '/price' },
      { source: '/about_services.php', destination: '/about_services' },
      { source: '/med_points.php', destination: '/med_points' },
      { source: '/feedback.php', destination: '/feedback' },
    ]
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
})
