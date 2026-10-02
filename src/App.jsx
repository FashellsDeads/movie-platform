import { useState } from 'react'
import Button from './components/Button/Button.jsx'
import Card from './components/Card/Card.jsx'
import CategoryFilter from './components/CategoryFilter/CategoryFilter.jsx'
import Container from './components/Container/Container.jsx'
import Footer from './components/Footer/Footer.jsx'
import Header from './components/Header/Header.jsx'
import HeroSection from './components/HeroSection/HeroSection.jsx'
import Modal from './components/Modal/Modal.jsx'
import Pagination from './components/Pagination/Pagination.jsx'
import QuickViewModal from './components/QuickViewModal/QuickViewModal.jsx'
import SearchBar from './components/SearchBar/SearchBar.jsx'
import SectionHeader from './components/SectionHeader/SectionHeader.jsx'
import SortDropdown from './components/SortDropdown/SortDropdown.jsx'
import StatCard from './components/StatCard/StatCard.jsx'
import TestimonialCard from './components/TestimonialCard/TestimonialCard.jsx'
import { ALL_CATEGORY, MOVIES_PER_PAGE, categories, movies, sortOptions } from './data/movies.js'
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
import { searchMovies, sortMovies } from './utils/movies.js'
import './App.css'

const featuredMovie = movies[0]
const copyrightText = `© ${new Date().getFullYear()} ${SITE_NAME}. Все права защищены.`

function App() {
  // ДЗ №3 — состояния приложения
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('rating-desc')
  const [favoriteIds, setFavoriteIds] = useState([])
  const [isPremiumOpen, setIsPremiumOpen] = useState(false)

  // Каталог: жанр → поиск → сортировка → текущая страница
  const moviesInCategory =
    selectedCategory === ALL_CATEGORY
      ? movies
      : movies.filter((movie) => movie.genre === selectedCategory)
  const foundMovies = sortMovies(searchMovies(moviesInCategory, searchQuery), sortBy)
  const totalPages = Math.ceil(foundMovies.length / MOVIES_PER_PAGE)
  const pageStart = (currentPage - 1) * MOVIES_PER_PAGE
  const visibleMovies = foundMovies.slice(pageStart, pageStart + MOVIES_PER_PAGE)

  const logoSrc = isDarkMode ? '/logo.svg' : '/logo-light.svg'

  // При смене условий каталога возвращаемся на первую страницу
  const handleSearchChange = (query) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
    setCurrentPage(1)
  }

  const handleSortChange = (value) => {
    setSortBy(value)
    setCurrentPage(1)
  }

  const resetCatalog = () => {
    setSearchQuery('')
    setSelectedCategory(ALL_CATEGORY)
    setCurrentPage(1)
  }

  const openMovie = (movie) => {
    setSelectedMovie(movie)
    setIsModalOpen(true)
  }

  const closeMovie = () => setIsModalOpen(false)

  const toggleFavorite = (movieId, isFavorite) => {
    setFavoriteIds((prev) => (isFavorite ? [...prev, movieId] : prev.filter((id) => id !== movieId)))
  }

  const closePremium = () => setIsPremiumOpen(false)

  return (
    <div className={`app ${isDarkMode ? 'theme-dark' : 'theme-light'}`}>
      <Header
        navItems={navItems}
        user={currentUser}
        logoSrc={logoSrc}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode((prev) => !prev)}
        favoritesCount={favoriteIds.length}
        onPremiumClick={() => setIsPremiumOpen(true)}
      />

      <main>
        <HeroSection
          heading={hero.heading}
          subheading={hero.subheading}
          buttonText={hero.buttonText}
          onButtonClick={() => openMovie(featuredMovie)}
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

            <div className="catalog-toolbar">
              <SearchBar value={searchQuery} onChange={handleSearchChange} />
              <SortDropdown options={sortOptions} value={sortBy} onChange={handleSortChange} />
            </div>

            <CategoryFilter
              categories={categories}
              activeCategory={selectedCategory}
              onSelect={handleCategorySelect}
            />

            {visibleMovies.length > 0 ? (
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
                    isFavorite={favoriteIds.includes(movie.id)}
                    onOpen={() => openMovie(movie)}
                    onToggleFavorite={(isFavorite) => toggleFavorite(movie.id, isFavorite)}
                  />
                ))}
              </div>
            ) : (
              <div className="catalog-empty">
                <p className="catalog-empty__title">Ничего не нашлось</p>
                <p className="catalog-empty__text">
                  По запросу «{searchQuery}» в жанре «{selectedCategory}» фильмов нет.
                </p>
                <Button text="Сбросить фильтры" variant="secondary" onClick={resetCatalog} />
              </div>
            )}

            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
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

      <Footer copyrightText={copyrightText} socialLinks={socialLinks} logoSrc={logoSrc} />

      <QuickViewModal isOpen={isModalOpen} movie={selectedMovie} onClose={closeMovie} />

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
