import type { SVGProps } from 'react'
const paths: Record<string, React.ReactNode> = {
  check: <path d="m5 12 4 4L20 5"/>,
  hospital: <><path d="M5 21V7h14v14M3 21h18M9 21v-5h6v5M10 3h4v7h-4zM8 5h8M8 12h1m6 0h1"/></>,
  play: <path d="m9 5 11 7-11 7V5Z"/>,
  external: <><path d="M14 3h7v7m0-7L10 14M10 3H3v18h18v-7"/></>,
  info: <><circle cx="12" cy="12" r="10"/><path d="M12 11v6m0-10h.01"/></>,
  lock: <><rect x="4" y="10" width="16" height="12" rx="2"/><path d="M8 10V6a4 4 0 0 1 8 0v4m-4 5v3"/></>,
  scales: <><path d="M12 2v20M6 22h12M3 7h18M6 7l-4 8h8L6 7Zm12 0-4 8h8l-4-8Z"/></>,
  search: <><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/></>,
  pin: <><path d="M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
  phone: <path d="M6 3 3 6c0 7 8 15 15 15l3-3-5-4-2 2c-3-1-5-3-6-6l2-2-4-5Z"/>,
  arrow: <><path d="M4 12h15m-6-6 6 6-6 6"/></>,
  chevron: <path d="m8 4 8 8-8 8"/>,
  down: <path d="m6 9 6 6 6-6"/>,
  file: <><path d="M6 2h8l5 5v15H6Z"/><path d="M14 2v6h5M9 13h7M9 17h7"/></>,
  close: <path d="m6 6 12 12M6 18 18 6"/>,
  menu: <path d="M3 6h18M3 12h18M3 18h18"/>,
  star: <path d="m12 2 3 6.5 7 .9-5 5 1.3 7L12 18l-6.3 3.4L7 14.4l-5-5 7-.9Z"/>,
  mrt: <><path d="M9 4a3 3 0 0 0-5 3 4 4 0 0 0-1 7 4 4 0 0 0 6 6m6-16a3 3 0 0 1 5 3 4 4 0 0 1 1 7 4 4 0 0 1-6 6M12 3v18M6 8l3 2m9-2-3 2M5 15l4-1m10 1-4-1"/></>,
  kt: <><path d="M12 3v9M10 8C6 4 3 9 3 16c0 4 5 3 7 1V8Zm4 0c4-4 7 1 7 8 0 4-5 3-7 1V8Z"/></>,
  rentgen: <><path d="M12 2v20M5 5c2 3 12 3 14 0M4 9c3 3 13 3 16 0M4 13c3 3 13 3 16 0M5 17c2 3 12 3 14 0"/></>,
  uzi: <><rect x="3" y="3" width="18" height="14" rx="2"/><path d="M7 13h10L12 6Zm5 4v4M7 21h10"/></>,
  fd: <><path d="M20 13C27 3 15-1 12 7 8-1-3 4 4 13l8 8 8-8Z"/><path d="M2 12h5l2-4 4 9 2-5h7"/></>,
  km: <><path d="M5 3v6a5 5 0 0 0 10 0V3M3 3h4m6 0h4M10 14v3a4 4 0 0 0 8 0v-3"/><circle cx="18" cy="11" r="3"/></>,
  lab: <><path d="M8 2h8M9 2v7L5 19a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3L15 9V2M8 14h8"/></>,
}
export function Icon({ name, ...props }: SVGProps<SVGSVGElement> & { name: string }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name] ?? paths.file}</svg>
}
