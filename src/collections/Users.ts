import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'
import { adminField, adminOnly, staff } from '@/lib/access'

export const Users: CollectionConfig = {
  slug: 'users', labels: { singular: 'Сотрудник', plural: 'Сотрудники' },
  admin: { useAsTitle: 'name', group: 'Управление', defaultColumns: ['name', 'email', 'role', 'cities'] },
  auth: {
    tokenExpiration: 3600, maxLoginAttempts: 5, lockTime: 600_000,
    cookies: { sameSite: 'Lax', secure: process.env.NODE_ENV === 'production' },
  },
  endpoints: [
    { path: '/first-register', method: 'post', handler: () => Response.json({ error: 'Используйте локальную процедуру создания администратора.' }, { status: 403 }) },
    { path: '/forgot-password', method: 'post', handler: () => Response.json({ errors: [{ message: 'Восстановление по почте пока не настроено. Обратитесь к администратору сайта.' }] }, { status: 503 }) },
  ],
  access: {
    create: adminOnly, delete: adminOnly,
    read: ({ req }) => staff(req)?.role === 'admin' ? true : req.user ? { id: { equals: req.user.id } } : false,
    update: ({ req }) => staff(req)?.role === 'admin' ? true : req.user ? { id: { equals: req.user.id } } : false,
    admin: ({ req }) => !!staff(req), unlock: adminOnly,
  },
  hooks: { beforeValidate: [({ data }) => {
    if (data?.password && (typeof data.password !== 'string' || data.password.length < 12 || data.password.length > 128)) throw new APIError('Пароль должен содержать от 12 до 128 символов.', 400)
    return data
  }] },
  fields: [
    { name: 'name', type: 'text', label: 'Имя', required: true },
    { name: 'role', type: 'select', label: 'Роль', defaultValue: 'editor', required: true,
      options: [{ label: 'Администратор сети', value: 'admin' }, { label: 'Редактор', value: 'editor' }],
      access: { create: adminField, update: adminField } },
    { name: 'cities', type: 'relationship', relationTo: 'cities', hasMany: true, label: 'Доступные города', access: { create: adminField, update: adminField } },
    { name: 'modules', type: 'select', hasMany: true, label: 'Разделы', access: { create: adminField, update: adminField },
      options: [{ label: 'Врачи и документы', value: 'doctors' }, { label: 'Услуги и цены', value: 'prices' }, { label: 'Отзывы', value: 'reviews' }, { label: 'Акции', value: 'promotions' }, { label: 'Страницы', value: 'content' }] },
  ],
}
