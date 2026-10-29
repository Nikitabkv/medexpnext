import nextEnv from '@next/env'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
nextEnv.loadEnvConfig(process.cwd())
const { getPayload } = await import('payload')
const { default: config } = await import('../src/payload.config')
const payload = await getPayload({ config })
if (process.env.NODE_ENV === 'production') throw new Error('Demo seed is disabled in production.')
const credentials = JSON.parse(await readFile('.local/bootstrap.json', 'utf8'))
if ((await payload.count({ collection: 'cities', overrideAccess: true })).totalDocs) {
  console.log('Existing data found. Seed skipped; no records or passwords were overwritten.')
  process.exit(0)
}
const voronezh = await payload.create({ collection: 'cities', data: { name: 'Воронеж', nameIn: 'Воронеже', slug: 'voronezh', order: 1 } })
const belgorod = await payload.create({ collection: 'cities', data: { name: 'Белгород', nameIn: 'Белгороде', slug: 'belgorod', order: 2 } })
const v1 = await payload.create({ collection: 'branches', data: { name: 'Центр на Генерала Лизюкова, 25', city: voronezh.id, legacyID: '1', address: 'ул. Генерала Лизюкова, 25', hours: 'Режим работы уточняйте по телефону', status: 'published' } })
const v2 = await payload.create({ collection: 'branches', data: { name: 'Центр на Плехановской, 53', city: voronezh.id, legacyID: '2', address: 'ул. Плехановская, 53', hours: 'Режим работы уточняйте по телефону', status: 'published' } })
const b1 = await payload.create({ collection: 'branches', data: { name: 'Центр на Богдана Хмельницкого, 101', city: belgorod.id, legacyID: '19', address: 'пр. Богдана Хмельницкого, 101', hours: 'Ежедневно с 07:00 до 20:00', status: 'published' } })
await payload.create({ collection: 'users', data: { name: 'Администратор сети', email: credentials.adminEmail, password: credentials.adminPassword, role: 'admin', modules: [], cities: [] } })
await payload.create({ collection: 'users', data: { name: 'Редактор Воронежа', email: credentials.editorEmail, password: credentials.editorPassword, role: 'editor', cities: [voronezh.id], modules: ['doctors', 'prices', 'reviews', 'promotions', 'content'] } })
const doctorRows = [
  ['Сарычева Елена Владимировна', 'Главный врач', 'Высшая категория', 'sarycheva', '1'],
  ['Седенков Николай Анатольевич', 'Заместитель главного врача по клинико-экспертной работе', '', 'sedenkov', '895'],
  ['Наумова Светлана Александровна', 'Врач-терапевт', 'Высшая категория', 'naumova', '73'],
  ['Сереженко Николай Петрович', 'Врач ультразвуковой диагностики', 'Кандидат медицинских наук, высшая категория', 'serezhenko', '2'],
  ['Тимошенко Татьяна Алексеевна', 'Врач-рентгенолог', 'Высшая категория', 'timoshenko', '9'],
  ['Брагина Ирина Васильевна', 'Врач-терапевт', 'Первая категория', 'bragina', '361'],
  ['Белкина Ольга Геннадьевна', 'Врач-кардиолог', '', 'belkina', '680'],
]
const doctors = []
for (const [index, [name, specialty, qualification, slug, legacyID]] of doctorRows.entries()) {
  const isBelgorod = slug === 'belkina'
  const city = isBelgorod ? belgorod.id : voronezh.id
  const photo = await payload.create({ collection: 'media', data: { alt: name, city, status: 'published' }, filePath: path.resolve(`seed-assets/doctors/${slug}.jpg`) })
  const doctor = await payload.create({ collection: 'doctors', data: {
    name, specialty, qualification, slug, legacyID, photo: photo.id,
    cities: [city], branches: isBelgorod ? [b1.id] : [v1.id, v2.id],
    biography: 'Информация о специалисте опубликована на действующем сайте МедЭксперта. Полную биографию, образование и места приёма необходимо подтвердить перед запуском новой версии.',
    status: 'published', order: index,
  } })
  doctors.push(doctor)
}
const categoryRows = [
  ['Магнитно-резонансная томография (МРТ)', 'МРТ', 'mrt'],
  ['Компьютерная томография (КТ)', 'КТ', 'kt'],
  ['Рентгенография', 'Рентген', 'rentgen'],
  ['Ультразвуковые исследования (УЗИ)', 'УЗИ', 'uzi'],
  ['Функциональная диагностика', 'Функциональная диагностика', 'fd'],
  ['Консультации и манипуляции', 'Приём врачей', 'km'],
  ['Лабораторная диагностика', 'Анализы', 'lab'],
]
const serviceRows: [string, string, number][] = [
  ['Головной мозг', 'Голова', 4450], ['Гипофиз', 'Голова', 4300], ['Глазные орбиты и зрительные нервы', 'Голова', 4300],
  ['Придаточные пазухи носа', 'Голова', 4200], ['Артерии головного мозга', 'Голова', 4250],
  ['Шейный отдел позвоночника', 'Позвоночник', 4450], ['Грудной отдел позвоночника', 'Позвоночник', 4450], ['Пояснично-крестцовый отдел позвоночника', 'Позвоночник', 4450],
]
const more: [string, string, number][][] = [[], [['Головной мозг', 'Голова', 3450], ['Придаточные пазухи носа', 'Голова', 3750]], [['Флюорография в одной проекции', 'Грудная клетка', 990]], [['Щитовидная железа', 'Исследования', 1450], ['Сердце', 'Исследования', 2800]], [['Электрокардиограмма покоя', 'Исследования', 900]], [['Консультация врача-терапевта', 'Консультации', 1850], ['Консультация врача-кардиолога', 'Консультации', 2100]], [['Общий анализ венозной крови', 'Клиника крови', 405], ['Глюкоза', 'Биохимия крови', 190]]]
for (const [index, [name, shortName, slug]] of categoryRows.entries()) {
  const category = await payload.create({ collection: 'categories', data: { name, shortName, slug, order: index, description: `Услуги направления «${name}» в центрах МедЭксперт. Информацию о подготовке и доступности исследования уточните по телефону.`, status: 'published' } })
  for (const [order, [serviceName, group, amount]] of (index === 0 ? serviceRows : more[index]).entries()) {
    const service = await payload.create({ collection: 'services', data: { name: serviceName, group, code: `DEMO-${slug}-${order}`, category: category.id, order, status: 'published' } })
    for (const city of [voronezh, belgorod]) await payload.create({ collection: 'prices', data: { service: service.id, city: city.id, amount: city.id === voronezh.id ? amount : amount + 150, kind: 'fixed', available: true, status: 'published' } })
  }
}
for (const city of [voronezh, belgorod]) {
  await payload.create({ collection: 'promotions', data: { title: 'Скидка 50% на комплекс витаминов группы B', city: city.id, text: 'Исследование витаминов B1, B2, B3, B5, B6, B7, B9 и B12. Условия и доступность акции уточняйте по телефону 8-800-333-0-800.', startsAt: '2026-07-08T00:00:00.000Z', endsAt: '2026-10-31T20:59:59.000Z', legacyID: city.id === voronezh.id ? '80' : undefined, status: 'published' } })
  await payload.create({ collection: 'promotions', data: { title: 'Витамины красоты и здоровья со скидкой 60%', city: city.id, text: 'Комплексное исследование витаминов D, A, E и K. Подробности акции и подготовку к исследованиям уточняйте в центре.', startsAt: '2026-04-01T00:00:00.000Z', endsAt: '2026-10-31T20:59:59.000Z', legacyID: city.id === voronezh.id ? '76' : undefined, status: 'published' } })
  const branch = city.id === voronezh.id ? v1 : b1
  await payload.create({ collection: 'reviews', data: { name: 'Анна · демо', text: 'Демонстрационный отзыв: здесь пациент сможет рассказать о посещении центра. Этот пример добавлен для проверки публикации и официального ответа.', rating: 5, city: city.id, branch: branch.id, status: 'published', reply: 'Пример официального ответа клиники. Ответ публикуется отдельно от решения по отзыву.', replyPublished: true, publishedAt: new Date().toISOString(), consentVersion: 'demo' } })
  await payload.create({ collection: 'reviews', data: { name: 'Михаил · демо', text: 'Тестовый отзыв на модерации. Он виден сотрудникам в админке и появится на сайте только после одобрения.', rating: 4, city: city.id, branch: branch.id, status: 'pending', replyPublished: false, consentVersion: 'demo' } })
  for (const [slug, title, intro] of [
    ['laboratory', 'Лаборатория', 'Лабораторные исследования в центрах МедЭксперт. Выберите исследование в каталоге услуг и уточните подготовку по телефону.'],
    ['questions', 'Вопрос-ответ', 'Здесь собраны ответы на организационные вопросы о посещении центров.'],
    ['articles', 'Статьи', 'Раздел для материалов, подготовленных и проверенных специалистами клиники.'],
    ['privacy', 'Политика конфиденциальности', 'Это демонстрационная версия сайта. Не указывайте в формах диагнозы, результаты анализов и другие сведения о здоровье. Перед рабочим запуском клиника должна утвердить документы об обработке и публикации персональных данных.'],
  ]) await payload.create({ collection: 'pages', data: { title, slug, intro, city: city.id, status: 'published', sections: slug === 'questions' ? [{ heading: 'Как записаться на приём?', text: 'Позвоните по номеру 8-800-333-0-800 или перейдите в существующий Атлас пациента.' }, { heading: 'Как узнать стоимость?', text: 'Выберите город, откройте «Услуги и цены» и найдите нужную услугу. В демонстрационной версии цены требуют подтверждения клиникой.' }] : [] } })
}
await mkdir('.local', { recursive: true })
await writeFile('.local/seed-ids.json', JSON.stringify({ voronezh: voronezh.id, belgorod: belgorod.id, v1: v1.id, v2: v2.id, b1: b1.id, doctors: doctors.map(d => d.id) }))
console.log('Demo seed completed: 2 cities, 3 branches, 7 doctors, service catalogue, reviews and pages. Login details remain in .local/bootstrap.json.')
process.exit(0)
