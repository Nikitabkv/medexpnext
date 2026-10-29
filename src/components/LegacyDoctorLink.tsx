'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
export function LegacyDoctorLink() {
  const router = useRouter()
  useEffect(() => {
    async function navigate() {
      const match = /^#doc_(\d{1,10})$/.exec(window.location.hash)
      if (!match) return
      const response = await fetch(`/api/legacy-doctor/${match[1]}`)
      if (response.ok) { const result = await response.json(); router.replace(`/specialists/${encodeURIComponent(result.slug)}`) }
    }
    void navigate()
    window.addEventListener('hashchange', navigate)
    return () => window.removeEventListener('hashchange', navigate)
  }, [router])
  return null
}
