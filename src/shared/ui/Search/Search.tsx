import {FC} from "react"
import s from './Search.module.scss'

interface Props {
  placeholder: string
  width?: string | number
  backgroundImgPath?: string
}

export const Search:FC<Props> = ({placeholder, width= 'auto', backgroundImgPath = '/infoIcons/search.svg'}) => {
  return (
    <>
      <input type="text" className={s.search} placeholder={placeholder} style={{width: width, backgroundImage: `url(${backgroundImgPath})`}}/>
    </>
  )
}