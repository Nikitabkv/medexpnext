'use client'
import { useEffect, useRef, useState } from 'react'
import type { Document } from '@/payload-types'
import { Icon } from './Icon'

const localURL = (url: string) => new URL(url, 'http://localhost').pathname
export function DocumentGallery({ documents, name }: { documents: Document[]; name: string }) {
  const images = documents.filter(doc => doc.url && ['image/jpeg', 'image/png'].includes(doc.mimeType || ''))
  const files = documents.filter(doc => doc.url && !images.includes(doc))
  const [index, setIndex] = useState(0), [zoom, setZoom] = useState(false)
  const dialog = useRef<HTMLDialogElement>(null)
  const current = images[index % Math.max(1, images.length)]
  const move = (delta: number) => setIndex(value => (value + delta + images.length) % images.length)
  useEffect(() => {
    const element = dialog.current
    if (!element) return
    if (zoom && !element.open) element.showModal()
    if (!zoom && element.open) element.close()
  }, [zoom])
  if (!documents.length) return <div className="documents-empty"><Icon name="file" width="40" height="40"/><div><h2>Документы специалиста</h2><p>Дипломы, сертификаты и аккредитации появятся здесь после публикации клиникой.</p><a className="text-link" href="tel:88003330800">Уточнить информацию <Icon name="arrow"/></a></div></div>
  return <div className="document-gallery">
    {current && <><div className="document-stage"><button className="document-enlarge" type="button" aria-label={`Увеличить документ: ${current.title}`} onClick={() => setZoom(true)}><img src={localURL(current.url!)} alt={current.title} width="800" height="600"/><span><Icon name="search" width="18" height="18"/>Увеличить</span></button>{images.length > 1 && <><button className="gallery-prev" type="button" aria-label="Предыдущий документ" onClick={() => move(-1)}><Icon name="chevron"/></button><button className="gallery-next" type="button" aria-label="Следующий документ" onClick={() => move(1)}><Icon name="chevron"/></button></>}</div><div className="document-caption" aria-live="polite"><div><strong>{current.title}</strong>{current.issuedAt && <p className="caption">Выдан {new Date(current.issuedAt).toLocaleDateString('ru-RU')}</p>}</div><span>{index + 1} / {images.length}</span></div>{images.length > 1 && <div className="document-thumbnails" aria-label="Выбрать документ">{images.map((doc, itemIndex) => <button type="button" key={doc.id} aria-label={`Документ ${itemIndex + 1}: ${doc.title}`} aria-pressed={index === itemIndex} onClick={() => setIndex(itemIndex)}><img src={localURL(doc.url!)} alt="" width="90" height="75" loading="lazy"/></button>)}</div>}
      <dialog ref={dialog} className="document-lightbox" aria-label={`Документы: ${name}`} onCancel={event => { event.preventDefault(); setZoom(false) }} onClick={event => { if (event.target === event.currentTarget) setZoom(false) }} onKeyDown={event => { if (images.length > 1 && event.key === 'ArrowLeft') move(-1); if (images.length > 1 && event.key === 'ArrowRight') move(1) }}><button className="lightbox-close" type="button" aria-label="Закрыть документ" onClick={() => setZoom(false)}><Icon name="close"/></button><figure><img src={localURL(current.url!)} alt={current.title}/><figcaption>{current.title} · {index + 1} / {images.length}</figcaption></figure>{images.length > 1 && <div className="lightbox-controls"><button type="button" onClick={() => move(-1)} aria-label="Предыдущий скан"><Icon name="chevron"/></button><button type="button" onClick={() => move(1)} aria-label="Следующий скан"><Icon name="chevron"/></button></div>}</dialog>
    </>}
    {files.length > 0 && <ul className="document-list">{files.map(doc => <li key={doc.id}><Icon name="file"/><div><a href={localURL(doc.url!)} target="_blank" rel="noopener noreferrer">{doc.title}</a>{doc.issuedAt && <p className="caption">Выдан {new Date(doc.issuedAt).toLocaleDateString('ru-RU')}</p>}</div><span className="caption">PDF</span></li>)}</ul>}
  </div>
}
