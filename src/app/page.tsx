import Image from "next/image"
import s from "./page.module.scss"
import {Carousel} from "@/app/widgets/Slider/Slider"
import {TitleWithIcon} from "@/app/shared/ui/Title/Title"
import {Container} from "@/app/shared/ui/Container/Container";

export default function Home() {
  return (
    <div className={s.main}>

      <Carousel/>

      <div>
        <TitleWithIcon imgLink={'./link.svg'} imgWidth={20} imgHeight={20} text={'Акции'} Tag={'h2'} />
        <div>Тут акции</div>
      </div>

      <div>
        <TitleWithIcon imgLink={'./link.svg'} imgWidth={20} imgHeight={20} text={'Новости'} Tag={'h2'} />
        <div>Тут новости</div>
      </div>

      <Container className={s.presentations}>
          <div className={s.presentationsItem}>
            <TitleWithIcon imgLink={'./link.svg'} imgWidth={20} imgHeight={20} text={'Презентация компании'} Tag={'h2'}/>
            <div>Тут компании</div>
          </div>
          <div className={s.presentationsItem}>
            <TitleWithIcon imgLink={'./link.svg'} imgWidth={20} imgHeight={20} text={'Презентация Центра телемедицины'} Tag={'h2'}/>
            <div>Тут телемедицины</div>
          </div>
          <div className={s.presentationsItem}>
            <TitleWithIcon imgLink={'./link.svg'} imgWidth={20} imgHeight={20} text={'Презентация лабораторного комплекса'} Tag={'h2'}/>
            <div>Тут лаборатория</div>
          </div>
          <div className={s.presentationsItem}>
            <TitleWithIcon imgLink={'./link.svg'} imgWidth={20} imgHeight={20} text={'Лабораторный комплекс online'} Tag={'h2'}/>
            <div>Тут тут онлайн комплек</div>
          </div>
      </Container>

    </div>
  );
}
