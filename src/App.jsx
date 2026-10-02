import { useState } from 'react'
import Badge from './components/Badge/Badge.jsx'
import Button from './components/Button/Button.jsx'
import Card from './components/Card/Card.jsx'
import CategoryFilter from './components/CategoryFilter/CategoryFilter.jsx'
import Container from './components/Container/Container.jsx'
import Footer from './components/Footer/Footer.jsx'
import Header from './components/Header/Header.jsx'
import HeroSection from './components/HeroSection/HeroSection.jsx'
import Modal from './components/Modal/Modal.jsx'
import RatingStars from './components/RatingStars/RatingStars.jsx'
import SectionHeader from './components/SectionHeader/SectionHeader.jsx'
import StatCard from './components/StatCard/StatCard.jsx'
import TestimonialCard from './components/TestimonialCard/TestimonialCard.jsx'
import { ALL_CATEGORY, categories, movies } from './data/movies.js'
import {
  SITE_NAME,
  currentUser,
  hero,
  navItems,
  premiumBenefits,
  socialLinks,
  stats,
} from './data/site.js'
import { testimonials } from './data/testimonials.js'
import './App.css'

const featuredMovie = movies[0]
const copyrightText = `© ${new Date().getFullYear()} ${SITE_NAME}. Все права защищены.`

function App() {
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY)
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [isPremiumOpen, setIsPremiumOpen] = useState(false)

  const visibleMovies =
    activeCategory === ALL_CATEGORY
      ? movies
      : movies.filter((movie) => movie.genre === activeCategory)

  const closeMovie = () => setSelectedMovie(null)
  const closePremium = () => setIsPremiumOpen(false)

  return (
    <div className="app">
      <Header navItems={navItems} user={currentUser} onPremiumClick={() => setIsPremiumOpen(true)} />

      <main>
        <HeroSection
          heading={hero.heading}
          subheading={hero.subheading}
          buttonText={hero.buttonText}
          onButtonClick={() => setSelectedMovie(featuredMovie)}
        />

        <section id="stats" className="section">
          <Container>
            <SectionHeader
              title="CineVibe в цифрах"
              subtitle="Как растёт наш кинотеатр за последний месяц."
              align="left"
            />
            <div className="stats-grid">
              {stats.map((stat) => (
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

        <section id="catalog" className="section">
          <Container>
            <SectionHeader
              title="Каталог фильмов"
              subtitle="Выберите жанр — и мы покажем лучшее из нашей коллекции."
              align="left"
            />
            <CategoryFilter
              categories={categories}
              activeCategory={activeCategory}
              onSelect={setActiveCategory}
            />
            <div className="movies-grid">
              {visibleMovies.map((movie) => (
                <Card
                  key={movie.id}
                  title={movie.title}
                  description={movie.description}
                  imageUrl={movie.imageUrl}
                  year={movie.year}
                  genre={movie.genre}
                  duration={movie.duration}
                  score={movie.score}
                  reviewsCount={movie.reviewsCount}
                  status={movie.status}
                  isAvailable={movie.isAvailable}
                  onWatch={() => setSelectedMovie(movie)}
                />
              ))}
            </div>
          </Container>
        </section>

        <section id="reviews" className="section">
          <Container maxWidth={1080}>
            <SectionHeader
              title="Что говорят зрители"
              subtitle="Отзывы подписчиков, которые смотрят кино вместе с нами."
              align="center"
            />
            <div className="testimonials-grid">
              {testimonials.map((review) => (
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
      </main>

      <Footer copyrightText={copyrightText} socialLinks={socialLinks} />

      <Modal isOpen={selectedMovie !== null} title={selectedMovie?.title ?? ''} onClose={closeMovie}>
        {selectedMovie && (
          <div className="movie-preview">
            <div className="movie-preview__player" style={{ backgroundImage: `url("${selectedMovie.imageUrl}")` }}>
              <span className="movie-preview__play" aria-hidden="true">▶</span>
            </div>
            <div className="movie-preview__meta">
              <Badge label={selectedMovie.status.label} colorScheme={selectedMovie.status.colorScheme} />
              <span>
                {selectedMovie.year} · {selectedMovie.genre} · {selectedMovie.duration}
              </span>
            </div>
            <RatingStars score={selectedMovie.score} reviewsCount={selectedMovie.reviewsCount} />
            <p className="movie-preview__description">{selectedMovie.description}</p>
            <Button text="Начать просмотр" variant="primary" onClick={closeMovie} />
          </div>
        )}
      </Modal>

      <Modal isOpen={isPremiumOpen} title={`${SITE_NAME} Premium`} onClose={closePremium}>
        <div className="premium">
          <p className="premium__price">
            2 490 ₸ <span>/ месяц</span>
          </p>
          <ul className="premium__list">
            {premiumBenefits.map((benefit) => (
              <li key={benefit}>{benefit}</li>
            ))}
          </ul>
          <div className="premium__actions">
            <Button text="Оформить подписку" variant="primary" onClick={closePremium} />
            <Button text="Позже" variant="outline" onClick={closePremium} />
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default App
