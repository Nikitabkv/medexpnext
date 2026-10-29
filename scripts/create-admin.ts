import nextEnv from '@next/env'
nextEnv.loadEnvConfig(process.cwd())
let input = ''
for await (const chunk of process.stdin) {
  input += chunk
  if (Buffer.byteLength(input) > 4096) throw new Error('Input is too large.')
}
const { email, password, name } = JSON.parse(input)
if (typeof email !== 'string' || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || typeof password !== 'string' || password.length < 16) throw new Error('Provide email and a password of at least 16 characters through stdin JSON.')
const { getPayload } = await import('payload')
const { default: config } = await import('../src/payload.config')
const payload = await getPayload({ config })
if ((await payload.count({ collection: 'users', overrideAccess: true })).totalDocs) throw new Error('An account already exists. Use an existing administrator to manage users.')
await payload.create({ collection: 'users', overrideAccess: true, data: { name: typeof name === 'string' ? name : 'Администратор', email, password, role: 'admin', cities: [], modules: [] } })
console.log('Administrator created. Credentials were not written to logs or files.')
process.exit(0)
