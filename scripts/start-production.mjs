import { cp, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { spawn } from 'node:child_process'
import nextEnv from '@next/env'
nextEnv.loadEnvConfig(process.cwd())
const root = process.cwd(), target = path.resolve('.next/standalone')
await mkdir(path.join(target, '.next'), { recursive: true })
await cp(path.join(root, '.next/static'), path.join(target, '.next/static'), { recursive: true })
await cp(path.join(root, 'public'), path.join(target, 'public'), { recursive: true })
const server = spawn(process.execPath, [path.join(target, 'server.js')], {
  stdio: 'inherit', env: { ...process.env, NODE_ENV: 'production', HOSTNAME: process.env.HOSTNAME || '127.0.0.1', PORT: process.env.PORT || '3100', STORAGE_DIR: path.resolve(process.env.STORAGE_DIR || 'storage') },
})
for (const event of ['SIGINT','SIGTERM']) process.on(event, () => server.kill(event))
server.on('exit', code => process.exit(code ?? 0))
