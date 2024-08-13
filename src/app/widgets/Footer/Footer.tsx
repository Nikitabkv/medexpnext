import s from './Footer.module.scss'
import {Container} from "@/app/shared/ui/Container/Container"
import Image from "next/image";

export const Footer = () => {
  return (
    <footer className={s.footer}>
      <div className={s.popupsWrapper}>
        <Container className={s.popups}>
          <div className={s.infoPopupButton}>
            <Image src={'/footerIcons/info.svg'} alt={'logo'} width={24} height={24}/>
            <span>
          Информация о юридических лицах
          </span>
          </div>

          <div className={s.infoPopupButton}>
            <Image src={'/footerIcons/info.svg'} alt={'logo'} width={24} height={24}/>
            <span>
          Политика конфиденциальности
          </span>
          </div>

          <div className={s.infoPopupButton}>
            <Image src={'/footerIcons/info.svg'} alt={'logo'} width={24} height={24}/>
            <span>
          Договор на оказание платных медицинских услуг
          </span>
          </div>

          <div className={s.infoPopupButton}>
            <Image src={'/footerIcons/info.svg'} alt={'logo'} width={24} height={24}/>
            <span>
          Законы и нормативные акты
          </span>
          </div>

          <div className={s.infoPopupButton}>
            <Image src={'/footerIcons/info.svg'} alt={'logo'} width={24} height={24}/>
            <span>
          Политика в области прав человека
          </span>
          </div>
        </Container>
      </div>
      <div className={s.infoWrapper}>
        <Container className={s.info}>
          вторая линия
        </Container>
      </div>
    </footer>
)
}