import s from './page.module.scss'
import {Container} from "@/shared/ui/Container/Container"
import Image from "next/image"

const que = [
  {
    id: 1,
    question: 'При записи на Консультацию врача-специалиста в каких случаях дополнительно нужен Осмотр врача-специалиста?',
    answer: 'При записи на Консультацию врача-специалиста рекомендуется дополнительно выбрать Осмотр врача-специалиста, если Вы впервые посещаете данного специалиста, у Вас есть жалобы на самочувствие или Вы хотите посетить врача в целях профилактики развития заболеваний. Если Вам необходимо повторно посетить специалиста с результатами назначенных им исследований или просто проконсультироваться, Вы можете записаться только на Консультацию. При необходимости врач сам добавит Осмотр к основной услуге.\n'
  },
  {
    id: 2,
    question: 'Как узнать болел ли я инфекцией COVID-19, оценить уровень антител после болезни или вакцинации, а также определить необходимость вакцинации?\n',
    answer: '«Концентрация антител к S белку коронавируса SARS-CoV-2/COVID-19/IgG + IgМ» - определяет уровень антител к коронавирусу (в BAU/мл) и необходимость вакцинации. «Концентрация антител к коронавирусу SARS-CoV-2/COVID-19/IgG» определяет уровень иммунитета после болезни или вакцинации (в BAU/мл). Рекомендуется выполнять не ранее чем через 42 дня после первого этапа вакцинации или начала болезни. «Антитела к коронавирусу SARS-CoV-2 /COVID-19/IgG» - показывает наличие иммунитета к коронавирусу, без определения уровня антител (индекс позитивности).'
  },
  {
    id: 3,
    question: 'Как войти в личный кабинет, передо мной чек, какие данные вводить?',
    answer: 'При оплате исследований Вам выдавали два чека. Один чек с информацией об оплате исследований, а второй (короткий) дополнительный чек с учетными данными для входа в личный кабинет. Данные на чеке: PID - это логин для входа, PASS - это пароль для входа. Вы заходите на сайт med-exp.ru. Справа на главной странице сайта есть "вход в личный кабинет", после нажатия на эту кнопку появится новое окно, где нужно будет ввести PID и PASS. Как только Вы введете учетные данные, Вы сможете просмотреть свои результаты.'
  },
  {
    id: 4,
    question: 'Что делать, если потерян чек и забыт пароль для входа в личный кабинет?',
    answer: 'Получить новые данные для входа в Личный кабинет Вы сможете только при личном посещении любого из наших подразделений, во избежание получения Ваших данных третьими лицами. Необходимо будет предъявить паспорт, права или иной документ, удостоверяющий личность, с Вашей фотографией.\n'
  },
  {
    id: 5,
    question: 'Как долго хранятся данные в личном кабинете?',
    answer: 'Данные в личном кабинете хранятся бессрочно.'
  },
  {
    id: 6,
    question: 'Можно ли данные для входа в личный кабинет прислать по e-mail или озвучить по телефону?',
    answer: 'Прислать Вам учетные данные по e-mail или озвучить по телефону не предоставляется возможным, потому что в целях защиты от подбора паролей, пароль формируется на ресепшн любого нашего подразделения при личном посещении.\n'
  },
  {
    id: 7,
    question: 'Может ли получить результаты родственник или кто-то еще?',
    answer: 'Выдача результатов на ресепшн производится при предъявлении чека. При отсутствии чека Вам необходимо будет предъявить паспорт, права или иной документ, удостоверяющий личность, с Вашей фотографией.'
  },
  {
    id: 8,
    question: 'Можно ли у вас сделать рентген с гипсовой повязкой или полимерным лонгетом?',
    answer: 'Да, можно. Но стоит учесть, что при рентгенологическом исследовании на снимках могут появляться тени от гипсовой повязки или полимерного лонгета, из-за чего врач-рентгенолог не всегда может в полной мере оценить степень сращения костной ткани.\n'
  },
  {
    id: 9,
    question: 'Можно ли сделать МРТ или КТ турецкого седла?',
    answer: 'Да, можно. В исследования МРТ и КТ Гипофиза входит описание турецкого седла.'
  },
  {
    id: 10,
    question: 'Можно ли у вас пройти Эхокардиографию или ЭхоКГ?',
    answer: 'Да, можно. УЗИ Сердца — это и есть Эхокардиография или ЭхоКГ'
  },
  {
    id: 11,
    question: 'Можно ли у вас пройти УЗДС или УЗДГ?',
    answer: 'Да, можно. УЗИ сосудов конечностей — это и есть УЗДС (ультразвуковое дуплексное сканирование) или УЗДГ (ультразвуковая допплерография).'
  },
  {
    id: 12,
    question: 'На каких сроках беременности нужно проводить исследование кровотока плода?',
    answer: 'Исследование кровотока плода проводится на 22-24 и 30-34 неделях беременности.'
  },
  {
    id: 13,
    question: 'Ведут ли в ваших филиалах обменные карты беременных?',
    answer: 'Обменные карты беременных в наших филиалах не ведутся и не заполняются.'
  },
  {
    id: 14,
    question: 'Откуда берут кровь у грудных детей?',
    answer: 'У грудных детей кровь берут из вен головы, пятки или вен локтевого сгиба. Место определяет медсестра после визуального осмотра.'
  }
]

export default function QuestionsPage() {
  return (
    <Container className={s.container}>
      {
        que.map((el) => (
          <>
            <div className={s.questionWrapper} key={el.id}>
              <div className={s.question}>
                <Image src={'/infoIcons/question.svg'} alt={'Вопрос'} width={20} height={20}/>
                <span>
                  {el.question}
                </span>
              </div>
              <div className={s.answer}>
                <Image src={'/infoIcons/answer.svg'} alt={'Ответ'} width={20} height={20}/>
                <span>
                  {el.answer}
                </span>
              </div>
            </div>
          </>
        ))
      }
    </Container>
  )
}