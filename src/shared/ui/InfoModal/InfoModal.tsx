"use client"
import s from './InfoModal.module.scss'
import {ElementRef, FC, ReactNode, useEffect, useRef} from "react"
import { createPortal } from 'react-dom'
import {useRouter} from "next/navigation";

type InfoModalProps = {
  title: string
  children: ReactNode
}

export function InfoModal({title, children}: InfoModalProps) {
  const router = useRouter();
  const dialogRef = useRef<ElementRef<'dialog'>>(null);

  useEffect(() => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal();
    }
  }, []);

  function onDismiss() {
    router.back();
  }

  return createPortal(
    <div className={s.modalLayout}>
      <dialog ref={dialogRef} className={s.modal} onClose={onDismiss}>
        <h3 className={s.title}>
          {title}
        </h3>
        <div className={s.content}>
          {children}
        </div>
      </dialog>
    </div>,
    document.getElementById('modal-root')!
  )
}