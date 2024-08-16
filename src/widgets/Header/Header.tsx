"use client"
import s from "./Header.module.scss"
import {Container} from "@/shared/ui/Container/Container"
import Image from "next/image"
import {Menu} from "@/widgets/Menu/Menu"
import {useState} from "react"

export const Header = () => {
  const [menuIsOpen, setMenuIsOpen] = useState(false)

  return (
    <header className={s.header} >
      <Container className={s.container}>
        <div className={s.logo}>
          <div className={s.mobileMenuButton} onClick={() => setMenuIsOpen((prev) => !prev)}>
            <input className={s.checkbox} type="checkbox" name="" id=""/>
            <div className={s.hamburgerLines}>
              <span className={s.line + ' ' + s.line1}></span>
              <span className={s.line + ' ' + s.line2}></span>
              <span className={s.line + ' ' + s.line3}></span>
            </div>
          </div>
          <Image className={s.img} src={'/logo.svg'} alt={'Лого'} width={200} height={20}/>
          <Image className={s.smallImg} src={'/smallLogo.svg'} alt={'Лого'} width={26} height={26}/>
        </div>
        <div className={s.location}>
          <Image src={'/marker.svg'} alt={'Маркер'} width={14} height={17}/>
          <span>Воронеж</span>
        </div>
        <div/>
        <div className={s.contacts}>
          <b>8-800-333-0-800</b>
        </div>
        <div className={s.rightButtons}>
          <button className={s.atlasButton}>
            <Image className={s.atlasDesktop} src={'/atlas.svg'} alt={'Атлас Пациента'} width={220} height={50}/>
            <Image className={s.atlasMobile} src={'/atlasMobile.svg'} alt={'Атлас Пациента'} width={170} height={50}/>
          </button>
          <button className={s.call}>
            <Image src={'/buttons/call.svg'} alt={'Телефон'} width={50} height={50}/>
          </button>
        </div>
      </Container>
      <Menu menuIsOpen={menuIsOpen}/>
    </header>
  )
}