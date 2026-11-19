import { Link } from 'react-router-dom'
import DataLoader from '../../components/common/DataLoader/DataLoader.jsx'
import ErrorMessage from '../../components/common/ErrorMessage/ErrorMessage.jsx'
import Loader from '../../components/common/Loader/Loader.jsx'
import SectionHeader from '../../components/common/SectionHeader/SectionHeader.jsx'
import HeroSection from '../../components/home/HeroSection/HeroSection.jsx'
import TestimonialCard from '../../components/home/TestimonialCard/TestimonialCard.jsx'
import TodaySchedule from '../../components/home/TodaySchedule/TodaySchedule.jsx'
import Container from '../../components/layout/Container/Container.jsx'
import ProductList from '../../components/product/ProductList/ProductList.jsx'
import { hero } from '../../data/site.js'
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js'
import { useFetch } from '../../hooks/useFetch.js'
import { getJson, homeUrl, productsUrl } from '../../services/api.js'
import { sortProducts } from '../../utils/helpers.js'
import './HomePage.css'

const SHOWCASE_SIZE = 4

// Функция загрузки объявлена вне компонента: ссылка стабильна, и DataLoader
// не перезапускает запрос при каждом рендере главной
const loadCatalog = (signal) => getJson(productsUrl(), signal)

/** Подборки главной из одного запроса каталога. */
function pickShowcase(products) {
  const byRating = sortProducts(products, 'rating')
  const movies = byRating.filter((product) => product.type === 'movie')
  return {
    nowShowing: movies.filter((movie) => movie.isAvailable).slice(0, SHOWCASE_SIZE),
    barHits: byRating.filter((product) => product.type === 'bar').slice(0, SHOWCASE_SIZE),
    movies,
  }
}

function SectionHead({ title, subtitle, link, linkText }) {
  return (
    <div className="home__section-head">
      <SectionHeader title={title} subtitle={subtitle} align="left" />
      <Link className="text-link" to={link}>
        {linkText} →
      </Link>
    </div>
  )
}

/**
 * Главная «/»: что идёт в прокате, хиты кинобара, расписание и отзывы зрителей.
 */
function HomePage() {
  useDocumentTitle(null)
  const { data: home, loading: isHomeLoading, error: homeError, refetch: reloadHome } = useFetch(homeUrl())

  return (
    <>
      <HeroSection eyebrow={hero.eyebrow} heading={hero.heading} subheading={hero.subheading}>
        <Link className="link-button link-button--primary" to="/products?type=movie">
          Купить билет
        </Link>
        <Link className="link-button link-button--outline" to="/products?type=bar">
          Кинобар
        </Link>
      </HeroSection>

      {/* Render Props: DataLoader загружает каталог, а главная решает, как показать результат */}
      <DataLoader loadData={loadCatalog}>
        {(products, loading, error, reload) => {
          if (loading) return <Loader label="Загружаем афишу…" />
          if (error) {
            return (
              <Container>
                <ErrorMessage message={error} onRetry={reload} />
              </Container>
            )
          }

          const { nowShowing, barHits, movies } = pickShowcase(products)
          return (
            <>
              <section className="section">
                <Container>
                  <SectionHead
                    title="Сейчас в прокате"
                    subtitle="Фильмы с самыми высокими оценками зрителей."
                    link="/products?type=movie"
                    linkText="Все фильмы"
                  />
                  <ProductList products={nowShowing} />
                </Container>
              </section>

              <section className="section">
                <Container>
                  <SectionHead
                    title="Хиты кинобара"
                    subtitle="Попкорн, напитки и комбо — заберите на входе в зал."
                    link="/products?type=bar"
                    linkText="Весь кинобар"
                  />
                  <ProductList products={barHits} />
                </Container>
              </section>

              <section className="section">
                <Container>
                  <SectionHeader title="Расписание на сегодня" subtitle="Выберите сеанс — откроется страница фильма." align="left" />
                  <TodaySchedule movies={movies} />
                </Container>
              </section>
            </>
          )
        }}
      </DataLoader>

      <section className="section">
        <Container maxWidth={1080}>
          <SectionHeader title="Что говорят зрители" subtitle="Отзывы гостей CineVibe." align="center" />
          {isHomeLoading && <Loader />}
          {homeError && <ErrorMessage message={homeError} onRetry={reloadHome} />}
          {home && (
            <div className="testimonials-grid">
              {home.testimonials.map((review) => (
                <TestimonialCard
                  key={review.id}
                  authorName={review.authorName}
                  authorRole={review.authorRole}
                  avatar={review.avatar}
                  text={review.text}
                  date={review.date}
                />
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  )
}

export default HomePage
