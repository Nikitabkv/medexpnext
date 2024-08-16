"use client"
import s from "@/widgets/Menu/Menu.module.scss"
import {Container} from "@/shared/ui/Container/Container"
import Link from "next/link"
import {usePathname} from "next/navigation";
import {useState} from "react";

const menu = [
  {
    title: 'Главная',
    href: '/'
  },
  {
    title: 'Услуги и цены',
    href: '/price'
  },
  {
    title: 'Специалисты',
    href: '/specialists',
  },
  {
    title: 'Об услугах',
    href: '/about_services',
  },
  {
    title: 'Наши центры',
    href: '/med_points',
  },
  {
    title: 'Лаборатория',
    href: '/laboratory',
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
    href: '/articles',
  },
  {
    title: 'Новости и акции',
    href: '/news',
  },
]

export const Menu = ({menuIsOpen = false}) => {
  const pathname = usePathname()

  return (
    <div className={s.menu} style={{display: menuIsOpen ? 'block' : 'none'}}>
      <Container className={s.container}>
        {menu.map((menu) => (
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