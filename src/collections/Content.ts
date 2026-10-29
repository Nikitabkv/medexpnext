import type { CollectionConfig } from 'payload'
import { adminOnly, guardDelete, guardScope, never, scoped, scopedRead, statusField } from '@/lib/access'

export const Promotions: CollectionConfig = {
  slug: 'promotions', labels: { singular: 'Акция', plural: 'Акции' }, admin: { useAsTitle: 'title', group: 'Контент' },
  access: { read: scopedRead('promotions'), create: scoped('promotions'), update: scoped('promotions'), delete: scoped('promotions') },
  hooks: { beforeChange: [guardScope('promotions')], beforeDelete: [guardDelete('promotions')] },
  fields: [
    { name: 'title', type: 'text', label: 'Заголовок', required: true },
    { name: 'legacyID', type: 'text', label: 'ID новости старого сайта', unique: true },
    { name: 'city', type: 'relationship', relationTo: 'cities', required: true, label: 'Город', index: true },
    { name: 'text', type: 'textarea', label: 'Текст и условия', required: true },
    { name: 'startsAt', type: 'date', label: 'Начало', required: true },
    { name: 'endsAt', type: 'date', label: 'Окончание', required: true, validate: (value: unknown, { siblingData }: { siblingData: Record<string, unknown> }) => !value || !siblingData.startsAt || new Date(String(value)) > new Date(String(siblingData.startsAt)) || 'Окончание должно быть позже начала.' }, statusField,
  ],
}
export const Pages: CollectionConfig = {
  slug: 'pages', labels: { singular: 'Страница', plural: 'Страницы' }, admin: { useAsTitle: 'title', group: 'Контент' },
  access: { read: scopedRead('content'), create: scoped('content'), update: scoped('content'), delete: scoped('content') },
  hooks: { beforeChange: [guardScope('content')], beforeDelete: [guardDelete('content')] },
  fields: [
    { name: 'title', type: 'text', label: 'Название', required: true },
    { name: 'slug', type: 'text', label: 'Адрес', required: true },
    { name: 'city', type: 'relationship', relationTo: 'cities', required: true, label: 'Город', index: true },
    { name: 'intro', type: 'textarea', label: 'Вступление', required: true },
    { name: 'sections', type: 'array', label: 'Разделы', fields: [{ name: 'heading', type: 'text', label: 'Заголовок', required: true }, { name: 'text', type: 'textarea', label: 'Текст', required: true }] }, statusField,
  ],
  indexes: [{ fields: ['slug', 'city'], unique: true }],
}
export const AuditLog: CollectionConfig = {
  slug: 'audit-log', labels: { singular: 'Запись журнала', plural: 'Журнал действий' },
  admin: { group: 'Управление', defaultColumns: ['actor', 'action', 'collectionName', 'documentID', 'createdAt'] },
  access: { read: adminOnly, create: never, update: never, delete: never },
  fields: [
    { name: 'actor', type: 'text', label: 'Сотрудник' },
    { name: 'action', type: 'text', label: 'Действие', required: true },
    { name: 'collectionName', type: 'text', label: 'Раздел', required: true },
    { name: 'documentID', type: 'text', label: 'ID записи', required: true },
  ],
}
export const RateLimits: CollectionConfig = {
  slug: 'rate-limits', admin: { hidden: true }, access: { read: never, create: never, update: never, delete: never },
  fields: [{ name: 'key', type: 'text', required: true, unique: true }, { name: 'count', type: 'number', required: true, defaultValue: 0 }, { name: 'expiresAt', type: 'date', required: true }],
}
