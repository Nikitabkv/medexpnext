'use client'
import { useState } from 'react'
import { Icon } from './Icon'

const videos = {
  company: { id: '030147f2cf5b9429a38d59e789e3f83f', title: 'О компании' },
  telemedicine: { id: '7f8cd49eb2411cc6737b05cf9f900dda', title: 'Центр телемедицины' },
  laboratory: { id: 'cd7fb3308b1761469d68103eb7ff8fcc', title: 'Лабораторный комплекс' },
}
function CompanyVideo({ name }: { name: keyof typeof videos }) {
  const [playing, setPlaying] = useState(false)
  const video = videos[name]
  return <article className={`company-video company-video-${name}`}><div className="video-frame">{playing ? <iframe title={`МедЭксперт — ${video.title}`} src={`https://rutube.ru/play/embed/${video.id}?skinColor=009f59&autoplay=1`} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/> : <button type="button" onClick={() => setPlaying(true)} aria-label={`Смотреть видео: ${video.title}`}><img src={`/reference/videos/${name}.jpg`} alt="" width="960" height="540" loading="lazy"/><span className="video-play"><Icon name="play" width="27" height="27"/></span></button>}</div><div className="video-caption"><h3>{video.title}</h3><a href={`https://rutube.ru/video/${video.id}/`} target="_blank" rel="noopener noreferrer" aria-label={`${video.title} — открыть на RUTUBE`}><Icon name="external" width="17" height="17"/></a></div>{!playing && <button className="video-text-button" type="button" onClick={() => setPlaying(true)}>Смотреть видео <Icon name="arrow" width="19" height="19"/></button>}</article>
}
export function VideoShowcase() {
  return <section className="video-showcase" aria-labelledby="video-heading"><div className="section-heading"><h2 id="video-heading">МедЭксперт изнутри</h2><p>Знакомство с центрами, специалистами и лабораторией.</p></div><div className="video-columns"><div className="video-column"><CompanyVideo name="company"/><article className="company-video laboratory-live"><a className="live-poster" href="https://med-exp.ru/" target="_blank" rel="noopener noreferrer" aria-label="Лаборатория онлайн — открыть трансляцию на сайте МедЭксперта"><img src="/reference/clinic-2.jpg" alt="Лаборатория МедЭксперт" width="900" height="350" loading="lazy"/><span className="video-play"><Icon name="external" width="26" height="26"/></span></a><div className="video-caption"><h3>Лаборатория онлайн</h3><Icon name="external" width="17" height="17"/></div><p className="caption">Трансляция на действующем сайте МедЭксперта</p><a className="text-link" href="https://med-exp.ru/" target="_blank" rel="noopener noreferrer">Открыть трансляцию <Icon name="arrow" width="19" height="19"/></a></article></div><div className="video-column"><CompanyVideo name="telemedicine"/><CompanyVideo name="laboratory"/></div></div></section>
}
