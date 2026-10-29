import { spawnSync } from 'node:child_process'
import nextEnv from '@next/env'
nextEnv.loadEnvConfig(process.cwd())
const result = spawnSync(process.execPath, ['node_modules/payload/bin.js', ...process.argv.slice(2)], { stdio: 'inherit', env: process.env })
process.exit(result.status ?? 1)
