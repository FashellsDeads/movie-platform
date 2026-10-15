import { Link } from 'react-router-dom'
import Button from '../components/Button/Button.jsx'
import Container from '../components/Container/Container.jsx'
import SectionHeader from '../components/SectionHeader/SectionHeader.jsx'
import { categories, movies } from '../data/movies.js'
import { cinemaInfo, premiumBenefits } from '../data/site.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { useLayout } from '../hooks/useLayout.js'
import './AboutPage.css'

const contacts = [
  { label: 'Адрес', value: cinemaInfo.address },
  { label: 'Телефон', value: cinemaInfo.phone, href: `tel:${cinemaInfo.phone.replace(/[^\d+]/g, '')}` },
  { label: 'Почта', value: cinemaInfo.email, href: `mailto:${cinemaInfo.email}` },
  { label: 'Часы работы', value: cinemaInfo.hours },
]

/**
 * Страница «/about» — о кинотеатре, жанры (ссылки в каталог с ?genre=) и контакты.
 */
function AboutPage() {
  useDocumentTitle('О кинотеатре')
  const { openPremium } = useLayout()
  const genres = categories.slice(1)

  return (
    <section className="page">
      <Container maxWidth={960}>
        <SectionHeader
          title="О кинотеатре CineVibe"
          subtitle={`Онлайн-кинотеатр и уютный зал в Алматы. В каталоге — ${movies.length} фильмов, от новых премьер до любимой классики.`}
          align="left"
        />

        <div className="about__grid">
          <article className="about__card">
            <h2 className="about__title">Жанры</h2>
            <p className="about__text">Откройте каталог сразу с нужным фильтром:</p>
            <ul className="about__genres">
              {genres.map((genre) => (
                <li key={genre}>
                  <Link className="about__genre" to={`/movies?genre=${encodeURIComponent(genre)}`}>
                    {genre}
                  </Link>
                </li>
              ))}
            </ul>
          </article>

          <article className="about__card">
            <h2 className="about__title">Premium</h2>
            <ul className="premium__list">
              {premiumBenefits.map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>
            <Button text="Подробнее о подписке" variant="primary" onClick={openPremium} />
          </article>
        </div>

        <article className="about__card">
          <h2 className="about__title">Контакты</h2>
          <dl className="about__contacts">
            {contacts.map((contact) => (
              <div key={contact.label} className="about__contact">
                <dt>{contact.label}</dt>
                <dd>{contact.href ? <a className="text-link" href={contact.href}>{contact.value}</a> : contact.value}</dd>
              </div>
            ))}
          </dl>
        </article>
      </Container>
    </section>
  )
}

export default AboutPage
