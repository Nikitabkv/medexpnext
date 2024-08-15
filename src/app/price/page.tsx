import s from './page.module.scss'
import {Container} from "@/shared/ui/Container/Container"
import Image from "next/image";
import {Fragment} from "react";

const services = [
  {
    id: 1,
    name: 'Магнитно-резонансная\nтомография (МРТ)',
    icon: '/servicesIcons/mrt.png',
  },
  {
    id: 2,
    name: 'Компьютерная\nтомография (КТ)',
    icon: '/servicesIcons/kt.png',
  },
  {
    id: 3,
    name: 'Рентгенография\n(Рентген)',
    icon: '/servicesIcons/xray.png',
  },
  {
    id: 4,
    name: 'Ультразвуковые\nисследования (УЗИ)',
    icon: '/servicesIcons/uzi.png',
  },
  {
    id: 5,
    name: 'Функциональная\nдиагностика (ФД)',
    icon: '/servicesIcons/fd.png',
  },
  {
    id: 6,
    name: 'Консультации и\nманипуляции',
    icon: '/servicesIcons/consultations.png',
  },
  {
    id: 7,
    name: 'Косметология',
    icon: '/servicesIcons/cosmetology.png',
  },
  {
    id: 8,
    name: 'Реабилитация',
    icon: '/servicesIcons/rehabilitation.png',
  },
  {
    id: 9,
    name: 'Услуги\nдополнительные',
    icon: '/servicesIcons/additionalServices.png',
  },
  {
    id: 10,
    name: 'Лабораторная\nдиагностика',
    icon: '/servicesIcons/laboratory.png',
  }
]

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

const prices = [
  {
    modality: 'Магнитно-резонансная томография (МРТ)',
    id: 1,
    priceGroup: [
      {
        id: 2,
        groupName: 'Голова',
        prices: [
          {
            id: 3,
            name: 'Головной мозг',
            price: 2000,
            subPrices: [
              {
                id: 104,
                name: 'Исследование на нейроваскулярный конфликт',
                price: 2000,
              },
              {
                id: 105,
                name: 'Исследование при рассеянном склерозе',
                price: 2000,
              }
            ]
          },
          {
            id: 4,
            name: 'Головной мозг при эпилепсии (эпипротокол)',
            price: 1550,
          }
        ]
      },
      {
        id: 5,
        groupName: 'Шея',
        prices: [
          {
            id: 6,
            name: 'Шейный отдел позвоночника',
            price: 2000,
          },
          {
            id: 7,
            name: 'Краниовертебральный переход',
            price: 1550,
          }
        ]
      }
    ]
  },
  {
    modality: 'Рентгенография (Рентген)',
    id: 20,
    priceGroup: [
      {
        id: 22,
        groupName: 'Голова',
        prices: [
          {
            id: 23,
            name: 'Головной мозг',
            price: 2000,
            subPrices: [
              {
                id: 2104,
                name: 'Исследование на нейроваскулярный конфликт',
                price: 2000,
              },
              {
                id: 2105,
                name: 'Исследование при рассеянном склерозе',
                price: 2000,
              }
            ]
          },
          {
            id: 24,
            name: 'Головной мозг при эпилепсии (эпипротокол)',
            price: 1550,
          }
        ]
      },
      {
        id: 25,
        groupName: 'Шея',
        prices: [
          {
            id: 26,
            name: 'Шейный отдел позвоночника',
            price: 2000,
          },
          {
            id: 27,
            name: 'Краниовертебральный переход',
            price: 1550,
          }
        ]
      }
    ]
  },
  {
    modality: 'Магнитно-резонансная томография (МРТ)',
    id: 1,
    priceGroup: [
      {
        id: 2,
        groupName: 'Голова',
        prices: [
          {
            id: 3,
            name: 'Головной мозг',
            price: 2000,
            subPrices: [
              {
                id: 104,
                name: 'Исследование на нейроваскулярный конфликт',
                price: 2000,
              },
              {
                id: 105,
                name: 'Исследование при рассеянном склерозе',
                price: 2000,
              }
            ]
          },
          {
            id: 4,
            name: 'Головной мозг при эпилепсии (эпипротокол)',
            price: 1550,
          }
        ]
      },
      {
        id: 5,
        groupName: 'Шея',
        prices: [
          {
            id: 6,
            name: 'Шейный отдел позвоночника',
            price: 2000,
          },
          {
            id: 7,
            name: 'Краниовертебральный переход',
            price: 1550,
          }
        ]
      }
    ]
  },
  {
    modality: 'Рентгенография (Рентген)',
    id: 20,
    priceGroup: [
      {
        id: 22,
        groupName: 'Голова',
        prices: [
          {
            id: 23,
            name: 'Головной мозг',
            price: 2000,
            subPrices: [
              {
                id: 2104,
                name: 'Исследование на нейроваскулярный конфликт',
                price: 2000,
              },
              {
                id: 2105,
                name: 'Исследование при рассеянном склерозе',
                price: 2000,
              }
            ]
          },
          {
            id: 24,
            name: 'Головной мозг при эпилепсии (эпипротокол)',
            price: 1550,
          }
        ]
      },
      {
        id: 25,
        groupName: 'Шея',
        prices: [
          {
            id: 26,
            name: 'Шейный отдел позвоночника',
            price: 2000,
          },
          {
            id: 27,
            name: 'Краниовертебральный переход',
            price: 1550,
          }
        ]
      }
    ]
  },
  {
    modality: 'Магнитно-резонансная томография (МРТ)',
    id: 1,
    priceGroup: [
      {
        id: 2,
        groupName: 'Голова',
        prices: [
          {
            id: 3,
            name: 'Головной мозг',
            price: 2000,
            subPrices: [
              {
                id: 104,
                name: 'Исследование на нейроваскулярный конфликт',
                price: 2000,
              },
              {
                id: 105,
                name: 'Исследование при рассеянном склерозе',
                price: 2000,
              }
            ]
          },
          {
            id: 4,
            name: 'Головной мозг при эпилепсии (эпипротокол)',
            price: 1550,
          }
        ]
      },
      {
        id: 5,
        groupName: 'Шея',
        prices: [
          {
            id: 6,
            name: 'Шейный отдел позвоночника',
            price: 2000,
          },
          {
            id: 7,
            name: 'Краниовертебральный переход',
            price: 1550,
          }
        ]
      }
    ]
  },
  {
    modality: 'Рентгенография (Рентген)',
    id: 20,
    priceGroup: [
      {
        id: 22,
        groupName: 'Голова',
        prices: [
          {
            id: 23,
            name: 'Головной мозг',
            price: 2000,
            subPrices: [
              {
                id: 2104,
                name: 'Исследование на нейроваскулярный конфликт',
                price: 2000,
              },
              {
                id: 2105,
                name: 'Исследование при рассеянном склерозе',
                price: 2000,
              }
            ]
          },
          {
            id: 24,
            name: 'Головной мозг при эпилепсии (эпипротокол)',
            price: 1550,
          }
        ]
      },
      {
        id: 25,
        groupName: 'Шея',
        prices: [
          {
            id: 26,
            name: 'Шейный отдел позвоночника',
            price: 2000,
          },
          {
            id: 27,
            name: 'Краниовертебральный переход',
            price: 1550,
          }
        ]
      }
    ]
  },
  {
    modality: 'Магнитно-резонансная томография (МРТ)',
    id: 1,
    priceGroup: [
      {
        id: 2,
        groupName: 'Голова',
        prices: [
          {
            id: 3,
            name: 'Головной мозг',
            price: 2000,
            subPrices: [
              {
                id: 104,
                name: 'Исследование на нейроваскулярный конфликт',
                price: 2000,
              },
              {
                id: 105,
                name: 'Исследование при рассеянном склерозе',
                price: 2000,
              }
            ]
          },
          {
            id: 4,
            name: 'Головной мозг при эпилепсии (эпипротокол)',
            price: 1550,
          }
        ]
      },
      {
        id: 5,
        groupName: 'Шея',
        prices: [
          {
            id: 6,
            name: 'Шейный отдел позвоночника',
            price: 2000,
          },
          {
            id: 7,
            name: 'Краниовертебральный переход',
            price: 1550,
          }
        ]
      }
    ]
  },
  {
    modality: 'Рентгенография (Рентген)',
    id: 20,
    priceGroup: [
      {
        id: 22,
        groupName: 'Голова',
        prices: [
          {
            id: 23,
            name: 'Головной мозг',
            price: 2000,
            subPrices: [
              {
                id: 2104,
                name: 'Исследование на нейроваскулярный конфликт',
                price: 2000,
              },
              {
                id: 2105,
                name: 'Исследование при рассеянном склерозе',
                price: 2000,
              }
            ]
          },
          {
            id: 24,
            name: 'Головной мозг при эпилепсии (эпипротокол)',
            price: 1550,
          }
        ]
      },
      {
        id: 25,
        groupName: 'Шея',
        prices: [
          {
            id: 26,
            name: 'Шейный отдел позвоночника',
            price: 2000,
          },
          {
            id: 27,
            name: 'Краниовертебральный переход',
            price: 1550,
          }
        ]
      }
    ]
  },
  {
    modality: 'Магнитно-резонансная томография (МРТ)',
    id: 1,
    priceGroup: [
      {
        id: 2,
        groupName: 'Голова',
        prices: [
          {
            id: 3,
            name: 'Головной мозг',
            price: 2000,
            subPrices: [
              {
                id: 104,
                name: 'Исследование на нейроваскулярный конфликт',
                price: 2000,
              },
              {
                id: 105,
                name: 'Исследование при рассеянном склерозе',
                price: 2000,
              }
            ]
          },
          {
            id: 4,
            name: 'Головной мозг при эпилепсии (эпипротокол)',
            price: 1550,
          }
        ]
      },
      {
        id: 5,
        groupName: 'Шея',
        prices: [
          {
            id: 6,
            name: 'Шейный отдел позвоночника',
            price: 2000,
          },
          {
            id: 7,
            name: 'Краниовертебральный переход',
            price: 1550,
          }
        ]
      }
    ]
  },
  {
    modality: 'Рентгенография (Рентген)',
    id: 20,
    priceGroup: [
      {
        id: 22,
        groupName: 'Голова',
        prices: [
          {
            id: 23,
            name: 'Головной мозг',
            price: 2000,
            subPrices: [
              {
                id: 2104,
                name: 'Исследование на нейроваскулярный конфликт',
                price: 2000,
              },
              {
                id: 2105,
                name: 'Исследование при рассеянном склерозе',
                price: 2000,
              }
            ]
          },
          {
            id: 24,
            name: 'Головной мозг при эпилепсии (эпипротокол)',
            price: 1550,
          }
        ]
      },
      {
        id: 25,
        groupName: 'Шея',
        prices: [
          {
            id: 26,
            name: 'Шейный отдел позвоночника',
            price: 2000,
          },
          {
            id: 27,
            name: 'Краниовертебральный переход',
            price: 1550,
          }
        ]
      }
    ]
  },
  {
    modality: 'Магнитно-резонансная томография (МРТ)',
    id: 1,
    priceGroup: [
      {
        id: 2,
        groupName: 'Голова',
        prices: [
          {
            id: 3,
            name: 'Головной мозг',
            price: 2000,
            subPrices: [
              {
                id: 104,
                name: 'Исследование на нейроваскулярный конфликт',
                price: 2000,
              },
              {
                id: 105,
                name: 'Исследование при рассеянном склерозе',
                price: 2000,
              }
            ]
          },
          {
            id: 4,
            name: 'Головной мозг при эпилепсии (эпипротокол)',
            price: 1550,
          }
        ]
      },
      {
        id: 5,
        groupName: 'Шея',
        prices: [
          {
            id: 6,
            name: 'Шейный отдел позвоночника',
            price: 2000,
          },
          {
            id: 7,
            name: 'Краниовертебральный переход',
            price: 1550,
          }
        ]
      }
    ]
  },
  {
    modality: 'Рентгенография (Рентген)',
    id: 20,
    priceGroup: [
      {
        id: 22,
        groupName: 'Голова',
        prices: [
          {
            id: 23,
            name: 'Головной мозг',
            price: 2000,
            subPrices: [
              {
                id: 2104,
                name: 'Исследование на нейроваскулярный конфликт',
                price: 2000,
              },
              {
                id: 2105,
                name: 'Исследование при рассеянном склерозе',
                price: 2000,
              }
            ]
          },
          {
            id: 24,
            name: 'Головной мозг при эпилепсии (эпипротокол)',
            price: 1550,
          }
        ]
      },
      {
        id: 25,
        groupName: 'Шея',
        prices: [
          {
            id: 26,
            name: 'Шейный отдел позвоночника',
            price: 2000,
          },
          {
            id: 27,
            name: 'Краниовертебральный переход',
            price: 1550,
          }
        ]
      }
    ]
  }
]

const modalityIcons = {
  'Магнитно-резонансная томография (МРТ)': '/servicesIcons/mrt.png',
  'Компьютерная томография (КТ)': '/servicesIcons/ct.png',
  'Рентгенография (Рентген)': '/servicesIcons/xray.png',
  'Ультразвуковые исследования (УЗИ)': '/servicesIcons/uzi.png',
}

export default function PricePage() {
  return (
    <Container className={s.container}>

      <div className={s.priceGroups}>
        <div className={s.header}>
          <button>
            <Image src={'/buttons/burger.svg'} alt={'Меню'} width={35} height={25}/>
          </button>
          <div>
            Виды услуг
          </div>
        </div>
        <div className={s.priceGroupItems}>
          {services.map((service) => (
            <div key={service.id} className={s.serviceItem}>
              <Image src={service.icon} alt={service.name} width={35} height={35}/>
              <span className={s.serviceName}>{service.name}</span>
            </div>
          ))}
        </div>
        <button className={s.atlasButton}>
          <Image src={'/atlasVertLogo.svg'} alt={'Атлас пациента'} width={50} height={60}/>
          <span>Записаться онлайн</span>
        </button>
      </div>

      <div className={s.prices}>
        <div className={s.searchWrapper}>
          <div className={s.search}>
            <input type={'text'} placeholder={'Введите название услуги'} />
          </div>
        </div>
        {prices.map((modality) => (
          <div className={s.modality} key={modality.id}>
            <div className={s.modalityHeader}>
              <div className={s.modalityTitle}>
                {/*@ts-ignore*/}
                <Image src={modalityIcons[modality.modality]} alt={''} width={35} height={35}/>
                <h3>{modality.modality}</h3>
              </div>
              <span>Цена</span>
            </div>
            {modality.priceGroup.map((group) => (
              <>
                <div className={s.priceGroup} key={group.id}>
                  <div className={s.priceGroupTitle}>{group.groupName}</div>
                </div>
                {group.prices.map((price) => (
                  <>
                    <div className={s.price} key={price.id}>
                      <div className={s.priceName}>{price.name}</div>
                      <div className={s.priceValue}>{price.price} ₽</div>
                    </div>
                    {price.subPrices && price.subPrices.map((subPrice) => (
                      <Fragment key={subPrice.id}>
                        <div className={s.price + ' ' + s.subPrice} key={subPrice.id}>
                          <div className={s.priceName}>{subPrice.name}</div>
                          <div className={s.priceValue}>{subPrice.price} ₽</div>
                        </div>
                      </Fragment>
                    ))}
                  </>
                ))}
              </>
            ))}
          </div>
        ))}
      </div>

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
    </Container>
  )
}