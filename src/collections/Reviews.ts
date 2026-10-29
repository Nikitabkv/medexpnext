import { APIError, type CollectionConfig, type FieldAccess } from 'payload'
import { can, guardDelete, guardScope, never, relationID, scoped, scopedRead, validateBranch } from '@/lib/access'

const moderators: FieldAccess = ({ req }) => can(req, 'reviews')
export const Reviews: CollectionConfig = {
  slug: 'reviews', labels: { singular: 'Отзыв', plural: 'Отзывы' },
  admin: { useAsTitle: 'name', group: 'Отзывы', defaultColumns: ['name', 'city', 'rating', 'status', 'replyPublished', 'createdAt'], description: 'Новые отзывы поступают с сайта. Ответ и статус публикации изменяются независимо.' },
  access: { read: scopedRead('reviews'), create: never, update: scoped('reviews'), delete: scoped('reviews'), readVersions: scoped('reviews') },
  versions: { maxPerDoc: 20 },
  hooks: {
    beforeChange: [guardScope('reviews'), async ({ data, originalDoc, req, operation }) => {
      const next = { ...originalDoc, ...data }
      await validateBranch(req, next.branch, next.city)
      if (next.doctor) {
        const doctor = await req.payload.findByID({ collection: 'doctors', id: relationID(next.doctor), depth: 0, overrideAccess: true, req })
        if (!(doctor.cities as unknown[]).map(relationID).includes(relationID(next.city))) throw new APIError('Врач не относится к выбранному городу.', 400)
        if (next.branch && !(doctor.branches as unknown[] ?? []).map(relationID).includes(relationID(next.branch))) throw new APIError('Врач не принимает в выбранном филиале.', 400)
      }
      if (next.replyPublished && !next.reply?.trim()) throw new APIError('Для публикации ответа введите его текст.', 400)
      if (data.reply && data.reply !== originalDoc?.reply) data.repliedAt = new Date().toISOString()
      if (data.status === 'published' && originalDoc?.status !== 'published') data.publishedAt = new Date().toISOString()
      // Public route is the only trusted creator. Generic REST creation is always denied.
      if (operation === 'create' && req.user) throw new APIError('Отзывы добавляются через форму на сайте.', 403)
      return data
    }], beforeDelete: [guardDelete('reviews')],
  },
  fields: [
    { name: 'name', type: 'text', label: 'Имя автора', required: true, maxLength: 80 },
    { name: 'rating', type: 'number', label: 'Оценка', required: true, min: 1, max: 5 },
    { name: 'text', type: 'textarea', label: 'Текст отзыва', required: true, minLength: 10, maxLength: 3000 },
    { name: 'city', type: 'relationship', relationTo: 'cities', label: 'Город', required: true, index: true, admin: { readOnly: true } },
    { name: 'branch', type: 'relationship', relationTo: 'branches', label: 'Филиал', required: true, admin: { readOnly: true } },
    { name: 'doctor', type: 'relationship', relationTo: 'doctors', label: 'Врач', admin: { readOnly: true } },
    { name: 'contactEmail', type: 'email', label: 'Контакт автора (не публикуется)', access: { read: moderators } },
    { name: 'status', type: 'select', label: 'Модерация', required: true, defaultValue: 'pending', index: true, admin: { position: 'sidebar' }, options: [{ label: 'На модерации', value: 'pending' }, { label: 'Опубликован', value: 'published' }, { label: 'Отклонён', value: 'rejected' }] },
    { name: 'moderationNote', type: 'textarea', label: 'Внутренняя заметка / причина отклонения', access: { read: moderators }, maxLength: 2000 },
    { name: 'reply', type: 'textarea', label: 'Официальный ответ', maxLength: 3000, access: { read: ({ req, siblingData }) => can(req, 'reviews') || !!siblingData?.replyPublished } },
    { name: 'replyPublished', type: 'checkbox', label: 'Публиковать ответ рядом с отзывом', defaultValue: false },
    { name: 'repliedAt', type: 'date', label: 'Дата ответа', admin: { readOnly: true } },
    { name: 'publishedAt', type: 'date', label: 'Дата публикации', admin: { readOnly: true } },
    { name: 'consentAt', type: 'date', label: 'Дата согласия', access: { read: moderators, update: () => false }, admin: { readOnly: true } },
    { name: 'consentVersion', type: 'text', label: 'Версия согласия', access: { read: moderators, update: () => false }, admin: { readOnly: true } },
    { name: 'submissionKey', type: 'text', unique: true, access: { read: () => false, update: () => false }, admin: { hidden: true } },
  ],
}
