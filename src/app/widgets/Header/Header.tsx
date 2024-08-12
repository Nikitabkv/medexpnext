import s from "./Header.module.scss"
import {Container} from "@/app/shared/ui/Container/Container"
import Image from "next/image";
import Link from "next/link";

const menu = [
  {
    title: 'Главная',
    href: ''
  },
  {
    title: 'Услуги и цены',
    href: ''
  },
  {
    title: 'Специалисты',
    href: '',
  },
  {
    title: 'Об услугах',
    href: '',
  },
  {
    title: 'Наши центры',
    href: '',
  },
  {
    title: 'Лаборатория',
    href: '',
  },
  {
    title: 'Вопрос-ответ',
    href: '',
  },
  {
    title: 'Отзывы',
    href: '',
  },
  {
    title: 'Статьи',
    href: '',
  },
  {
    title: 'Новости и акции',
    href: '',
  },
]
const activeIndex = 0
export const Header = () => {
  return (
    <header>
      <Container className={s.container}>
          <div>
            <Image src={'/logo.svg'} alt={'Лого'} width={200} height={20}/>
          </div>
          <div className={s.location}>
            <Image src={'/marker.svg'} alt={'Маркер'} width={14} height={17}/>
            <span>Воронеж</span>
          </div>
          <div/>
          <div className={s.contacts}>
            <b>8-800-333-0-800</b>
          </div>
          <Image src={'/atlas.svg'} alt={'Атлас Пациента'} width={220} height={50}/>
      </Container>
      <div className={s.menu}>
        <Container className={s.container}>
          {menu.map((menu, index) => (
            <Link
              className={index === activeIndex ? s.active : ''}
              href={menu.href}
              key={menu.title}
            >
              {menu.title}
            </Link>
          ))}
        </Container>
      </div>
    </header>
  )
}