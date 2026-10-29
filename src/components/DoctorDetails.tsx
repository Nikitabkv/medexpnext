'use client'
import { useRef, useState } from 'react'
import Link from 'next/link'
import type { Branch, Doctor, Document, Media } from '@/payload-types'
import { Icon } from './Icon'
import { DocumentGallery } from './DocumentGallery'

export function DoctorDetails({ doctor, documents, branches }: { doctor: Doctor; documents: Document[]; branches: Branch[] }) {
  const [tab, setTab] = useState('about')
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const tabItems = [['about', 'О враче'], ['documents', 'Документы'], ['branches', 'Места приёма']]
  const rawPhoto = typeof doctor.photo === 'object' ? (doctor.photo as Media | null)?.url : undefined
  const photo = rawPhoto ? new URL(rawPhoto, 'http://localhost').pathname : undefined
  return <div className="doctor-detail"><aside><div className="detail-photo">{photo && <img src={photo} alt={doctor.name} width="300" height="320"/>}</div><a className="button" href="https://atlas-patient.ru/" target="_blank" rel="noopener noreferrer">Записаться на приём</a><a className="detail-phone" href="tel:88003330800">8-800-333-0-800</a></aside><div><h1>{doctor.name}</h1><p className="detail-specialty">{doctor.specialty}</p>{doctor.qualification && <p className="muted">{doctor.qualification}</p>}<div role="tablist" aria-label="Информация о враче" className="tabs">{tabItems.map(([value, label], index) => <button ref={element => { tabRefs.current[index] = element }} key={value} id={`tab-${value}`} role="tab" tabIndex={tab === value ? 0 : -1} aria-controls={`panel-${value}`} aria-selected={tab === value} onClick={() => setTab(value)} onKeyDown={event => { if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return; event.preventDefault(); const next = event.key === 'Home' ? 0 : event.key === 'End' ? 2 : (index + (event.key === 'ArrowLeft' ? -1 : 1) + 3) % 3; setTab(tabItems[next][0]); tabRefs.current[next]?.focus() }}>{label}{value !== 'about' && <span className="tab-count">{value === 'documents' ? documents.length : branches.length}</span>}</button>)}</div>
    <section role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className="detail-content">
      {tab === 'about' && <>{doctor.biography && !doctor.biography.startsWith('Информация о специалисте опубликована') ? <p className="preserve-lines">{doctor.biography}</p> : <div className="doctor-facts"><h2>Специализация</h2><p>{doctor.specialty}</p>{doctor.qualification && <><h2>Квалификация</h2><p>{doctor.qualification}</p></>}<p className="caption">Информацию о приёме можно уточнить по телефону 8-800-333-0-800.</p></div>}{doctor.education && <><h2>Образование</h2><p className="preserve-lines">{doctor.education}</p></>}{doctor.career && <><h2>Опыт работы</h2><p className="preserve-lines">{doctor.career}</p></>}</>}
      {tab === 'documents' && <DocumentGallery documents={documents} name={doctor.name}/>}
      {tab === 'branches' && <div className="branch-list">{branches.length ? branches.map(branch => <article key={branch.id}><h2>{branch.name}</h2><p><Icon name="pin" width="17" height="17"/>{branch.address}</p><p className="muted">{branch.hours}</p><Link className="text-link" href={`/med_points?center=${branch.legacyID || branch.id}`}>О центре <Icon name="arrow"/></Link></article>) : <div className="details-empty"><h2>Места приёма уточняются</h2><p>Позвоните, чтобы узнать, в каком центре принимает специалист.</p><a className="text-link" href="tel:88003330800">8-800-333-0-800</a></div>}</div>}
    </section>
  </div></div>
}
