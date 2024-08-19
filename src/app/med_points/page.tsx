import s from './page.module.scss'
import {Container} from "@/shared/ui/Container/Container"
import Image from "next/image";
import {YaMap} from "@/widgets/YaMap/YaMap";
import {Carousel} from "@/widgets/Slider/Slider";

const dcs = [
  {
    id: 1,
    type: 'ДИАГНОСТИЧЕСКИЙ ЦЕНТР',
    address: 'г. Воронеж, Генерала Лизюкова ул., 25',
  },
  {
    id: 2,
    type: 'ДИАГНОСТИЧЕСКИЙ ЦЕНТР',
    address: 'г. Воронеж, Плехановская ул., 53',
  },
  {
    id: 1,
    type: 'ДИАГНОСТИЧЕСКИЙ ЦЕНТР',
    address: 'г. Воронеж, Генерала Лизюкова ул., 85',
  },
  {
    id: 1,
    type: 'ДИАГНОСТИЧЕСКИЙ ЦЕНТР',
    address: 'г. Воронеж, Ленинский пр., 148',
  },
  {
    id: 1,
    type: 'ДИАГНОСТИЧЕСКИЙ ЦЕНТР',
    address: 'г. Воронеж, Героев Стратосферы ул., 1',
  },
  {
    id: 1,
    type: 'ДИАГНОСТИЧЕСКИЙ ЦЕНТР',
    address: 'г. Воронеж, 9 Января ул., 233/35',
  },
  {
    id: 1,
    type: 'ДИАГНОСТИЧЕСКИЙ ЦЕНТР',
    address: 'г. Воронеж, Димитрова ул., 131',
  },
  {
    id: 1,
    type: 'ДИАГНОСТИЧЕСКИЙ ЦЕНТР',
    address: 'г. Воронеж, Ростовская ул., 58/22',
  },
  {
    id: 1,
    type: 'ДИАГНОСТИЧЕСКИЙ ЦЕНТР',
    address: 'г. Воронеж, Ленинский пр., 117',
  },
  {
    id: 1,
    type: 'ДИАГНОСТИЧЕСКИЙ ЦЕНТР',
    address: 'г. Воронеж, Кирова ул., 28',
  },
  {
    id: 1,
    type: 'ДИАГНОСТИЧЕСКИЙ ЦЕНТР',
    address: 'г. Воронеж, Пушкинская ул., 4',
  },
  {
    id: 1,
    type: 'ДИАГНОСТИЧЕСКИЙ ЦЕНТР',
    address: 'г. Воронеж, Писателя Маршака ул., 18а',
  },
  {
    id: 1,
    type: 'ДИАГНОСТИЧЕСКИЙ ЦЕНТР',
    address: 'г. Воронеж, Южно-Моравская ул., 30',
  },
  {
    id: 1,
    type: 'ДИАГНОСТИЧЕСКИЙ ЦЕНТР',
    address: 'г. Воронеж, Героев Сибиряков ул., 67а',
  },
  {
    id: 1,
    type: 'ПУНКТ ПРИЁМА АНАЛИЗОВ',
    address: 'г. Воронеж, Ленинский пр., 30',
  },
  {
    id: 1,
    type: 'ДИАГНОСТИЧЕСКИЙ ЦЕНТР',
    address: 'с. Новая Усмань, Ленина ул., 249',
  }
]

const dcInfo = {
  id: 1,
  type: 'ДИАГНОСТИЧЕСКИЙ ЦЕНТР',
  address: 'г. Воронеж, Ленинский пр., 30',
  workingHours: 'Круглосуточно',
  carousel: [
    '/medPoints/1/img.png',
    '/medPoints/1/img1.png',
    '/medPoints/1/img2.png',
    '/medPoints/1/img3.png',
    '/medPoints/1/img4.png',
    '/medPoints/1/img5.png',
    '/medPoints/1/img6.png',
    '/medPoints/1/img7.png',
    '/medPoints/1/img8.png',
    '/medPoints/1/img9.png',
    '/medPoints/1/img9.png',
  ],
  services: [
    {
      id: 1,
      name: 'МРТ',
      icon: '/servicesIcons/mrt.png',
      subServices: [
        {
          id: 1,
          name: 'Магнитно-резонансная томография (МРТ)',
          days: 'Ежедневно',
          time: 'круглосуточно\n',
        },
        {
          id: 2,
          name: 'Магнитно-резонансная томография (МРТ) с контрастированием',
          days: 'Ср и Вс',
          time: 'с 14:00 до 17:00',
        },
      ]
    },
    {
      id: 2,
      name: 'КТ',
      icon: '/servicesIcons/kt.png',
      subServices: [
        {
          id: 1,
          name: 'Компьютерная томография (КТ)',
          days: 'Ежедневно',
          time: 'круглосуточно',
        },
        {
          id: 2,
          name: 'Компьютерная томография (КТ) с контрастированием',
          days: 'Ср и Вс',
          time: 'с 14:00 до 17:00',
        },
      ]
    },
    {
      id: 3,
      name: 'Рентгенография',
      icon: '/servicesIcons/xray.png',
      subServices: [
        {
          id: 1,
          name: 'Рентгенография',
          days: 'Ежедневно',
          time: 'с 07:00 до 20:00',
        }
      ]
    },
    {
      id: 4,
      name: 'УЗИ',
      icon: '/servicesIcons/uzi.png',
      subServices: [
        {
          id: 1,
          name: 'УЗИ',
          days: 'Ежедневно',
          time: 'с 08:00 до 20:00',
        }
      ]
    },
    {
      id: 5,
      name: 'ФД',
      icon: '/servicesIcons/mrt.png',
      subServices: [
        {
          id: 1,
          name: 'Функциональная диагностика (ФД)',
          days: 'Ежедневно',
          time: 'с 08:00 до 20:00',
        },
      ]
    },
    {
      id: 6,
      name: 'Консультации',
      icon: '/servicesIcons/consultations.png',
      subServices: [
        {
          id: 1,
          name: 'Консультации врачей и манипуляции',
          days: 'Ежедневно',
          time: 'с 08:00 до 20:00',
        },
      ]
    },
    {
      id: 7,
      name: 'Анализы',
      icon: '/servicesIcons/laboratory.png',
      subServices: [
        {
          id: 1,
          name: 'Забор крови и мазков, прием мочи, кала и грудного молока в процедурном кабинете',
          days: 'Ежедневно',
          time: 'c 07:00 до 14:00',
        },
        {
          id: 2,
          name: 'Забор мазков и соскобов врачами-специалистами',
          days: 'Ежедневно',
          time: 'с 08:00 до 20:00',
        }
      ]
    }
  ],
  location: {
    coordinates: [55.751574, 37.573856],
    busStop: 'Кинотеатр "Мир"',
    busNumber: ['5а', '27', '41', '90'],
    trolleybus: ['99'],
    minibuses: ['37', '38', '47', '49м', '75', '97', '125'],
  }
}

export default function MedPointsPage() {
  return (
    <Container className={s.container}>
      <div className={s.dcGroup}>
        <div className={s.select}>
          <select>
            <option>Воронеж</option>
            <option>Центр 1</option>
            <option>Центр 2</option>
            <option>Центр 3</option>
          </select>
        </div>
        <div className={s.dcItems}>
          {dcs.map((dc) => (
            <div key={dc.id} className={s.dc}>
              <div className={s.type}>{dc.type}</div>
              <div className={s.adress}>{dc.address}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={s.point}>
        <div className={s.carousel}>
          <Carousel >
            {dcInfo.carousel.map((img, index) => (
              <Image src={img} alt={''}  width={1920} height={800} key={index}/>
            ))}
          </Carousel>
        </div>
        <div className={s.medPointButtonsGroup}>
          <button>
            <Image src={'/buttons/iIcon.svg'} alt={'Инфо'} width={10} height={20}/>
            Данные юридического лица
          </button>
          <button>
            <Image src={'/buttons/calendar.svg'} alt={'Календарь'} width={21} height={20}/>
            График работы мед персонала
          </button>
        </div>

        <h3 className={s.title}>Режим работы: {dcInfo.workingHours}</h3>

        <div className={s.services}>
          {dcInfo.services.map((el, index) => (
            <div className={s.service} key={el.id}>
              <div className={s.serviceIcon}>
                <Image src={el.icon} alt={'mrt'} width={35} height={35}/>
              </div>
              <div className={s.subServicesWrapper}>
                {el.subServices.map((subService) => (
                  <div className={s.subService} key={subService.id}>
                    <div className={s.subServiceName}>{subService.name}</div>
                    <div className={s.subServiceInfo}>{subService.days}</div>
                    <div className={s.subServiceTime}>{subService.time}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <h3 className={s.title}>Схема проезда</h3>

        <div className={s.mapWrapper}>
          <div className={s.ways}>
            <div className={s.way}>
              <div className={s.wayTitle}><Image src={'/infoIcons/busStop.svg'} alt={'Остановка'} width={30} height={20}/>Остановка: </div>
              {dcInfo.location.busStop && <span>{dcInfo.location.busStop}</span>}
            </div>
            <div className={s.way}>
              <div className={s.subWay}>
                <div className={s.wayTitle}><Image src={'/infoIcons/bus.svg'} alt={'Автобус'} width={30} height={20}/>Автобусы: </div>
                {dcInfo.location.busNumber && <span>№ {dcInfo.location.busNumber.join(', ')}</span>}
              </div>
              <div className={s.subWay}>
                <div className={s.wayTitle}>Троллейбусы:</div>
                {dcInfo.location.trolleybus && <span>№ {dcInfo.location.trolleybus.join(', ')}</span>}
              </div>
            </div>
            <div className={s.way}>
              <div className={s.wayTitle}><Image src={'/infoIcons/minibus.svg'} alt={'Маршрутное такси'} width={30} height={20} />Маршрутные такси: </div>
              {dcInfo.location.minibuses && <span>№ {dcInfo.location.minibuses.join(', ')}</span>}
            </div>
          </div>
          <YaMap className={s.yaMap}/>
        </div>
      </div>

    </Container>
  )
}
