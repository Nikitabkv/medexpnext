import {Metadata} from "next";
import {ServiceDescription} from "@/widgets/ServiceDescription/ServiceDescription";

const service = {
  imgPath: '/aboutServices/rehabilitation.png',
  description: [
    {
      title: 'Консультации и осмотры.',
      text: 'Первичная консультация врача-физиотерапевта включает в себя осмотр, рекомендации и направления на физиотерапевтические манипуляции. Повторная консультация проводится, как правило, без осмотра, оценивается эффективность физиотерапевтического лечения, проводится корректировка назначений, даются рекомендации.'
    },
    {
      title: 'Манипуляции и услуги.',
      text: 'Эффективность лечения зависит от регулярности физиотерапевтических процедур. Перерывы в физиотерапевтическом лечении нежелательны. Электротерапия - лечение при помощи воздействия на организм электрического тока. Электрофорез - физиотерапевтический метод, в основе которого лежит комплексное действие на организм электрического тока и вводимых с его помощью лекарственных веществ. Диадинамотерапия - воздействие на организм токами низкого напряжения и частоты, дополнительно могут применяться лекарственные вещества. Лазерная терапия - метод светотерапии, подразумевающий воздействие на организм низкоинтенсивного или высокоинтенсивного лазерного излучения. Магнитотерапия - способ физиотерапевтического воздействия на организм при помощи магнитного поля. Ультразвуковая терапия - воздействие на организм механических колебаний ультразвуковой частоты. Фонофорез - комбинированный метод, сочетающий ультразвуковое и медикаментозное воздействие.'
    },
    {
      title: 'Подготовка.',
      text: 'Специальной подготовки не требуется.',
    },
    {
      title: 'Противопоказания и риски.',
      text: 'Для консультации и осмотра врача-физиотерапевта противопоказаний не выявлено. Противопоказания к физиотерапевтическим манипуляциям и услугам, а также потенциальные риски физиотерапевтических манипуляций определяет врач-физиотерапевт.',
    },
    {
      title: 'Прием врача-физиотерапевта, физиотерапевтические манипуляции и услуги проводятся по предварительной записи.',
      text: '',
    },
  ]
}

export const metadata: Metadata = {
  title: 'Реабилитация - МедЭксперт',
  description: 'Реабилитация - МедЭксперт',
}

export default function RehabilitationPage() {
  return (
    <ServiceDescription service={service}/>
  )
}
