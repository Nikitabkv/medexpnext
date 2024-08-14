import Image from "next/image"
import s from './Doctor.module.scss'

export const Doctor = () => {
  return (
    <div className={s.doctor}>
      <div className={s.imageWrapper}>
        <Image src={'/doctor.png'} alt={'Врач'} width={138} height={207}/>
      </div>
      <div className={s.infoWrapper}>
        <div className={s.name}>Фамилия <br/> Имя отчество</div>
        <div className={s.role}>Врач-офтальмолог высшей категории</div>
      </div>
    </div>
  )
}