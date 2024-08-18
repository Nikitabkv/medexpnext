import s from "./page.module.scss"
import {Container} from "@/shared/ui/Container/Container"
import {ServicesAside} from "@/widgets/ServicesAside/ServicesAside"

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Container className={s.container}>
      <ServicesAside />
      {children}
    </Container>
  );
}
