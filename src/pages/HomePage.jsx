import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { fetchHomeData, fetchMovies } from '../api/cinemaApi.js'
import Container from '../components/Container/Container.jsx'
import ErrorState from '../components/ErrorState/ErrorState.jsx'
import HeroSection from '../components/HeroSection/HeroSection.jsx'
import MovieGrid from '../components/MovieGrid/MovieGrid.jsx'
import PromoBanner from '../components/PromoBanner/PromoBanner.jsx'
import ReviewForm from '../components/ReviewForm/ReviewForm.jsx'
import SectionHeader from '../components/SectionHeader/SectionHeader.jsx'
import StatCard from '../components/StatCard/StatCard.jsx'
import TestimonialCard from '../components/TestimonialCard/TestimonialCard.jsx'
import { ALL_CATEGORY, movies } from '../data/movies.js'
import { hero, promo } from '../data/site.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { useLayout } from '../hooks/useLayout.js'
import { todayIso } from '../utils/format.js'
import './HomePage.css'

const featuredMovie = movies[0]
const SKELETON_COUNT = 4
const POPULAR_COUNT = 4

/**
 * Главная страница «/»: промо, статистика, популярные фильмы и отзывы.
 */
function HomePage() {
  useDocumentTitle(null)
  const navigate = useNavigate()
  const { showToast, openPremium } = useLayout()

  const [homeData, setHomeData] = useState({ stats: [], testimonials: [] })
  const [isHomeLoading, setIsHomeLoading] = useState(true)
  const [popularMovies, setPopularMovies] = useState(null)
  const [isPromoVisible, setIsPromoVisible] = useState(true)
  const [userReviews, setUserReviews] = useState([])
  const reviewIdRef = useRef(0)
  const [loadError, setLoadError] = useState(null)
  const [attempt, setAttempt] = useState(0)

  // ДЗ №4 · #1 — первичная загрузка данных главной при монтировании (и повторная — по кнопке «Повторить»)
  useEffect(() => {
    const controller = new AbortController()
    const handleError = (error) => {
      if (error.name === 'AbortError') return
      setLoadError(error.message)
      setIsHomeLoading(false)
      setPopularMovies([])
    }

    fetchHomeData(controller.signal)
      .then((data) => {
        setHomeData(data)
        setIsHomeLoading(false)
      })
      .catch(handleError)

    fetchMovies(
      { category: ALL_CATEGORY, query: '', sortBy: 'rating-desc', page: 1, perPage: POPULAR_COUNT },
      controller.signal,
    )
      .then((result) => setPopularMovies(result.items))
      .catch(handleError)

    return () => controller.abort()
  }, [attempt])

  const retryLoading = () => {
    setLoadError(null)
    setIsHomeLoading(true)
    setPopularMovies(null)
    setAttempt((prev) => prev + 1)
  }

  const reviews = [...userReviews, ...homeData.testimonials]

  const addReview = (review) => {
    reviewIdRef.current += 1
    setUserReviews((prev) => [{ id: `user-${reviewIdRef.current}`, date: todayIso(), ...review }, ...prev])
    showToast('Спасибо! Отзыв опубликован')
  }

  return (
    <>
      <HeroSection
        heading={hero.heading}
        subheading={hero.subheading}
        buttonText={hero.buttonText}
        onButtonClick={() => navigate(`/movie/${featuredMovie.id}`)}
      />

      {isPromoVisible && (
        <Container>
          <PromoBanner
            title={promo.title}
            text={promo.text}
            buttonText={promo.buttonText}
            durationSeconds={promo.durationSeconds}
            onAction={openPremium}
            onClose={() => setIsPromoVisible(false)}
          />
        </Container>
      )}

      <section className="section">
        <Container>
          <div className="home__section-head">
            <SectionHeader
              title="Популярное сейчас"
              subtitle="Фильмы с самыми высокими оценками зрителей."
              align="left"
            />
            <Link className="text-link" to="/movies?sort=rating-desc">
              Весь каталог →
            </Link>
          </div>
          {loadError ? (
            <ErrorState message={loadError} onRetry={retryLoading} />
          ) : popularMovies === null ? (
            <div className="movies-grid">
              {Array.from({ length: SKELETON_COUNT }, (_, index) => (
                <div key={index} className="skeleton skeleton--card" />
              ))}
            </div>
          ) : (
            <MovieGrid movies={popularMovies} />
          )}
        </Container>
      </section>

      {!loadError && (
        <section className="section">
          <Container>
            <SectionHeader
              title="CineVibe в цифрах"
              subtitle="Как растёт наш кинотеатр за последний месяц."
              align="left"
            />
            <div className="stats-grid">
              {isHomeLoading
                ? Array.from({ length: SKELETON_COUNT }, (_, index) => (
                    <div key={index} className="skeleton skeleton--stat" />
                  ))
                : homeData.stats.map((stat) => (
                    <StatCard
                      key={stat.id}
                      title={stat.title}
                      value={stat.value}
                      change={stat.change}
                      isPositive={stat.isPositive}
                    />
                  ))}
            </div>
          </Container>
        </section>
      )}

      <section className="section">
        <Container maxWidth={1080}>
          <SectionHeader
            title="Что говорят зрители"
            subtitle="Отзывы подписчиков, которые смотрят кино вместе с нами."
            align="center"
          />
          <ReviewForm onSubmit={addReview} />
          <div className="testimonials-grid">
            {isHomeLoading
              ? Array.from({ length: 3 }, (_, index) => <div key={index} className="skeleton skeleton--testimonial" />)
              : reviews.map((review) => (
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
        </Container>
      </section>
    </>
  )
}

export default HomePage
