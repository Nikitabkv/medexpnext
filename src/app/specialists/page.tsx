import {Search} from "@/shared/ui/Search/Search"
import {Container} from "@/shared/ui/Container/Container"
import s from './page.module.scss'
import {Doctor} from "@/widgets/Doctor/Doctor";
import Link from "next/link";
import {Fragment} from "react";

export default function SpecialistsPage() {
  return (
    <Fragment>
      <div style={{height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Link href={'/specialists/1'}>Попап</Link>
      </div>
      <Container className={s.container}>
        <div className={s.searchWrapper}>
          <Search placeholder={'Введите ФИО врача'} width={'65%'}/>
          <Search placeholder={'Специальность врача'} width={'35%'} backgroundImgPath={'/infoIcons/manager.svg'}/>
        </div>
        <div className={s.doctorsWrapper}>
          {Array(40).fill('').map((_, index) => (
            <Link href={`/specialists/${index+1}`} key={index}>
              <Doctor key={index} />
            </Link>
          ))}
        </div>
      </Container>
    </Fragment>
  )
}