"use client"
import s from "@/widgets/Menu/Menu.module.scss"
import {Container} from "@/shared/ui/Container/Container"
import Link from "next/link"
import {usePathname} from "next/navigation";

const menu = [
  {
    title: 'Главная',
    href: '/'
  },
  {
    title: 'Услуги и цены',
    href: ''
  },
  {
    title: 'Специалисты',
    href: '/specialists',
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
    href: '/questions',
  },
  {
    title: 'Отзывы',
    href: '/feedback',
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

export const Menu = () => {
  const pathname = usePathname()

  return (
    <div className={s.menu}>
      <Container className={s.container}>
        {menu.map((menu, index) => (
          <Link
            className={pathname === menu.href ? s.active : ''}
            href={menu.href}
            key={menu.title}
          >
            {menu.title}
          </Link>
        ))}
      </Container>
    </div>
  )
}