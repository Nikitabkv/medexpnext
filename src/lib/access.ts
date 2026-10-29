import { APIError, type Access, type CollectionBeforeChangeHook, type CollectionBeforeDeleteHook, type FieldAccess, type PayloadRequest, type Where } from 'payload'

export const modules = ['doctors', 'prices', 'reviews', 'promotions', 'content'] as const
export type Module = typeof modules[number]
export type Staff = { id: number; role: 'admin' | 'editor'; cities?: unknown[] | null; modules?: Module[] | null; collection?: string }
export function relationID(value: unknown): string {
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  if (value && typeof value === 'object' && 'id' in value) return String(value.id)
  return ''
}
export function staff(req: Pick<PayloadRequest, 'user'>): Staff | undefined {
  return req.user && req.user.collection === 'users' ? req.user as unknown as Staff : undefined
}
export function can(req: Pick<PayloadRequest, 'user'>, module: Module): boolean {
  const user = staff(req)
  return !!user && (user.role === 'admin' || !!user.modules?.includes(module))
}
export const adminOnly: Access = ({ req }) => staff(req)?.role === 'admin'
export const adminField: FieldAccess = ({ req }) => staff(req)?.role === 'admin'
export const never: Access = () => false
export const publicRead: Access = () => true
export const published: Where = { status: { equals: 'published' } }
export const publishedRead: Access = ({ req }) => staff(req) ? true : published
export function cityIDs(req: Pick<PayloadRequest, 'user'>): string[] {
  return (staff(req)?.cities ?? []).map(relationID).filter(Boolean)
}
export function scoped(module: Module, multi = false): Access {
  return ({ req }) => {
    if (!can(req, module)) return false
    if (staff(req)?.role === 'admin') return true
    return { [multi ? 'cities' : 'city']: { in: cityIDs(req) } }
  }
}
export function scopedRead(module: Module, multi = false): Access {
  return (args) => staff(args.req) ? scoped(module, multi)(args) : published
}
export function assertCities(req: Pick<PayloadRequest, 'user'>, values: unknown[], module: Module): void {
  if (!can(req, module)) throw new APIError('Нет доступа к этому разделу.', 403)
  if (staff(req)?.role === 'admin') return
  const allowed = cityIDs(req)
  if (!values.length || values.some(v => !allowed.includes(relationID(v)))) {
    throw new APIError('Изменение данных другого города запрещено.', 403)
  }
}
export function guardScope(module: Module, multi = false): CollectionBeforeChangeHook {
  return ({ data, originalDoc, req, operation }) => {
    // Explicitly trusted local scripts run without a user. All network requests still require collection access.
    if (!req.user) return data
    const values = (doc: Record<string, unknown>) => multi ? (doc.cities as unknown[] ?? []) : [doc.city]
    if (operation === 'update' && originalDoc) assertCities(req, values(originalDoc), module)
    assertCities(req, values({ ...originalDoc, ...data }), module)
    return data
  }
}
export function guardDelete(module: Module, multi = false): CollectionBeforeDeleteHook {
  return async ({ id, req, collection }) => {
    if (!req.user) return
    const doc = await req.payload.findByID({ collection: collection.slug, id, depth: 0, overrideAccess: true, req })
    const record = doc as unknown as Record<string, unknown>
    assertCities(req, multi ? record.cities as unknown[] : [record.city], module)
  }
}
export async function validateBranch(req: PayloadRequest, branch: unknown, city: unknown): Promise<void> {
  if (!branch) return
  const record = await req.payload.findByID({ collection: 'branches', id: relationID(branch), overrideAccess: true, depth: 0, req })
  if (relationID(record.city) !== relationID(city)) throw new APIError('Филиал не принадлежит выбранному городу.', 400)
}
export const statusField = {
  name: 'status', type: 'select' as const, label: 'Публикация', required: true, defaultValue: 'draft', index: true,
  options: [{ label: 'Черновик', value: 'draft' }, { label: 'Опубликовано', value: 'published' }],
  admin: { position: 'sidebar' as const },
}
