import { Link } from 'react-router-dom'
import Accordion from '../../components/common/Accordion/Accordion.jsx'
import Card from '../../components/common/Card/Card.jsx'
import SectionHeader from '../../components/common/SectionHeader/SectionHeader.jsx'
import Container from '../../components/layout/Container/Container.jsx'
import { cinemaInfo } from '../../data/site.js'
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js'
import './AboutPage.css'

const contacts = [
  { label: 'Адрес', value: cinemaInfo.address },
  { label: 'Телефон', value: cinemaInfo.phone, href: `tel:${cinemaInfo.phone.replace(/[^\d+]/g, '')}` },
  { label: 'Почта', value: cinemaInfo.email, href: `mailto:${cinemaInfo.email}` },
  { label: 'Часы работы', value: cinemaInfo.hours },
]

const halls = [
  { name: 'CineVibe Hall', text: '180 кресел, экран 18 метров, лазерная проекция 4K и звук Dolby Atmos.' },
  { name: 'Зал 2', text: '90 мест для утренних сеансов, мультфильмов и повторного проката.' },
  { name: 'VIP-зал', text: '24 кресла-реклайнера, плед и обслуживание кинобара прямо в зале.' },
]

const faq = [
  {
    question: 'Можно ли вернуть билет?',
    answer: 'Да, до начала сеанса — в кассе или по телефону. Деньги вернутся на карту в течение трёх рабочих дней.',
  },
  {
    question: 'Есть ли парковка?',
    answer: 'Парковка ТРЦ «Керемет» — первые три часа бесплатно по билету в кино.',
  },
  {
    question: 'С какого возраста пускают детей?',
    answer: 'На фильмы 0+ и 6+ — с любого возраста вместе со взрослым. На 16+ и 18+ — только по документу.',
  },
  {
    question: 'Можно ли прийти со своей едой?',
    answer: 'В зал можно взять напитки в закрытой бутылке. Попкорн и снеки — из нашего кинобара, их можно заказать вместе с билетом.',
  },
]

/**
 * Страница «/about»: залы, частые вопросы (Accordion) и контакты.
 */
function AboutPage() {
  useDocumentTitle('О кинотеатре')

  return (
    <section className="page">
      <Container maxWidth={960}>
        <SectionHeader
          title="О кинотеатре CineVibe"
          subtitle="Три зала в центре Алматы: премьеры, повторный прокат любимой классики и утренние сеансы для детей."
          align="left"
          level={1}
        />

        <div className="about__grid">
          {halls.map((hall) => (
            <Card key={hall.name} title={hall.name} size="small">
              <p className="about__text">{hall.text}</p>
            </Card>
          ))}
        </div>

        <div className="about__section">
          <h2 className="about__title about__faq-title">Частые вопросы</h2>
          <Accordion>
            {faq.map((item) => (
              <Accordion.Item key={item.question}>
                <Accordion.Title>{item.question}</Accordion.Title>
                <Accordion.Content>{item.answer}</Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion>
        </div>

        <Card title="Контакты" className="about__section">
          <dl className="about__contacts">
            {contacts.map((contact) => (
              <div key={contact.label} className="about__contact">
                <dt>{contact.label}</dt>
                <dd>
                  {contact.href ? (
                    <a className="text-link" href={contact.href}>
                      {contact.value}
                    </a>
                  ) : (
                    contact.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
          <p className="about__text">
            Билеты и кинобар — в{' '}
            <Link className="text-link" to="/products">
              каталоге
            </Link>
            .
          </p>
        </Card>
      </Container>
    </section>
  )
}

export default AboutPage
