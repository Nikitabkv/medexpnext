import { cookies } from 'next/headers'
import { cms } from '@/lib/cms'
import { isAllowedOrigin, readLimitedJSON } from '@/lib/http-security'
import { checkReviewToken, privateDigest, reviewSchema } from '@/lib/review-security'
import { rateLimit } from '@/lib/rate-limit'
import { relationID } from '@/lib/access'

export async function POST(request: Request) {
  if (!isAllowedOrigin(request.headers.get('origin'))) return Response.json({ error: 'Источник запроса запрещён.' }, { status: 403 })
  if (!request.headers.get('content-type')?.startsWith('application/json')) return Response.json({ error: 'Ожидается JSON.' }, { status: 415 })
  let body: unknown
  try { body = await readLimitedJSON(request) }
  catch (error) { return Response.json({ error: 'Некорректный запрос.' }, { status: (error as Error).message === 'BODY_TOO_LARGE' ? 413 : 400 }) }
  const result = reviewSchema.safeParse(body)
  if (!result.success) return Response.json({ error: 'Проверьте имя, оценку, текст отзыва и согласие.' }, { status: 400 })
  const input = result.data
  const session = (await cookies()).get('medexp-review-session')?.value ?? ''
  if (!checkReviewToken(input.token, session)) return Response.json({ error: 'Форма устарела. Обновите страницу и попробуйте снова.' }, { status: 403 })
  const payload = await cms()
  if (!await rateLimit('review-global', 'site', 100, 3_600_000) || !await rateLimit('review-session', session, 3, 900_000)) {
    return Response.json({ error: 'Вы уже отправляли отзывы. Попробуйте позже.' }, { status: 429, headers: { 'Retry-After': '900' } })
  }
  if (process.env.TRUST_PROXY === 'true') {
    const ip = request.headers.get('x-real-ip') ?? 'unknown'
    if (!await rateLimit('review-ip', ip, 15, 3_600_000)) return Response.json({ error: 'Слишком много запросов.' }, { status: 429 })
  }
  try {
    const branch = await payload.findByID({ collection: 'branches', id: input.branch, overrideAccess: false, depth: 0 })
    if (relationID(branch.city) !== String(input.city)) return Response.json({ error: 'Проверьте выбранный филиал.' }, { status: 400 })
    if (input.doctor) {
      const doctor = await payload.findByID({ collection: 'doctors', id: input.doctor, overrideAccess: false, depth: 0 })
      if (!doctor.branches?.map(relationID).includes(String(input.branch))) return Response.json({ error: 'Врач не принимает в выбранном филиале.' }, { status: 400 })
    }
    const key = privateDigest(input.token)
    const duplicate = await payload.count({ collection: 'reviews', overrideAccess: true, where: { submissionKey: { equals: key } } })
    if (duplicate.totalDocs) return Response.json({ error: 'Этот отзыв уже отправлен.' }, { status: 409 })
    await payload.create({ collection: 'reviews', overrideAccess: true, data: {
      name: input.name, text: input.text, rating: input.rating, city: input.city, branch: input.branch,
      doctor: input.doctor, contactEmail: input.contactEmail || undefined,
      status: 'pending', replyPublished: false,
      consentAt: new Date().toISOString(), consentVersion: 'review-consent-v1', submissionKey: key,
    } })
    return Response.json({ message: 'Спасибо! Отзыв отправлен на модерацию и появится после проверки.' }, { status: 201 })
  } catch {
    return Response.json({ error: 'Не удалось отправить отзыв. Проверьте выбранный филиал или повторите попытку позже.' }, { status: 400 })
  }
}
