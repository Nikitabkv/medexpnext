import { cms } from '@/lib/cms'
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!/^\d{1,10}$/.test(id)) return new Response(null, { status: 404 })
  const payload = await cms()
  const result = await payload.find({ collection: 'doctors', overrideAccess: false, depth: 0, where: { legacyID: { equals: id } }, select: { slug: true }, limit: 1 })
  return result.docs[0] ? Response.json({ slug: result.docs[0].slug }) : new Response(null, { status: 404 })
}
