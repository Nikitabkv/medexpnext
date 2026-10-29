// Public source assets only. Run manually; the website serves the resulting files locally.
import { mkdir, writeFile } from 'node:fs/promises'
await mkdir('src/fonts', { recursive: true })
await mkdir('public/reference/videos', { recursive: true })
for (const [url, file] of [
  ['https://raw.githubusercontent.com/google/fonts/main/ofl/roboto/Roboto%5Bwdth,wght%5D.ttf', 'src/fonts/Roboto.ttf'],
  ['https://raw.githubusercontent.com/google/fonts/main/ofl/roboto/OFL.txt', 'src/fonts/OFL.txt'],
]) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`${file}: ${response.status}`)
  await writeFile(file, Buffer.from(await response.arrayBuffer()))
  console.log('Saved', file)
}
const videos = [
  ['company', '030147f2cf5b9429a38d59e789e3f83f'],
  ['telemedicine', '7f8cd49eb2411cc6737b05cf9f900dda'],
  ['laboratory', 'cd7fb3308b1761469d68103eb7ff8fcc'],
]
for (const [name, id] of videos) {
  const response = await fetch(`https://rutube.ru/api/video/${id}/?format=json`)
  if (!response.ok) throw new Error(`Video ${name}: ${response.status}`)
  const data = await response.json()
  const thumbnail = new URL(data.thumbnail_url)
  if (thumbnail.protocol !== 'https:') throw new Error('Insecure thumbnail URL')
  const image = await fetch(thumbnail)
  if (!image.ok) throw new Error(`Thumbnail ${name}: ${image.status}`)
  await writeFile(`public/reference/videos/${name}.jpg`, Buffer.from(await image.arrayBuffer()))
  console.log('Saved video poster', name)
}
