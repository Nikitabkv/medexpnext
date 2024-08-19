import s from './page.module.scss'
import {Container} from "@/shared/ui/Container/Container"
import Image from "next/image"
import {YaMap} from "@/widgets/YaMap/YaMap";
import {Carousel} from "@/widgets/Slider/Slider";

export default function LaboratoryPage() {
  return (
    <Container className={s.container}>
      <div className={s.carousel}>
        <Carousel>
          <Image draggable={false} src={'/laboratorySlider/full.png'} alt={'full.png'} width={1300} height={623}/>
          <Image draggable={false} src={'/laboratorySlider/full1.png'} alt={'full.png'} width={1300} height={623}/>
          <Image draggable={false} src={'/laboratorySlider/full2.png'} alt={'full.png'} width={1300} height={623}/>
          <Image draggable={false} src={'/laboratorySlider/full3.png'} alt={'full.png'} width={1300} height={623}/>
        </Carousel>
      </div>

      <h2 className={s.title}>Фотогалерея</h2>
      <div className={s.gallery}>
        <Image src={'/gallery/img1.png'} alt={'Фото'} width={310} height={278}/>
        <Image src={'/gallery/img2.png'} alt={'Фото'} width={310} height={278}/>
        <Image src={'/gallery/img3.png'} alt={'Фото'} width={310} height={278}/>
        <Image src={'/gallery/img4.png'} alt={'Фото'} width={310} height={278}/>
      </div>

      <div className={s.presentationWrapper}>
        <div className={s.presentation}>
          <h2 className={s.title}>Презентация лабораторного комплекса</h2>
          <Image src={'/laboratory.png'} alt={'placeholder'} width={640} height={370}/>
        </div>
        <div className={s.presentation}>
          <h2 className={s.title}>Лабораторный комплекс online</h2>
          <Image width={640} height={370}
                 src={'https://ipcam2.numedy.com/zm/cgi-bin/nph-zms?scale=%60100%60&mode=single&maxfps=15&monitor=101&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJab25lTWluZGVyIiwiaWF0IjoxNzIzNzk1MTQxLCJleHAiOjE3MjM4MDIzNDEsInVzZXIiOiJtZWRleHNpdGUiLCJ0eXBlIjoiYWNjZXNzIn0.DM2-RwQaBbwE8EiqTEWQyBF7-q7dBjXo9PGzDYNbyug'}
                 alt={'placeholder'}/>
        </div>
      </div>

      <h2 className={s.title}>Онлайн трансляции</h2>
      <div className={s.translationWrapper}>
        <Image width={310} height={170}
               src={'https://ipcam2.numedy.com/zm/cgi-bin/nph-zms?scale=%60100%60&mode=single&maxfps=15&monitor=67&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJab25lTWluZGVyIiwiaWF0IjoxNzIzNzk5NDAxLCJleHAiOjE3MjM4MDY2MDEsInVzZXIiOiJtZWRleHNpdGUiLCJ0eXBlIjoiYWNjZXNzIn0.MrFavwDmqxcUTeAuimCnaQ6VZr_C3NPD78OhzgoXQXo'}
               alt={'placeholder'}/>
        <Image width={310} height={170}
               src={'https://ipcam2.numedy.com/zm/cgi-bin/nph-zms?scale=%60100%60&mode=single&maxfps=15&monitor=69&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJab25lTWluZGVyIiwiaWF0IjoxNzIzNzk5NDAxLCJleHAiOjE3MjM4MDY2MDEsInVzZXIiOiJtZWRleHNpdGUiLCJ0eXBlIjoiYWNjZXNzIn0.MrFavwDmqxcUTeAuimCnaQ6VZr_C3NPD78OhzgoXQXo'}
               alt={'placeholder'}/>
        <Image width={310} height={170}
               src={'https://ipcam2.numedy.com/zm/cgi-bin/nph-zms?mode=single&maxfps=15&scale=100&state=1&monitor=70&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJab25lTWluZGVyIiwiaWF0IjoxNzIzNzk5NDAxLCJleHAiOjE3MjM4MDY2MDEsInVzZXIiOiJtZWRleHNpdGUiLCJ0eXBlIjoiYWNjZXNzIn0.MrFavwDmqxcUTeAuimCnaQ6VZr_C3NPD78OhzgoXQXo'}
               alt={'placeholder'}/>
        <Image width={310} height={170}
               src={'https://ipcam3.numedy.com/zm/cgi-bin/nph-zms?mode=single&maxfps=15&scale=100&state=1&monitor=13&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJab25lTWluZGVyIiwiaWF0IjoxNzIzNzk5NDAxLCJleHAiOjE3MjM4MDY2MDEsInVzZXIiOiJtZWRleHNpdGUiLCJ0eXBlIjoiYWNjZXNzIn0.MrFavwDmqxcUTeAuimCnaQ6VZr_C3NPD78OhzgoXQXo'}
               alt={'placeholder'}/>
        <Image width={310} height={170}
               src={'https://ipcam3.numedy.com/zm/cgi-bin/nph-zms?scale=`100`&mode=single&maxfps=15&monitor=18&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJab25lTWluZGVyIiwiaWF0IjoxNzIzNzk5NDAxLCJleHAiOjE3MjM4MDY2MDEsInVzZXIiOiJtZWRleHNpdGUiLCJ0eXBlIjoiYWNjZXNzIn0.MrFavwDmqxcUTeAuimCnaQ6VZr_C3NPD78OhzgoXQXo'}
               alt={'placeholder'}/>
        <Image width={310} height={170}
               src={'https://ipcam3.numedy.com/zm/cgi-bin/nph-zms?scale=`100`&mode=single&maxfps=15&monitor=40&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJab25lTWluZGVyIiwiaWF0IjoxNzIzNzk5NDAxLCJleHAiOjE3MjM4MDY2MDEsInVzZXIiOiJtZWRleHNpdGUiLCJ0eXBlIjoiYWNjZXNzIn0.MrFavwDmqxcUTeAuimCnaQ6VZr_C3NPD78OhzgoXQXo'}
               alt={'placeholder'}/>
        <Image width={310} height={170}
               src={'https://ipcam3.numedy.com/zm/cgi-bin/nph-zms?scale=`100`&mode=single&maxfps=15&monitor=19&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJab25lTWluZGVyIiwiaWF0IjoxNzIzNzk5NDAxLCJleHAiOjE3MjM4MDY2MDEsInVzZXIiOiJtZWRleHNpdGUiLCJ0eXBlIjoiYWNjZXNzIn0.MrFavwDmqxcUTeAuimCnaQ6VZr_C3NPD78OhzgoXQXo'}
               alt={'placeholder'}/>
        <Image width={310} height={170}
               src={'https://ipcam3.numedy.com/zm/cgi-bin/nph-zms?scale=`100`&mode=single&maxfps=15&monitor=37&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJab25lTWluZGVyIiwiaWF0IjoxNzIzNzk5NDAxLCJleHAiOjE3MjM4MDY2MDEsInVzZXIiOiJtZWRleHNpdGUiLCJ0eXBlIjoiYWNjZXNzIn0.MrFavwDmqxcUTeAuimCnaQ6VZr_C3NPD78OhzgoXQXo'}
               alt={'placeholder'}/>
      </div>

      <h2 className={s.title}>Оборудование</h2>
      <div className={s.equipmentWrapper}>
        <div className={s.equipment}>
          <Image src={'/equipment.png'} alt={'p'} width={650} height={347}/>
          <p className={s.equipmentText}>Анализатор коагуляции Roche Diagnostics Cobas t 711</p>
        </div>
        <div className={s.equipment}>
          <Image src={'/equipment.png'} alt={'p'} width={650} height={347}/>
          <p className={s.equipmentText}>Анализатор коагуляции Roche Diagnostics Cobas t 711</p>
        </div>
        <div className={s.equipment}>
          <Image src={'/equipment.png'} alt={'p'} width={650} height={347}/>
          <p className={s.equipmentText}>Анализатор коагуляции Roche Diagnostics Cobas t 711</p>
        </div>
        <div className={s.equipment}>
          <Image src={'/equipment.png'} alt={'p'} width={650} height={347}/>
          <p className={s.equipmentText}>Анализатор коагуляции Roche Diagnostics Cobas t 711</p>
        </div>
        <div className={s.equipment}>
          <Image src={'/equipment.png'} alt={'p'} width={650} height={347}/>
          <p className={s.equipmentText}>Анализатор коагуляции Roche Diagnostics Cobas t 711</p>
        </div>
        <div className={s.equipment}>
          <Image src={'/equipment.png'} alt={'p'} width={650} height={347}/>
          <p className={s.equipmentText}>Анализатор коагуляции Roche Diagnostics Cobas t 711</p>
        </div>
        <div className={s.equipment}>
          <Image src={'/equipment.png'} alt={'p'} width={650} height={347}/>
          <p className={s.equipmentText}>Анализатор коагуляции Roche Diagnostics Cobas t 711</p>
        </div>
        <div className={s.equipment}>
          <Image src={'/equipment.png'} alt={'p'} width={650} height={347}/>
          <p className={s.equipmentText}>Анализатор коагуляции Roche Diagnostics Cobas t 711</p>
        </div>
        <div className={s.equipment}>
          <Image src={'/equipment.png'} alt={'p'} width={650} height={347}/>
          <p className={s.equipmentText}>Анализатор коагуляции Roche Diagnostics Cobas t 711</p>
        </div>
        <div className={s.equipment}>
          <Image src={'/equipment.png'} alt={'p'} width={650} height={347}/>
          <p className={s.equipmentText}>Анализатор коагуляции Roche Diagnostics Cobas t 711</p>
        </div>
        <div className={s.equipment}>
          <Image src={'/equipment.png'} alt={'p'} width={650} height={347}/>
          <p className={s.equipmentText}>Анализатор коагуляции Roche Diagnostics Cobas t 711</p>
        </div>
        <div className={s.equipment}>
          <Image src={'/equipment.png'} alt={'p'} width={650} height={347}/>
          <p className={s.equipmentText}>Анализатор коагуляции Roche Diagnostics Cobas t 711</p>
        </div>
        <div className={s.equipment}>
          <Image src={'/equipment.png'} alt={'p'} width={650} height={347}/>
          <p className={s.equipmentText}>Анализатор коагуляции Roche Diagnostics Cobas t 711</p>
        </div>
        <div className={s.equipment}>
          <Image src={'/equipment.png'} alt={'p'} width={650} height={347}/>
          <p className={s.equipmentText}>Анализатор коагуляции Roche Diagnostics Cobas t 711</p>
        </div>
        <div className={s.equipment}>
          <Image src={'/equipment.png'} alt={'p'} width={650} height={347}/>
          <p className={s.equipmentText}>Анализатор коагуляции Roche Diagnostics Cobas t 711</p>
        </div>
        <div className={s.equipment}>
          <Image src={'/equipment.png'} alt={'p'} width={650} height={347}/>
          <p className={s.equipmentText}>Анализатор коагуляции Roche Diagnostics Cobas t 711</p>
        </div>
      </div>

      <div className={s.map}>
        <div className={s.info}>
          <div className={s.address}>
            <Image src={'/marker.svg'} alt={'Адрес'} width={24} height={24} />
            <span>г. Воронеж, Купянский пер., 5</span>
          </div>
          <button>
            <Image src={'/buttons/iIcon.svg'} alt={'Адрес'} width={10} height={20}/>
            <span>Данные юридического лица</span>
          </button>
        </div>
        <YaMap className={s.yaMap}/>
      </div>
    </Container>
  )
}