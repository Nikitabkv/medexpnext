import s from "./Container.module.scss"
import {FC, PropsWithChildren} from "react"

interface Props {
  className?: string
}

export const Container:FC<PropsWithChildren<Props>> = ({children, className}) => {
  return (
    <div className={`${className ? className : ''} ${s.container}`}>
      {children}
    </div>
  )
}
