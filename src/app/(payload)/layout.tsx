import config from '@payload-config'
import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts'
import type { ServerFunctionClient } from 'payload'
import { importMap } from './admin/importMap.js'
import '@payloadcms/next/css'
import './admin.scss'

const serverFunction: ServerFunctionClient = async (args) => {
  'use server'
  return handleServerFunctions({ ...args, config, importMap })
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return RootLayout({ children, config, importMap, serverFunction, htmlProps: { lang: 'ru' } })
}
