'use client'
import { useEffect, useState, type FormEvent } from 'react'
import Link from 'next/link'
import type { Branch, Doctor } from '@/payload-types'
import { Icon } from './Icon'
import { CustomSelect } from './CustomSelect'

export function ReviewForm({ cityID, branches, doctors }: { cityID: number; branches: Branch[]; doctors: Doctor[] }) {
  const [branch, setBranch] = useState(''), [rating, setRating] = useState(5), [token, setToken] = useState('')
  const [pending, setPending] = useState(false), [error, setError] = useState(''), [success, setSuccess] = useState('')
  const [tokenAttempt, setTokenAttempt] = useState(0)
  useEffect(() => {
    const controller = new AbortController()
    setToken('')
    fetch('/api/review-token', { signal: controller.signal, cache: 'no-store' }).then(async response => {
      const body = await response.json()
      if (!response.ok) throw new Error(body.error)
      setToken(body.token)
    }).catch(error => { if (error.name !== 'AbortError') setError(error.message || 'Не удалось загрузить форму.') })
    return () => controller.abort()
  }, [cityID, tokenAttempt])
  const filteredDoctors = doctors.filter(d => d.branches?.some(b => String(typeof b === 'object' ? b.id : b) === branch))
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget, data = new FormData(form)
    setPending(true); setError('')
    try {
      const response = await fetch('/api/review-submissions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
        name: data.get('name'), text: data.get('text'), rating, city: cityID, branch: Number(branch),
        ...(data.get('doctor') ? { doctor: Number(data.get('doctor')) } : {}), consent: data.get('consent') === 'on', website: data.get('website') || '', token,
      }) })
      const body = await response.json()
      if (!response.ok) throw new Error(body.error)
      setSuccess(body.message)
      form.reset()
    } catch (error) { setError((error as Error).message || 'Не удалось отправить отзыв.') }
    finally { setPending(false) }
  }
  return <aside className="review-form-panel" id="leave-review"><h2>Оставить отзыв</h2>{success ? <div role="status" className="form-success"><Icon name="km" width="38" height="38"/><p>{success}</p><p className="caption">Ваш отзыв пока виден только сотрудникам, которые проводят модерацию.</p></div> : <form onSubmit={submit}>
    <label>Имя<input name="name" placeholder="Как к вам обращаться?" required minLength={2} maxLength={80} autoComplete="given-name"/></label>
    <div className="review-select-field"><span>Филиал</span><CustomSelect label="Филиал" name="branch" value={branch} required onValueChange={setBranch} options={[{ value: '', label: 'Выберите филиал' }, ...branches.map(b => ({ value: String(b.id), label: b.address }))]}/></div>
    <div className="review-select-field"><span>Врач <span className="muted">(необязательно)</span></span><CustomSelect label="Врач" name="doctor" key={branch} defaultValue="" disabled={!branch} options={[{ value: '', label: branch ? 'Выберите врача' : 'Сначала выберите филиал' }, ...filteredDoctors.map(d => ({ value: String(d.id), label: d.name }))]}/></div>
    <fieldset className="rating-field"><legend>Оценка</legend><div>{[1,2,3,4,5].map(value => <label key={value} className={`rating-star ${value <= rating ? 'is-selected' : ''}`}><input type="radio" name="rating" value={value} checked={rating === value} onChange={() => setRating(value)} aria-label={`Оценка ${value} из 5`}/><Icon name="star" width="30" height="30"/></label>)}</div></fieldset>
    <label>Ваш отзыв<textarea name="text" placeholder="Расскажите о посещении центра" required minLength={10} maxLength={3000} rows={5}/></label>
    <p className="caption">Не указывайте диагнозы, результаты исследований и другие сведения о здоровье.</p>
    <div className="honeypot" aria-hidden="true"><label>Ваш сайт<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
    <label className="consent"><input name="consent" type="checkbox" required/><span>Согласен на публикацию отзыва и <Link href="/privacy" target="_blank">обработку данных</Link>.</span></label>
    {error && <p role="alert" className="form-error">{error}</p>}
    {!token && error && <button className="button button-outline" type="button" onClick={() => { setError(''); setTokenAttempt(n => n + 1) }}>Загрузить форму заново</button>}
    <button className="button submit-review" type="submit" disabled={pending || !token}>{pending ? 'Отправляем…' : 'Отправить на модерацию'}</button>
    <p className="caption">Отзыв появится на сайте после проверки.</p>
  </form>}</aside>
}
