import s from './ServiceDescription.module.scss'
import Image from "next/image"
import {FC} from "react"

type Service = {
  service : {
    imgPath: string
    description: {
      title: string
      text: string
    }[]
  }
}

export const ServiceDescription:FC<Service> = ({service}) => {

  return (
    <div className={s.serviceWrapper}>
      <Image src={service.imgPath} alt={'Обложка'} width={1000} height={479}/>
      <div className={s.serviceDescription}>
        {service.description.map((el, index) => (
          <p key={index}><strong>{el.title}</strong> {el.text}</p>
        ))}
      </div>
    </div>
  )
}
