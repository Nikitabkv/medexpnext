import s from './Title.module.scss'
import { FC } from "react";
import Image from "next/image";

interface Props {
  Tag: any
  text: string
  className?: string
  imgLink: string
  imgWidth?: number
  imgHeight?: number
}

export const TitleWithIcon: FC<Props> = ({ Tag, text, className, imgLink, imgWidth = 20, imgHeight = 20}) => {
  return (
    <div className={s.row}>
      <Tag className={className}>
        <span>
          {text}
        </span>
      </Tag>
      <Image src={imgLink} alt={'icon'} width={imgWidth} height={imgHeight}/>
    </div>
  )
};