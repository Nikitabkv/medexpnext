import Image from "next/image"
import s from "./page.module.scss"
import {Carousel} from "@/app/widgets/Slider/Slider"
import {TitleWithIcon} from "@/app/shared/ui/Title/Title"
import {Container} from "@/app/shared/ui/Container/Container";

export default function Home() {
  return (
    <div className={s.main}>

      <Carousel/>
      <div className={s.underSliderWrapper}>
        <Container className={s.underSlider}>
          <div className={s.underSliderItem}>
            <Image src={'/infoIcons/microscope.svg'} alt={'microscope'} width={50} height={50}/>
            <span className={s.underSliderText}>
            Современное оборудование от ведущих мировых производителей
          </span>
          </div>

          <div className={s.divider}/>

          <div className={s.underSliderItem}>
            <Image src={'/infoIcons/shield-with-text.svg'} alt={'shield-with-text'} width={50} height={50}/>
            <span className={s.underSliderText}>
            Высокий уровень профессионализма специалистов
          </span>
          </div>

          <div className={s.divider}/>

          <div className={s.underSliderItem}>
            <Image src={'/infoIcons/clock.svg'} alt={'clock'} width={50} height={50}/>
            <span className={s.underSliderText}>
            Отсутствие очередей и запись на прием в удобное для вас время
          </span>
          </div>

          <div className={s.divider}/>

          <div className={s.underSliderItem}>
            <Image src={'/infoIcons/dc.svg'} alt={'dc'} width={50} height={50}/>
            <span className={s.underSliderText}>
            Обследования осуществляются в комфортных условиях
          </span>
          </div>
        </Container>
      </div>

      <Container>
        <div>
          <TitleWithIcon imgLink={'./link.svg'} className={s.titles} imgWidth={20} imgHeight={20} text={'Акции'} Tag={'h2'} />
          <div className={s.saleCarousel}>
            <Image src={'/mockImages/sale1.png'} alt={'sale1'} width={640} height={224} sizes="100vw"
                   style={{
                     maxWidth: 640,
                     width: '100%',
                     height: 'auto',
                   }}/>
            <Image src={'/mockImages/sale2.png'} alt={'sale2'} width={640} height={224} sizes="100vw"
                   style={{
                     maxWidth: 640,
                     width: '100%',
                     height: 'auto',
                   }}/>
          </div>
        </div>
        <div>
          <TitleWithIcon imgLink={'./link.svg'} className={s.titles} imgWidth={20} imgHeight={20} text={'Новости'}
                         Tag={'h2'}/>
          <div className={s.lastNews}>
            <div className={s.newsItem}>
              <Image src={'/mockImages/news1.png'} alt={'news1'} width={1280} height={448} sizes="100vw"
                     style={{
                       width: '100%',
                       height: 'auto',
                     }}/>
              <div className={s.newsDescription}>
                <h3>
                  Полная диагностика организма
                </h3>
                <div className={s.moreNews}>
                  <span>18 апреля 2024</span>
                  <button>Подробнее</button>
                </div>
              </div>
            </div>
            <div className={s.newsItem}>
              <Image src={'/mockImages/news2.png'} alt={'news2'} width={1280} height={448} sizes="100vw"
                     style={{
                       width: '100%',
                       height: 'auto',
                     }}/>
              <div className={s.newsDescription}>
                <h3>
                  Компьютерная томография, Рентгенография
                </h3>
                <div className={s.moreNews}>
                  <span>27 февраля 2024</span>
                  <button>Подробнее</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <Container className={s.presentations}>
        <div className={s.presentationRow}>
          <div className={s.presentationsItem}>
            <TitleWithIcon imgLink={'./link.svg'} className={s.titles} imgWidth={20} imgHeight={20}
                           text={'Презентация компании'} Tag={'h2'}/>
            <div>
              <iframe src={'https://www.youtube.com/embed/b9rZggYrzCo?rel=0'} height={370} width={'100%'}/>
            </div>
          </div>
          <div className={s.presentationsItem}>
            <TitleWithIcon imgLink={'./link.svg'} className={s.titles} imgWidth={20} imgHeight={20}
                           text={'Презентация Центра телемедицины'} Tag={'h2'}/>
            <div>
              <iframe src={'https://www.youtube.com/embed/vEZkpNTtVfU?rel=0'} height={370} width={'100%'}/>
            </div>
          </div>
        </div>

        <div className={s.presentationRow}>
          <div className={s.presentationsItem}>
            <TitleWithIcon imgLink={'./link.svg'} className={s.titles} imgWidth={20} imgHeight={20}
                           text={'Презентация лабораторного комплекса'} Tag={'h2'}/>
            <div>
              <Image src={'/laboratory.png'} alt={'Лаборатория'} width={640} height={224} sizes="100vw"
                     style={{
                       width: '100%',
                       height: 'auto',
                     }}/>
            </div>
          </div>
          <div className={s.presentationsItem}>
            <TitleWithIcon imgLink={'./link.svg'} className={s.titles} imgWidth={20} imgHeight={20}
                           text={'Лабораторный комплекс online'} Tag={'h2'}/>
            <div>
              <img
                height={370} width={'100%'}
                src={'https://ipcam2.numedy.com/zm/cgi-bin/nph-zms?scale=%60100%60&mode=' +
                  'single&maxfps=15&monitor=101&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.' +
                  'eyJpc3MiOiJab25lTWluZGVyIiwiaWF0IjoxNzIzNTM1OTQxLCJleHAiOjE3MjM1NDMxNDEsInVz' +
                  'ZXIiOiJtZWRleHNpdGUiLCJ0eXBlIjoiYWNjZXNzIn0.o-7yKfubWyyCynaIbZ4EkUGgnxnF3pcnV-0a48T6e1A'}
                alt={'Камера лаборатории'}/>
            </div>
          </div>
        </div>
      </Container>

      <Container className={s.gallery}>
        <h2>
          Фотогалерея
        </h2>
        <div>
          <Image src={'/gallery/img1.png'} alt={'Фото'} width={310} height={278}/>
          <Image src={'/gallery/img2.png'} alt={'Фото'} width={310} height={278}/>
          <Image src={'/gallery/img3.png'} alt={'Фото'} width={310} height={278}/>
          <Image src={'/gallery/img4.png'} alt={'Фото'} width={310} height={278}/>
        </div>
      </Container>

      <Container className={s.reviews}>
        <h2>
          Фотогалерея
        </h2>

        <div className={s.row}>
          <div className={s.review}>
            <div className={s.reviewHead}>
              <div>
                <b>Анна</b>
                <span>* * * * *</span>
              </div>
              <div className={s.date}>
                <span>09 Августа 2024  19:53</span>
              </div>
            </div>

            <div>
              <p>
                Хотим выразить огромную благодарность Алексанян Жанне! Настоящий профессионал своего дела.
                Часто сдаем анализы ребенку 2 года,только Жанна смогла найти подход к ребенку. Большое спасибо!
              </p>
            </div>

            <button>
              Подробнее
            </button>
          </div>

          <div className={s.review}>
            <div className={s.reviewHead}>
              <div>
                <b>Анна</b>
                <span>* * * * *</span>
              </div>
              <div className={s.date}>
                <span>09 Августа 2024  19:53</span>
              </div>
            </div>

            <div>
              <p>
                Хотим выразить огромную благодарность Алексанян Жанне! Настоящий профессионал своего дела.
                Часто сдаем анализы ребенку 2 года,только Жанна смогла найти подход к ребенку. Большое спасибо!
              </p>
            </div>

            <button>
              Подробнее
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
}
