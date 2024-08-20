"use client"
import s from "@/widgets/Menu/Menu.module.scss"
import {Container} from "@/shared/ui/Container/Container"
import Link from "next/link"
import {usePathname} from "next/navigation";
import {useEffect, useState} from "react";

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

export const Menu = ({menuIsOpen = false, setMenuIsOpen = (e?: any) => {}}) => {
  const pathname = usePathname()

  useEffect(() => {
    if (menuIsOpen) {
      document.body.style.overflow = 'hidden'
      document.getElementsByTagName('main')[0].style.filter = 'blur(3px)'
    } else {
      document.body.style.overflow = 'unset'
      document.getElementsByTagName('main')[0].style.filter = 'unset'
    }

    const closeMenu = (e: any) => {
      if (!e.target.closest('.menu')) {
        setMenuIsOpen(false)
      }
    }

    document.addEventListener('click', closeMenu)

    return () => {
      document.body.style.overflow = 'unset'
      document.getElementsByTagName('main')[0].style.filter = 'unset'

      document.removeEventListener('click', closeMenu)
    }
  }, [menuIsOpen])

  return (
    <div className={s.menu + ' ' + (menuIsOpen ? '' : s.hidden)}>
      <Container className={s.container}>
        {menu.map((menu) => (
          <Link
            className={pathname === menu.href ? s.active : ''}
            href={menu.href}
            key={menu.title}
          >
            <span className={s.menuTitle + ' ' + (pathname === menu.href ? s.active : '')}>
              {menu.title}
            </span>
          </Link>
        ))}
      </Container>
    </div>
  )
}
