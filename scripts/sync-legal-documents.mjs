// Public company PDFs referenced by the existing med-exp.ru website.
import { mkdir, writeFile } from 'node:fs/promises'
const documents = [
  ['company-contract.pdf', '1ry7goVyDsWd53Y1TlvbjD_ke5F5F0o2J'],
  ['company-privacy.pdf', '1m_EYkfpMZCVBDJA0P0BG38PHRx_0aw2A'],
  ['human-rights-policy.pdf', '1EOhCxZ_JXf9V991CO0B6W5UoHSymwrEp'],
]
await mkdir('public/documents', { recursive: true })
for (const [filename, id] of documents) {
  const response = await fetch(`https://drive.google.com/uc?export=download&id=${id}`)
  if (!response.ok) throw new Error(`${filename}: HTTP ${response.status}`)
  const bytes = Buffer.from(await response.arrayBuffer())
  if (bytes.length > 20_000_000 || bytes.subarray(0, 5).toString() !== '%PDF-') throw new Error(`${filename}: expected a PDF under 20 MB, received ${response.headers.get('content-type')}`)
  await writeFile(`public/documents/${filename}`, bytes)
  console.log('Saved public PDF', filename, bytes.length, 'bytes')
}
