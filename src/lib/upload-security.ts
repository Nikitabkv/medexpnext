import { randomUUID } from 'node:crypto'
import sharp from 'sharp'
import { APIError, type CollectionBeforeOperationHook } from 'payload'

export function detectFileType(bytes: Buffer): 'image/jpeg' | 'image/png' | 'application/pdf' | null {
  if (bytes.length >= 8 && bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) return 'image/png'
  if (bytes.length >= 3 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return 'image/jpeg'
  if (bytes.subarray(0, 5).toString('ascii') === '%PDF-') return 'application/pdf'
  return null
}
export const validateUpload: CollectionBeforeOperationHook = async ({ args, operation, req }) => {
  if (!['create', 'update'].includes(operation) || !req.file) return args
  const file = req.file
  const bytes = Buffer.from(file.data)
  const detected = detectFileType(bytes)
  const photosOnly = args.collection?.config.slug === 'media'
  if (!detected || file.mimetype !== detected || (photosOnly && detected === 'application/pdf')) {
    throw new APIError('Допустимы только настоящие файлы JPEG, PNG и PDF. Для фотографий — JPEG или PNG.', 400)
  }
  if (bytes.length > 8 * 1024 * 1024) throw new APIError('Максимальный размер файла — 8 МБ.', 413)
  if (detected.startsWith('image/')) {
    try {
      const image = await sharp(bytes, { limitInputPixels: 25_000_000 }).rotate()
        .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 88 }).toBuffer()
      req.file = { ...file, data: image, size: image.length, mimetype: 'image/jpeg', name: `${randomUUID()}.jpg` }
    } catch { throw new APIError('Не удалось прочитать изображение.', 400) }
  } else {
    req.file = { ...file, name: `${randomUUID()}.pdf` }
  }
  if ('data' in args && args.data) {
    const data = args.data as Record<string, unknown>
    delete data.filename; delete data.mimeType; delete data.filesize
  }
  return args
}
