import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cms } from '@/lib/cms'
import { DoctorDetails } from '@/components/DoctorDetails'
import { relationID } from '@/lib/access'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params, payload = await cms()
  const doctor = (await payload.find({ collection: 'doctors', overrideAccess: false, where: { slug: { equals: slug } }, depth: 0, limit: 1 })).docs[0]
  return { title: doctor?.name ?? 'Врач не найден', alternates: { canonical: `/specialists/${slug}` } }
}
export default async function DoctorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params, payload = await cms()
  const doctor = (await payload.find({ collection: 'doctors', overrideAccess: false, where: { slug: { equals: slug } }, depth: 1, limit: 1 })).docs[0]
  if (!doctor) notFound()
  const [documents, branches] = await Promise.all([
    payload.find({ collection: 'documents', overrideAccess: false, where: { doctor: { equals: doctor.id } }, depth: 0, sort: 'order', limit: 100 }),
    payload.find({ collection: 'branches', overrideAccess: false, where: { id: { in: doctor.branches?.map(relationID) ?? [] } }, depth: 0, limit: 100 }),
  ])
  return <div className="container page-body"><nav className="breadcrumbs" aria-label="Хлебные крошки"><Link href="/">Главная</Link><span>/</span><Link href="/specialists">Специалисты</Link><span>/</span><span>{doctor.name}</span></nav><DoctorDetails key={doctor.id} doctor={doctor} documents={documents.docs} branches={branches.docs}/></div>
}
