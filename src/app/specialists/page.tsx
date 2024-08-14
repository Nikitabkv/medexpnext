import {Search} from "@/shared/ui/Search/Search"
import {Container} from "@/shared/ui/Container/Container"
import s from './page.module.scss'
import {Doctor} from "@/widgets/Doctor/Doctor";

export default function SpecialistsPage() {
  return (
    <Container className={s.container}>
      <div className={s.searchWrapper}>
        <Search placeholder={'Введите ФИО врача'} width={'65%'}/>
        <Search placeholder={'Специальность врача'} width={'35%'} backgroundImgPath={'/infoIcons/manager.svg'}/>
      </div>
      <div className={s.doctorsWrapper}>
        <Doctor />
        <Doctor />
        <Doctor />
        <Doctor />
        <Doctor />
        <Doctor />
        <Doctor />
        <Doctor />
        <Doctor />
        <Doctor />
        <Doctor />
        <Doctor />
        <Doctor />
        <Doctor />
        <Doctor />
        <Doctor />
        <Doctor />
        <Doctor />
        <Doctor />
        <Doctor />
        <Doctor />
        <Doctor />
        <Doctor />
        <Doctor />
        <Doctor />
        <Doctor />
        <Doctor />
        <Doctor />
        <Doctor />
        <Doctor />
        <Doctor />
        <Doctor />
        <Doctor />
        <Doctor />
        <Doctor />
        <Doctor />
        <Doctor />
        <Doctor />
        <Doctor />
        <Doctor />
        <Doctor />
      </div>
    </Container>
  )
}