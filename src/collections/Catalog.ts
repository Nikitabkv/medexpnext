import { APIError, type CollectionConfig } from 'payload'
import { adminOnly, adminField, can, cityIDs, staff, guardDelete, guardScope, publicRead, publishedRead, relationID, scoped, scopedRead, statusField, validateBranch } from '@/lib/access'
import { readRegionalPricing, saveRegionalPricing, validateRegionalPricing } from '@/lib/regional-pricing'

export const Cities: CollectionConfig = {
  slug: 'cities', labels: { singular: 'Город', plural: 'Города' }, admin: { useAsTitle: 'name', group: 'Сеть центров' },
  access: { read: publicRead, create: adminOnly, update: adminOnly, delete: adminOnly },
  fields: [
    { name: 'name', type: 'text', label: 'Название', required: true },
    { name: 'nameIn', type: 'text', label: 'Название в предложном падеже', required: true, admin: { description: 'Например: Воронеже' } },
    { name: 'slug', type: 'text', label: 'Код города', required: true, unique: true, validate: (v: unknown) => typeof v === 'string' && /^[a-z][a-z0-9-]{1,50}$/.test(v) || 'Используйте латиницу и дефисы.' },
    { name: 'order', type: 'number', label: 'Порядок', defaultValue: 0 },
  ],
}
export const Branches: CollectionConfig = {
  slug: 'branches', labels: { singular: 'Филиал', plural: 'Филиалы' }, admin: { useAsTitle: 'name', group: 'Сеть центров' },
  access: { read: publishedRead, create: adminOnly, update: adminOnly, delete: adminOnly },
  fields: [
    { name: 'name', type: 'text', label: 'Название', required: true },
    { name: 'city', type: 'relationship', relationTo: 'cities', label: 'Город', required: true, index: true },
    { name: 'legacyID', type: 'text', label: 'ID филиала старого сайта', unique: true },
    { name: 'address', type: 'text', label: 'Адрес', required: true },
    { name: 'hours', type: 'text', label: 'Режим работы', required: true },
    { name: 'phone', type: 'text', label: 'Телефон', defaultValue: '8-800-333-0-800' },
    { name: 'directions', type: 'textarea', label: 'Как добраться' }, statusField,
  ],
}
export const Categories: CollectionConfig = {
  slug: 'categories', labels: { singular: 'Раздел услуг', plural: 'Разделы услуг' }, admin: { useAsTitle: 'name', group: 'Услуги и цены', description: 'Раздел появляется в городе автоматически, когда в нём есть доступные опубликованные услуги.' },
  access: { read: publishedRead, create: adminOnly, update: adminOnly, delete: adminOnly },
  fields: [
    { name: 'name', type: 'text', label: 'Название', required: true },
    { name: 'shortName', type: 'text', label: 'Короткое название', required: true },
    { name: 'slug', type: 'text', label: 'Код из старого URL', required: true, unique: true },
    // Retain old links for database compatibility; city availability now comes only from services and prices.
    { name: 'cities', type: 'relationship', relationTo: 'cities', hasMany: true, admin: { hidden: true }, access: { read: () => false, create: () => false, update: () => false } },
    { name: 'description', type: 'textarea', label: 'Описание' },
    { name: 'preparation', type: 'textarea', label: 'Подготовка (утверждённый клиникой текст)' },
    { name: 'order', type: 'number', label: 'Порядок', defaultValue: 0 }, statusField,
  ],
}
export const Services: CollectionConfig = {
  slug: 'services', labels: { singular: 'Услуга', plural: 'Услуги и цены' }, admin: { useAsTitle: 'name', group: 'Услуги и цены', defaultColumns: ['name', 'category', 'group', 'status'] },
  access: { read: publishedRead, create: adminOnly, update: ({ req }) => can(req, 'prices') && (staff(req)?.role === 'admin' || cityIDs(req).length > 0), delete: adminOnly },
  hooks: {
    beforeValidate: [validateRegionalPricing], afterChange: [saveRegionalPricing],
    beforeDelete: [async ({ id, req }) => {
      const prices = await req.payload.find({ collection: 'prices', where: { service: { equals: id } }, depth: 0, limit: 2000, overrideAccess: true, req })
      for (const price of prices.docs) await req.payload.delete({ collection: 'prices', id: price.id, overrideAccess: true, req })
    }],
  },
  fields: [
    { name: 'name', type: 'text', label: 'Название', required: true, access: { update: adminField } },
    { name: 'category', type: 'relationship', relationTo: 'categories', label: 'Раздел', required: true, index: true, access: { update: adminField } },
    { name: 'group', type: 'text', label: 'Подраздел', admin: { description: 'Например: Голова, Позвоночник' }, access: { update: adminField } },
    { name: 'regionalPricing', type: 'json', virtual: true, label: 'Цены и филиалы по городам', access: { read: ({ req }) => can(req, 'prices') }, hooks: { afterRead: [readRegionalPricing] }, admin: { components: { Field: '@/components/admin/RegionalPricingField#RegionalPricingField' } } },
    { name: 'code', type: 'text', label: 'Код услуги', unique: true, required: true, defaultValue: () => `SVC-${crypto.randomUUID()}`, admin: { hidden: true }, access: { update: adminField } },
    { name: 'order', type: 'number', label: 'Порядок', defaultValue: 0, access: { update: adminField }, admin: { position: 'sidebar' } }, { ...statusField, access: { update: adminField } },
  ],
}
export const Prices: CollectionConfig = {
  slug: 'prices', labels: { singular: 'Цена', plural: 'Цены по городам' },
  admin: { useAsTitle: 'title', hidden: true, group: 'Услуги и цены', defaultColumns: ['title', 'city', 'branch', 'amount', 'status'] },
  access: { read: scopedRead('prices'), create: scoped('prices'), update: scoped('prices'), delete: scoped('prices') },
  hooks: {
    beforeChange: [guardScope('prices'), async ({ data, originalDoc, req }) => {
      const next = { ...originalDoc, ...data }
      await validateBranch(req, next.branch, next.city)
      if (['fixed', 'from'].includes(next.kind) && (!Number.isFinite(next.amount) || next.amount < 0)) throw new APIError('Укажите корректную цену.', 400)
      const service = await req.payload.findByID({ collection: 'services', id: relationID(next.service), depth: 0, overrideAccess: true, req })
      data.title = service.name
      data.scopeKey = `${relationID(next.city)}:${relationID(next.service)}:${relationID(next.branch) || 'all'}`
      return data
    }],
    beforeDelete: [guardDelete('prices')],
  },
  fields: [
    { name: 'title', type: 'text', label: 'Услуга', admin: { hidden: true } },
    { name: 'scopeKey', type: 'text', unique: true, admin: { hidden: true } },
    { name: 'service', type: 'relationship', relationTo: 'services', required: true, label: 'Услуга' },
    { name: 'city', type: 'relationship', relationTo: 'cities', required: true, label: 'Город', index: true },
    { name: 'branch', type: 'relationship', relationTo: 'branches', label: 'Филиал (необязательно)', admin: { description: 'Пусто — цена действует во всех филиалах города, где доступна услуга.' } },
    { name: 'kind', type: 'select', label: 'Вид цены', required: true, defaultValue: 'fixed', options: [{ label: 'Точная цена', value: 'fixed' }, { label: 'Цена от', value: 'from' }, { label: 'Уточнить', value: 'onRequest' }, { label: 'Бесплатно', value: 'free' }] },
    { name: 'amount', type: 'number', label: 'Цена, ₽', min: 0, max: 1_000_000 },
    { name: 'available', type: 'checkbox', label: 'Услуга доступна', defaultValue: true }, statusField,
  ],
}
