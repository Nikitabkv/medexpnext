'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Direct legacy links identify a branch even when the visitor previously selected another city.
export function SyncCity({ target, current }: { target: string; current: string }) {
  const router = useRouter()
  useEffect(() => {
    if (target === current) return
    const controller = new AbortController()
    fetch('/api/city', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ city: target }), signal: controller.signal })
      .then(response => { if (response.ok) router.refresh() }).catch(() => {})
    return () => controller.abort()
  }, [target, current, router])
  return null
}
