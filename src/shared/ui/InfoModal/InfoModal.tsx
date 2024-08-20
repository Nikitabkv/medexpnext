import s from './InfoModal.module.css'
import {FC, ReactNode} from "react"

type InfoModalProps = {
  title: string
  children: ReactNode
}

export const InfoModal:FC<InfoModalProps> = ({title, children}) => {
  return (
    <div className={s.modalLayout}>
      <div className={s.modal}>
        <h3 className={s.title}>
          {title}
        </h3>
        <div className={s.content}>
          {children}
        </div>
      </div>
    </div>
  )
}