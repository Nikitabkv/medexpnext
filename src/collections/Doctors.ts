import { APIError, type Access, type CollectionConfig } from 'payload'
import { assertCities, can, cityIDs, guardDelete, guardScope, relationID, scoped, scopedRead, staff, statusField } from '@/lib/access'
import { validateUpload } from '@/lib/upload-security'
import path from 'node:path'

export const Doctors: CollectionConfig = {
  slug: 'doctors', labels: { singular: 'Врач', plural: 'Врачи' },
  admin: { useAsTitle: 'name', group: 'Врачи и документы', defaultColumns: ['name', 'specialty', 'cities', 'externalDoctorID', 'status'] },
  access: { read: scopedRead('doctors', true), create: scoped('doctors', true), update: scoped('doctors', true), delete: scoped('doctors', true), readVersions: scoped('doctors', true) },
  versions: { maxPerDoc: 20 },
  hooks: {
    beforeChange: [guardScope('doctors', true), async ({ data, originalDoc, req }) => {
      const next = { ...originalDoc, ...data }
      if (!next.cities?.length) throw new APIError('Выберите хотя бы один город.', 400)
      for (const branch of next.branches ?? []) {
        const item = await req.payload.findByID({ collection: 'branches', id: relationID(branch), overrideAccess: true, depth: 0, req })
        if (!next.cities.map(relationID).includes(relationID(item.city))) throw new APIError('Город филиала должен быть выбран в карточке врача.', 400)
      }
      if (next.photo) {
        const photo = await req.payload.findByID({ collection: 'media', id: relationID(next.photo), depth: 0, overrideAccess: true, req })
        if (!next.cities.map(relationID).includes(relationID(photo.city))) throw new APIError('Фотография относится к другому городу.', 400)
      }
      if (typeof data.externalDoctorID === 'string') data.externalDoctorID = data.externalDoctorID.trim() || null
      return data
    }], beforeDelete: [guardDelete('doctors', true)],
  },
  fields: [
    { name: 'name', type: 'text', label: 'ФИО', required: true, maxLength: 160 },
    { name: 'slug', type: 'text', label: 'Адрес карточки', required: true, unique: true, validate: (v: unknown) => typeof v === 'string' && /^[a-z0-9-]{2,100}$/.test(v) || 'Латинские буквы, цифры и дефисы.' },
    { name: 'legacyID', type: 'text', label: 'ID врача старого сайта', unique: true, admin: { description: 'Число из ссылки /specialists#doc_680. Не является ID из МИС.' } },
    { name: 'externalDoctorID', type: 'text', label: 'ID врача в МИС', unique: true, maxLength: 80, access: { read: ({ req }) => can(req, 'doctors') }, admin: { description: 'Вводится вручную. Для будущей интеграции расписания. Начальные нули сохраняются.' } },
    { name: 'specialty', type: 'text', label: 'Специальности', required: true },
    { name: 'qualification', type: 'text', label: 'Категория и учёная степень' },
    { name: 'photo', type: 'upload', relationTo: 'media', label: 'Фото' },
    { name: 'documents', type: 'join', collection: 'documents', on: 'doctor', label: 'Документы врача', defaultLimit: 20, defaultSort: 'order', access: { read: ({ req }) => can(req, 'doctors') }, admin: { allowCreate: true, defaultColumns: ['title', 'kind', 'status'], description: 'Загрузите сканы дипломов и сертификатов. Опубликованные изображения появятся в карусели, PDF — в списке для скачивания. Сначала сохраните нового врача.' } },
    { name: 'cities', type: 'relationship', relationTo: 'cities', hasMany: true, required: true, label: 'Города', index: true },
    { name: 'branches', type: 'relationship', relationTo: 'branches', hasMany: true, label: 'Места приёма' },
    { name: 'biography', type: 'textarea', label: 'О враче', maxLength: 10000 },
    { name: 'education', type: 'textarea', label: 'Образование', maxLength: 10000 },
    { name: 'career', type: 'textarea', label: 'Опыт работы', maxLength: 10000 },
    { name: 'order', type: 'number', label: 'Порядок', defaultValue: 0 }, statusField,
  ],
}

export const Media: CollectionConfig = {
  slug: 'media', labels: { singular: 'Фотография', plural: 'Фотографии' }, admin: { useAsTitle: 'alt', group: 'Врачи и документы' },
  access: { read: scopedRead('doctors'), create: scoped('doctors'), update: scoped('doctors'), delete: scoped('doctors') },
  upload: { staticDir: path.resolve(process.env.STORAGE_DIR || 'storage', 'media'), pasteURL: false, mimeTypes: ['image/jpeg', 'image/png'], displayPreview: true, filesRequiredOnCreate: true },
  hooks: { beforeOperation: [validateUpload], beforeChange: [guardScope('doctors')], beforeDelete: [guardDelete('doctors')] },
  fields: [
    { name: 'alt', type: 'text', label: 'Описание фотографии', required: true },
    { name: 'city', type: 'relationship', relationTo: 'cities', label: 'Город', required: true, index: true }, statusField,
  ],
}

const doctorDocumentAccess: Access = ({ req }) => {
  if (!can(req, 'doctors')) return false
  if (staff(req)?.role === 'admin') return true
  return { 'doctor.cities': { in: cityIDs(req) } }
}
export const Documents: CollectionConfig = {
  slug: 'documents', labels: { singular: 'Документ врача', plural: 'Документы врачей' },
  admin: { useAsTitle: 'title', group: 'Врачи и документы', defaultColumns: ['title', 'doctor', 'kind', 'status'] },
  access: {
    read: ({ req }) => staff(req) ? doctorDocumentAccess({ req }) : { and: [{ status: { equals: 'published' } }, { 'doctor.status': { equals: 'published' } }] },
    create: ({ req }) => can(req, 'doctors'), update: doctorDocumentAccess, delete: doctorDocumentAccess,
  },
  upload: { staticDir: path.resolve(process.env.STORAGE_DIR || 'storage', 'documents'), pasteURL: false, mimeTypes: ['application/pdf', 'image/jpeg', 'image/png'], filesRequiredOnCreate: true, displayPreview: false },
  hooks: {
    beforeOperation: [validateUpload],
    beforeChange: [async ({ data, originalDoc, req }) => {
      if (originalDoc?.doctor && req.user) {
        const old = await req.payload.findByID({ collection: 'doctors', id: relationID(originalDoc.doctor), depth: 0, overrideAccess: true, req })
        assertCities(req, old.cities as unknown[], 'doctors')
      }
      const doctor = await req.payload.findByID({ collection: 'doctors', id: relationID(data.doctor ?? originalDoc?.doctor), depth: 0, overrideAccess: true, req })
      if (req.user) assertCities(req, doctor.cities as unknown[], 'doctors')
      data.cities = doctor.cities
      return data
    }],
    beforeDelete: [async ({ id, req }) => {
      if (!req.user) return
      const doc = await req.payload.findByID({ collection: 'documents', id, depth: 0, overrideAccess: true, req })
      const doctor = await req.payload.findByID({ collection: 'doctors', id: relationID(doc.doctor), depth: 0, overrideAccess: true, req })
      assertCities(req, doctor.cities as unknown[], 'doctors')
    }],
  },
  fields: [
    { name: 'title', type: 'text', label: 'Название', required: true },
    { name: 'doctor', type: 'relationship', relationTo: 'doctors', label: 'Врач', required: true, index: true },
    { name: 'cities', type: 'relationship', relationTo: 'cities', hasMany: true, admin: { hidden: true } },
    { name: 'kind', type: 'select', label: 'Тип', required: true, options: [{ label: 'Диплом', value: 'diploma' }, { label: 'Сертификат', value: 'certificate' }, { label: 'Аккредитация', value: 'accreditation' }, { label: 'Другое', value: 'other' }] },
    { name: 'issuedAt', type: 'date', label: 'Дата выдачи' },
    { name: 'expiresAt', type: 'date', label: 'Действует до' },
    { name: 'order', type: 'number', label: 'Порядок', defaultValue: 0 }, statusField,
  ],
}
