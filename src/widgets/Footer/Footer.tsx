import s from './Footer.module.scss'
import {Container} from "@/shared/ui/Container/Container"
import Image from "next/image";

export const Footer = () => {
  return (
    <footer className={s.footer}>
      <div className={s.popupsWrapper}>
        <Container className={s.popups}>
          <div className={s.infoPopupButton}>
            <Image src={'/footerIcons/info.svg'} alt={'logo'} width={24} height={24}/>
            <span>Информация о юридических лицах</span>
          </div>

          <div className={s.infoPopupButton}>
            <Image src={'/footerIcons/lock.svg'} alt={'logo'} width={24} height={24}/>
            <span>Политика конфиденциальности</span>
          </div>

          <div className={s.infoPopupButton}>
            <Image src={'/footerIcons/contract.svg'} alt={'logo'} width={24} height={24}/>
            <span>Договор на оказание платных медицинских услуг</span>
          </div>

          <div className={s.infoPopupButton}>
            <Image src={'/footerIcons/scales.svg'} alt={'logo'} width={24} height={24}/>
            <span>Законы и нормативные акты</span>
          </div>

          <div className={s.infoPopupButton}>
            <Image src={'/footerIcons/hands.svg'} alt={'logo'} width={24} height={24}/>
            <span>Политика в области прав человека</span>
          </div>
          <div className={s.organsPopupButton}>
            <Image src={'/footerIcons/organs.png'} alt={'logo'} width={146} height={54}/>
            <span>Контролирующие органы</span>
          </div>
        </Container>
      </div>
      {/*<div className={s.infoWrapper}>*/}
      {/*  <Container className={s.info}>*/}
      {/*    <div>*/}
      {/*      © {new Date().getFullYear()} «МедЭксперт»*/}
      {/*    </div>*/}
      {/*    <div>*/}
      {/*      <a href={'tel:88003330800'}>8-800-333-0-800</a>*/}
      {/*    </div>*/}
      {/*    <div className={s.mail}>*/}
      {/*      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 10" width={14} height={14}>*/}
      {/*        <path fill="#FFF" d="M1.344 3.082c.177.114.711.451 1.601 1.012.891.561 1.573.993 2.047 1.296.052.033.163.105.332.217.169.111.31.201.422.27.112.069.247.146.406.231.159.085.309.149.449.192.141.043.271.064.391.064h.016c.12 0 .25-.021.391-.064a2.52 2.52 0 0 0 .449-.192c.159-.085.294-.162.406-.231.112-.069.253-.159.422-.27l.332-.217 3.656-2.309c.38-.241.698-.533.953-.874.255-.34.383-.697.383-1.072 0-.313-.124-.58-.371-.803a1.267 1.267 0 0 0-.879-.334H1.25c-.401 0-.71.123-.926.369C.108.614 0 .922 0 1.292c0 .298.143.622.43.97.286.347.591.621.914.82z"/>*/}
      {/*        <path fill="#FFF" d="M13.219 3.842a159.312 159.312 0 0 0-3.891 2.451c-.297.199-.538.354-.722.465a4.61 4.61 0 0 1-.739.341 2.443 2.443 0 0 1-.859.174h-.016c-.266 0-.552-.058-.859-.174a4.61 4.61 0 0 1-.739-.341 18.913 18.913 0 0 1-.722-.465C3.969 5.824 2.674 5.007.789 3.842A4.055 4.055 0 0 1 0 3.224v5.64c0 .313.122.58.367.803.245.223.539.334.883.334h11.5c.344 0 .638-.111.883-.334.245-.223.367-.49.367-.803v-5.64a4.238 4.238 0 0 1-.781.618z"/>*/}
      {/*      </svg>*/}
      {/*      <a href={'mailto:med@med-exp.ru'}>Написать письмо</a>*/}
      {/*    </div>*/}
      {/*    <div className={s.socialMedia}>*/}
      {/*      <Image src={'/footerIcons/vk.svg'} alt={'logo'} width={16} height={16}/>*/}
      {/*      <Image src={'/footerIcons/youtube.svg'} alt={'logo'} width={16} height={16}/>*/}
      {/*      <Image src={'/footerIcons/odnoklassniki.svg'} alt={'logo'} width={16} height={16}/>*/}
      {/*      <Image src={'/footerIcons/telegram.svg'} alt={'logo'} width={16} height={16}/>*/}
      {/*    </div>*/}
      {/*    <div className={s.warning}>*/}
      {/*      Информация, включая цены, предоставлена для ознакомления и не является публичной офертой (ст. 435 ГК РФ, cт.*/}
      {/*      437 ГК РФ ).*/}
      {/*    </div>*/}
      {/*    <div>*/}
      {/*      <button>*/}
      {/*        Фрайчайзинг*/}
      {/*      </button>*/}
      {/*    </div>*/}
      {/*  </Container>*/}
      {/*</div>*/}
    </footer>
  )
}