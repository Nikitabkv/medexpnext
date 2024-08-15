import s from './page.module.scss'
import {Container} from "@/shared/ui/Container/Container"
import Image from "next/image"

const articles = [
  {
    id: 1,
    image: '',
    name: 'УЗИ беременных. Сроки проведения скринингов',
  },
  {
    id: 2,
    image: '',
    name: 'Ведение беременности',
  },
  {
    id: 3,
    image: '',
    name: 'Комплексная диагностика здоровья взрослых',
  },
  {
    id: 4,
    image: '',
    name: 'Комплексная диагностика здоровья детей',
  },
  {
    id: 5,
    image: '',
    name: 'Комплексная диагностика здоровья взрослых',
  },
  {
    id: 6,
    image: '',
    name: 'Комплексная диагностика здоровья детей',
  },
  {
    id: 7,
    image: '',
    name: 'Комплексная диагностика здоровья взрослых',
  },
  {
    id: 8,
    image: '',
    name: 'Комплексная диагностика здоровья детей',
  },
  {
    id: 9,
    image: '',
    name: 'Комплексная диагностика здоровья детей',
  },
]

export default function ArticlesPage() {
  return (
    <Container className={s.container}>
      {articles.map((article) => (
        <div className={s.article} key={article.id}>
          <div className={s.content}>
            <Image src={'/laboratory.png'} alt={article.name} width={600} height={350} style={{
              objectFit: 'cover',
              width: '100%',
            }}/>
            <button>
              <Image src={'/buttons/book.svg'} alt={'Книга'} width={25} height={25}/>
              Читать
            </button>
          </div>
          <div className={s.description}>
            <span>{article.name}</span>
            <button>Скачать PDF</button>
          </div>
        </div>
      ))}
    </Container>
  )
}