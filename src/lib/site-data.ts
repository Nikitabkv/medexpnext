import { cache } from 'react'
import { cookies } from 'next/headers'
import { cms } from './cms'
import { buildPriceCatalog } from './price-catalog'
import type { Branch, Category, Doctor, Document, Media, Price, Service } from '@/payload-types'

export const getSiteContext = cache(async (preferredCity?: string) => {
  const payload = await cms()
  const cities = (await payload.find({ collection: 'cities', overrideAccess: false, sort: 'order', limit: 100, depth: 0 })).docs
  const selected = (await cookies()).get('medexp-city')?.value
  const city = cities.find(c => c.slug === preferredCity) ?? cities.find(c => c.slug === selected) ?? cities[0]
  if (!city) throw new Error('Города ещё не настроены. Запустите процедуру заполнения базы.')
  return { payload, cities, city }
})
export const getBranches = cache(async (preferredCity?: string) => {
  const { payload, city } = await getSiteContext(preferredCity)
  return (await payload.find({ collection: 'branches', overrideAccess: false, where: { city: { equals: city.id } }, depth: 0, limit: 100 })).docs
})
export const getDoctors = cache(async () => {
  const { payload, city } = await getSiteContext()
  return (await payload.find({ collection: 'doctors', overrideAccess: false, where: { cities: { contains: city.id } }, depth: 1, sort: 'order', limit: 100 })).docs
})
export const getPriceCatalog = cache(async (preferredCity?: string) => {
  const { payload, city } = await getSiteContext(preferredCity)
  const [branches, categories, prices] = await Promise.all([
    getBranches(preferredCity),
    payload.find({ collection: 'categories', overrideAccess: false, sort: 'order', depth: 0, limit: 100 }),
    payload.find({ collection: 'prices', overrideAccess: false, where: { city: { equals: city.id } }, depth: 1, limit: 2000 }),
  ])
  return { city, ...buildPriceCatalog(prices.docs, branches, categories.docs) }
})
export const getCategories = cache(async (preferredCity?: string) => (await getPriceCatalog(preferredCity)).categories)
export async function getPromotions() {
  const { payload, city } = await getSiteContext()
  const now = new Date().toISOString()
  return (await payload.find({ collection: 'promotions', overrideAccess: false, where: { and: [{ city: { equals: city.id } }, { startsAt: { less_than_equal: now } }, { endsAt: { greater_than_equal: now } }] }, depth: 0, limit: 100, sort: '-startsAt' })).docs
}
export function photoURL(doctor: Doctor) {
  const value = typeof doctor.photo === 'object' ? doctor.photo?.url : undefined
  return value ? new URL(value, 'http://localhost').pathname : undefined
}
export function objectRelation<T>(value: T | number | null | undefined): T | undefined { return typeof value === 'object' && value !== null ? value : undefined }
export function formatPrice(price: Pick<Price, 'kind' | 'amount'>) {
  if (price.kind === 'free') return 'Бесплатно'
  if (price.kind === 'onRequest') return 'Уточнить'
  return `${price.kind === 'from' ? 'от ' : ''}${new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 }).format(price.amount ?? 0)} ₽`
}
export type { Branch, Category, Doctor, Document, Media, Price, Service }
