import s from './page.module.scss'
import {Container} from "@/shared/ui/Container/Container"
import Image from "next/image";

const stocks = [
  {
    id: 1,
    img: '/stocks/img.png',
    smallImg: '/stocks/img_1.png'
  },
  {
    id: 2,
    img: '/stocks/img.png',
    smallImg: '/stocks/img_1.png'
  },
  {
    id: 3,
    img: '/stocks/img.png',
    smallImg: '/stocks/img_1.png'
  },
  {
    id: 4,
    img: '/stocks/img.png',
    smallImg: '/stocks/img_1.png'
  }
]
const news = [
  {
    id: 1,
    title: 'Полная диагностика организма',
    text: 'Комплексная диагностика здоровья — это точная диагностика организма и экономия времени. В наших диагностических центрах доступен широкий спектр комплексной диагностики: МРТ, КТ, УЗИ, анализы, справки и медицинские комиссии со скидкой до 45%! Подробнее с вариантами комплексов и ценами можно ознакомиться на нашем сайте в разделе статьи — «Комплексная диагностика здоровья взрослых», а также по номеру горячей линии 8-800-333-0-800 или в ближайшем диагностическом центре.',
    image: '/stocks/img.png',
    date: '18 апреля 2024',
  },
  {
    id: 2,
    title: 'Компьютерная томография, Рентгенография',
    text: 'В диагностическом центре, расположенном по адресу: г. Воронеж., 9 Января ул., 233/35 теперь доступны рентгенологические исследования: Компьютерная томография и Рентгенография. Подробнее об услугах центра можно узнать по телефону: 8-800-333-0-800',
    image: '/stocks/img.png',
    date: '27 февраля 2024',
  },
  {
    id: 3,
    title: '',
    text: 'Теперь в диагностических центрах «МедЭксперт» есть возможность оформить больничный лист. Также, вызвав врача, вы можете получить больничный не выходя из дома.',
    image: '/stocks/img.png',
    date: '17 мая 2022',
  },
  {
    id: 4,
    title: 'Вызов врача',
    text: 'Теперь пациенты компании «МедЭксперт» могут получать медицинские услуги не выходя из дома. Врач приедет в любую точку города, осмотрит и проконсультирует, осуществит диагностику (ЭКГ, Холтер, СМАД), произведет забор биоматериала для лабораторных исследований, назначит лечение и предоставит лекарственные препараты, а также при необходимости оформит медицинские справки и выписки.',
    image: '/stocks/img.png',
    date: '08 июня 2020',
  },
]

export default function NewsPage() {
  return (
    <Container className={s.container}>
      <h2>Акции</h2>
      <div className={s.stocks}>
        {stocks.map((el) => (
          <picture key={el.id}>
            <source media="(min-width: 750px) and (max-width: 1279px)" srcSet={el.smallImg}/>
            <source media="(max-width: 550px)" srcSet={el.smallImg}/>
            <Image src={el.img} alt={'Акция'} width={640} height={224} sizes="100vw" className={s.bigImg}/>
          </picture>
        ))}
      </div>
      <h2>Новости</h2>
      {news.map((el) => (
        <div className={s.newsContainer} key={el.id}>
          <div className={s.newsImage}>
            <Image src={el.image} alt={el.title} width={640} height={224} sizes="100vw"/>
          </div>
          <div className={s.newsDescription}>
            {el.title && <h3>{el.title}</h3>}
            <p>{el.text}</p>
            <span className={s.date}>{el.date}</span>
          </div>
        </div>
      ))}
    </Container>
  )
}
