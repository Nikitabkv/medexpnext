import s from "./Header.module.scss"
import {Container} from "@/shared/ui/Container/Container"
import Image from "next/image"
import {Menu} from "@/widgets/Menu/Menu";

export const Header = () => {

  return (
    <header className={s.header} >
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
      <Menu />
    </header>
  )
}