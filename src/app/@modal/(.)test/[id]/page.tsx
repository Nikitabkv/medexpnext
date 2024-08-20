import {InfoModal} from "@/shared/ui/InfoModal/InfoModal"
import s from "@/app/feedback/page.module.scss"
import Image from "next/image"

export default function ModalPage () {
  return (
    <InfoModal title={'Информация о юридических лицах'}>
      <div className={s.modalContent}>
        <div className={s.circle}>1</div>
        <div className={s.detailsDocs}>
          <div className={s.companyDetails}>
            <b>ООО «МедЭксперт»</b>
            <div>
            <span>
              ИНН: 3662170024
            </span>
              <span>
              КПП: 366201001
            </span>
            </div>
            <div>
              Юридический адрес: 394026, г. Воронеж, Электросигнальная ул., 1, офис 39
            </div>
          </div>
          <div className={s.documents}>
            <div className={s.document}>
              <Image src={'https://med-exp.ru/img/certificates/cert11.png'} alt={'Выписка из реестра лицензий'} width={210} height={300} />
              <span>Выписка из реестра лицензий</span>
            </div>
            <div className={s.document}>
              <Image src={'https://med-exp.ru/img/certificates/cert2.png'} alt={'Свидетельство о государственной регистрации'} width={210} height={300} />
              <span>Свидетельство о государственной регистрации</span>
            </div>
            <div className={s.document}>
              <Image src={'https://med-exp.ru/img/certificates/cert3.png'} alt={'Свидетельство о постановке на налоговый учет'} width={210} height={300} />
              <span>Свидетельство о постановке на налоговый учет</span>
            </div>
          </div>
        </div>
      </div>
    </InfoModal>
  )
}
