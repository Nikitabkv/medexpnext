import s from './page.module.scss'
import {Container} from "@/shared/ui/Container/Container"
import Image from "next/image";

const reviews = [
  {
    id: 1,
    name: 'Анна',
    rating: 5,
    date: '09 Августа 2024    19:53',
    text: 'Хотим выразить огромную благодарность Алексанян Жанне! Настоящий профессионал своего дела.\nЧасто сдаем анализы ребенку 2 года,только Жанна смогла найти подход к ребенку. Большое спасибо!',
    answer: 'Добрый день. Благодарим вас за отзыв и тёплые слова. Для нас очень важно, чтобы каждому пациенту была оказана необходимая помощь. Всего вам наилучшего, будьте здоровы!'
  },
  {
    id: 2,
    name: 'Татьяна Александровна Зацепина',
    rating: 5,
    date: '08 Августа 2024    11:50',
    text: 'Хочу выразить благодарность клинике и врачу гинекологу Кантур Татьяне Юрьевне. Были на приемах и я и моя мама. Обследования и УЗИ прошли на высшем уровне. Желаю вашей клинике побольше таких докторов.',
    answer: 'Добрый день. Благодарим вас за отзыв и внимание к нашей работе. Мы делаем всё возможное, чтобы каждый пациент оставался доволен на все 100%. Желаем прекрасного самочувствия!'
  },
  {
    id: 3,
    name: 'Марина Алексеевна Харченко',
    rating: 1,
    date: '05 Августа 2024    10:31',
    text: 'Уже который раз я прихожу к Мурзиновой Ирине Геннадьевне и сижу ее жду. Почему если я записана на конкретное время я должна сидеть и ждать. Только с этим врачом в этом мед.центре такая история.',
    answer: 'Добрый день. Спасибо, что написали. Приносим свои извинения за доставленные неудобства. Будем над этим работать, чтобы не оставлять плохих впечатлений от приёма у пациентов.'
  },
  {
    id: 4,
    name: 'Фатима',
    rating: 5,
    date: '04 Августа 2024    22:25',
    text: 'Была на узи у врача Фариды Гаджиевной. Очень грамотный и внимательный врач, все объяснила ,показала, осталась очень довольна. Записала маму тоже на узи. Клиника новая ,очень чисто ,новейшие технологии. Обслуживание на высшем уровне. Всем рекомендую. Теперь Фарида Гаджиевна наш семейный врач.',
    answer: 'Здравствуйте! Спасибо, благодарность пациентов – лучшая награда для нас. Уверены, что ваш отзыв направит других пациентов в нашу клинику за качественными услугами. Желаем здоровья и отличного настроения!'
  },
  {
    id: 5,
    name: 'Владимир',
    rating: 1,
    date: '25 Июля 2024    13:43',
    text: 'В 21 веке айтишников как блох у собаки. Выгоните своего разработчика сайта мести метлой на улицу. Записался к кардиологу.Хочу оплатить заказ. И ??? Куар код не считывается, вернуться к другому способу оплаты я не могу, т. идет возврат на главную страницу. Заказ я должен оплатить в течение 30 мин. Найдите нормального сотрудника !\n' +
      '\n',
    answer: 'Добрый день. В нашем приложении "Атлас пациента" https://atlas-patient.ru/ пока не реализована возможность оплаты, также нет QR-кода для ее проведения и сроков по оплате заказа. В приложении вы видите дату, время приема, адрес ДЦ и ФИО врача, к которому вы записались. Оплата производится только на ресепшен в диагностическом центре. Возможно вы воспользовались приложением другой клиники.'
  }
]

export default function FeedbackPage() {
  return (
      <Container className={s.container}>
        {reviews.map((el) => (
          <div className={s.reviewWrapper} key={el.id}>
            <div className={s.author}>
              <div>
                <b>{el.name}</b>
                <span className={s.stars}>
                  {Array(el.rating).fill('★').join('')}
                  <span className={s.sadStars}>{Array(5 - el.rating).fill('★').join('')}</span>
                </span>
              </div>
              <span className={s.date}>{el.date}</span>
            </div>
            <p className={s.review}>
              {el.text}
            </p>
            <hr/>
            <div className={s.answer}>
              <Image src={'/logo.svg'} alt={'МедЭксперт'} width={116} height={12}/>
              <p>{el.answer}</p>
            </div>
          </div>
        ))}

        <div className={s.pagination}>
          <span className={s.paginationItem}>1</span>
          <span className={s.paginationItem}>2</span>
          <span className={s.paginationItem + ' ' +s.active}>3</span>
          <span className={s.paginationItem}>4</span>
          <span className={s.paginationItem}>5</span>
          <span>...</span>
          <span className={s.paginationItem}>10</span>
        </div>

        <div className={s.formWrapper}>
          <span className={s.title}>Добавить отзыв</span>
          <form>
            <div className={s.name}>
              <input type="text" placeholder="Имя*"/>
            </div>

            <div className={s.phoneEmail}>
              <input type="phone" placeholder="Телефон*"/>
              <input type="email" placeholder="E-mail"/>
            </div>

            <div>
              <input type="text" placeholder="Комментарий*"/>
            </div>

            <div className={s.rating}>
              <div>
                <span>Оцените нас по пятибалльной шкале</span>
                <div className={s.radioGroup}>
                  <label htmlFor={'radio1'}>★</label>
                  <input type="radio" id={'radio1'} name="rating" value="1"/>
                  <label htmlFor={'radio2'}>★</label>
                  <input type="radio" id={'radio2'} name="rating" value="2"/>
                  <label htmlFor={'radio3'}>★</label>
                  <input type="radio" id={'radio3'} name="rating" value="3"/>
                  <label htmlFor={'radio4'}>★</label>
                  <input type="radio" id={'radio4'} name="rating" value="4"/>
                  <label htmlFor={'radio5'}>★</label>
                  <input type="radio" id={'radio5'} name="rating" value="5"/>
                </div>
              </div>
              <button>Отправить</button>
            </div>
          </form>
        </div>
      </Container>
  )
}