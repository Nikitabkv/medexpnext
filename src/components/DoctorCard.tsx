import Link from 'next/link'
import { photoURL, type Doctor } from '@/lib/site-data'
import { Icon } from './Icon'
export function DoctorCard({ doctor }: { doctor: Doctor }) {
  return <article className="doctor-card"><Link href={`/specialists/${doctor.slug}`} className="doctor-image">{photoURL(doctor) ? <img src={photoURL(doctor)!} alt={doctor.name} width="280" height="275" loading="lazy"/> : <span className="doctor-initials" aria-hidden="true">{doctor.name.split(' ').slice(0, 2).map(n => n[0]).join('')}</span>}</Link><div className="doctor-card-body"><h2><Link href={`/specialists/${doctor.slug}`}>{doctor.name}</Link></h2><p>{doctor.specialty}</p>{doctor.qualification && <p className="caption">{doctor.qualification}</p>}<Link className="text-link" href={`/specialists/${doctor.slug}`}>Подробнее <Icon name="arrow"/></Link></div></article>
}
