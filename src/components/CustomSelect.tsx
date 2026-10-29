'use client'
import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { Icon } from './Icon'
import styles from './CustomSelect.module.css'

export type SelectOption = { value: string; label: string }
type Props = { label: string; options: SelectOption[]; name?: string; value?: string; defaultValue?: string; onValueChange?: (value: string) => void; required?: boolean; disabled?: boolean; compact?: boolean; className?: string }

export function CustomSelect({ label, options, name, value, defaultValue = '', onValueChange, required, disabled, compact, className = '' }: Props) {
  const id = useId(), root = useRef<HTMLDivElement>(null), trigger = useRef<HTMLButtonElement>(null), native = useRef<HTMLSelectElement>(null)
  const [local, setLocal] = useState(defaultValue), [open, setOpen] = useState(false), [active, setActive] = useState(0), [invalid, setInvalid] = useState(false)
  const search = useRef({ text: '', time: 0 })
  const selected = value ?? local
  const selectedIndex = Math.max(0, options.findIndex(o => o.value === selected))
  useEffect(() => { setLocal(defaultValue) }, [defaultValue])
  useEffect(() => {
    if (!open) return
    const close = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false) }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [open])
  useEffect(() => {
    const form = native.current?.form
    const reset = () => { setLocal(defaultValue); setOpen(false); setInvalid(false) }
    form?.addEventListener('reset', reset)
    return () => form?.removeEventListener('reset', reset)
  }, [defaultValue])
  useEffect(() => { if (open) document.getElementById(`${id}-option-${active}`)?.scrollIntoView({ block: 'nearest' }) }, [active, open, id])
  const choose = (index: number) => {
    const option = options[index]
    if (!option) return
    setLocal(option.value); setInvalid(false); setOpen(false); onValueChange?.(option.value); trigger.current?.focus()
  }
  function keyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (['ArrowDown', 'ArrowUp', 'Home', 'End', 'Enter', ' '].includes(event.key)) {
      event.preventDefault()
      if (!open) { setActive(event.key === 'End' ? options.length - 1 : selectedIndex); setOpen(true); return }
      if (event.key === 'Enter' || event.key === ' ') return choose(active)
      setActive(index => event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1 : (index + (event.key === 'ArrowUp' ? -1 : 1) + options.length) % options.length)
    } else if (event.key === 'Escape') { event.preventDefault(); setOpen(false) }
    else if (event.key === 'Tab') setOpen(false)
    else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
      const now = Date.now(); search.current = { text: (now - search.current.time < 700 ? search.current.text : '') + event.key.toLocaleLowerCase('ru'), time: now }
      const index = options.findIndex(o => o.label.toLocaleLowerCase('ru').startsWith(search.current.text))
      if (index >= 0) { setOpen(true); setActive(index) }
    }
  }
  return <div ref={root} className={`${styles.root} ${compact ? styles.compact : ''} ${invalid ? styles.invalid : ''} ${className}`}>
    <select ref={native} aria-hidden="true" tabIndex={-1} name={name} value={selected} disabled={disabled} required={required} className={styles.native} onChange={e => { setLocal(e.target.value); onValueChange?.(e.target.value) }} onInvalid={e => { e.preventDefault(); setInvalid(true); setOpen(true); trigger.current?.focus() }}>{options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
    <button ref={trigger} type="button" role="combobox" aria-label={label} aria-haspopup="listbox" aria-expanded={open} aria-controls={`${id}-list`} aria-required={required} aria-invalid={invalid || undefined} aria-activedescendant={open ? `${id}-option-${active}` : undefined} disabled={disabled} className={styles.trigger} onClick={() => { setActive(selectedIndex); setOpen(!open) }} onKeyDown={keyDown}><span>{options.find(o => o.value === selected)?.label ?? label}</span><Icon name="down" width="16" height="16"/></button>
    {open && <div id={`${id}-list`} role="listbox" aria-label={label} className={styles.list}>{options.map((option, index) => <button type="button" role="option" aria-selected={option.value === selected} id={`${id}-option-${index}`} key={option.value} tabIndex={-1} className={`${styles.option} ${active === index ? styles.active : ''}`} onPointerMove={() => setActive(index)} onMouseDown={e => e.preventDefault()} onClick={() => choose(index)}><span>{option.label}</span>{option.value === selected && <Icon name="check" width="17" height="17"/>}</button>)}</div>}
  </div>
}
