'use client'
import { useEffect } from 'react'

export function FocusModality() {
  useEffect(() => {
    const pointer = () => { document.documentElement.dataset.inputModality = 'pointer' }
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === 'Tab') document.documentElement.dataset.inputModality = 'keyboard'
    }
    document.addEventListener('pointerdown', pointer, true)
    document.addEventListener('keydown', keyboard, true)
    return () => {
      document.removeEventListener('pointerdown', pointer, true)
      document.removeEventListener('keydown', keyboard, true)
      delete document.documentElement.dataset.inputModality
    }
  }, [])
  return null
}
