"use client"
import s from "./ServicesAside.module.scss"
import Image from "next/image"
import Link from "next/link"
import {usePathname} from "next/navigation"

const services = [
  {
    id: 1,
    name: 'Магнитно-резонансная\nтомография (МРТ)',
    icon: '/servicesIcons/mrt.png',
    path: 'mrt'
  },
  {
    id: 2,
    name: 'Компьютерная\nтомография (КТ)',
    icon: '/servicesIcons/kt.png',
    path: 'kt'
  },
  {
    id: 3,
    name: 'Рентгенография\n(Рентген)',
    icon: '/servicesIcons/xray.png',
    path: 'rentgen'
  },
  {
    id: 4,
    name: 'Ультразвуковые\nисследования (УЗИ)',
    icon: '/servicesIcons/uzi.png',
    path: 'uzi'
  },
  {
    id: 5,
    name: 'Функциональная\nдиагностика (ФД)',
    icon: '/servicesIcons/fd.png',
    path: 'fd'
  },
  {
    id: 6,
    name: 'Консультации и\nманипуляции',
    icon: '/servicesIcons/consultations.png',
    path: 'km'
  },
  {
    id: 7,
    name: 'Косметология',
    icon: '/servicesIcons/cosmetology.png',
    path: 'cosmetology'
  },
  {
    id: 8,
    name: 'Реабилитация',
    icon: '/servicesIcons/rehabilitation.png',
    path: 'rehabilitation'
  },
  {
    id: 9,
    name: 'Услуги\nдополнительные',
    icon: '/servicesIcons/additionalServices.png',
    path: 'dop_serv'
  },
  {
    id: 10,
    name: 'Лабораторная\nдиагностика',
    icon: '/servicesIcons/laboratory.png',
    path: 'lab'
  }
]

export const ServicesAside = () => {
  const pathname = usePathname()

  return (
    <aside className={s.priceGroups}>
      <div className={s.header}>
        <button>
          <Image src={'/buttons/burger.svg'} alt={'Меню'} width={35} height={25}/>
        </button>
        <div>
          Виды услуг
        </div>
      </div>
      <div className={s.priceGroupItems}>
        {services.map((service) => (
          <Link href={service.path} key={service.id} className={s.serviceItem + ' ' + (`/about_services/${service.path}` === pathname ? s.active : '')}>
            <div>
              <Image src={service.icon} alt={service.name} width={35} height={35}/>
              <span className={s.serviceName}>{service.name}</span>
            </div>
          </Link>
        ))}
      </div>
      {/*<button className={s.atlasButton}>*/}
      {/*  <Image src={'/atlasVertLogo.svg'} alt={'Атлас пациента'} width={50} height={60}/>*/}
      {/*  <span>Записаться онлайн</span>*/}
      {/*</button>*/}
    </aside>
  )
}
