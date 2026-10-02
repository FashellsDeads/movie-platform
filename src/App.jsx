import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchHomeData, fetchMovies } from './api/cinemaApi.js'
import Button from './components/Button/Button.jsx'
import Card from './components/Card/Card.jsx'
import CategoryFilter from './components/CategoryFilter/CategoryFilter.jsx'
import Container from './components/Container/Container.jsx'
import Footer from './components/Footer/Footer.jsx'
import Header from './components/Header/Header.jsx'
import HeroSection from './components/HeroSection/HeroSection.jsx'
import Modal from './components/Modal/Modal.jsx'
import Pagination from './components/Pagination/Pagination.jsx'
import PromoBanner from './components/PromoBanner/PromoBanner.jsx'
import QuickViewModal from './components/QuickViewModal/QuickViewModal.jsx'
import ScrollProgress from './components/ScrollProgress/ScrollProgress.jsx'
import SearchBar from './components/SearchBar/SearchBar.jsx'
import SectionHeader from './components/SectionHeader/SectionHeader.jsx'
import SortDropdown from './components/SortDropdown/SortDropdown.jsx'
import StatCard from './components/StatCard/StatCard.jsx'
import TestimonialCard from './components/TestimonialCard/TestimonialCard.jsx'
import Toast from './components/Toast/Toast.jsx'
import { ALL_CATEGORY, MOVIES_PER_PAGE, movies, sortOptions } from './data/movies.js'
import { SITE_NAME, currentUser, hero, navItems, premiumBenefits, promo, socialLinks } from './data/site.js'
import { STORAGE_KEYS, readFromStorage, writeToStorage } from './utils/storage.js'
import './App.css'

const featuredMovie = movies[0]
const copyrightText = `© ${new Date().getFullYear()} ${SITE_NAME}. Все права защищены.`
const SEARCH_DEBOUNCE_MS = 500
const SKELETON_COUNT = 4

const hasSavedTheme = () => readFromStorage(STORAGE_KEYS.theme, null) !== null

function App() {
  // ДЗ №3 — состояния интерфейса
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('rating-desc')
  const [favoriteIds, setFavoriteIds] = useState([])
  const [isPremiumOpen, setIsPremiumOpen] = useState(false)

  // ДЗ №4 — данные с «сервера», отложенный поиск, уведомления
  const [homeData, setHomeData] = useState({ categories: [ALL_CATEGORY], stats: [], testimonials: [] })
  const [isHomeLoading, setIsHomeLoading] = useState(true)
  // requestKey — параметры, для которых получен ответ: пока он не совпадает с текущими, идёт загрузка
  const [catalog, setCatalog] = useState({ requestKey: null, items: [], total: 0, totalPages: 0 })
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [isStorageReady, setIsStorageReady] = useState(false)
  const [isPromoVisible, setIsPromoVisible] = useState(true)
  const [toast, setToast] = useState(null)

  const catalogRef = useRef(null)
  const previousPageRef = useRef(currentPage)
  const toastIdRef = useRef(0)

  const catalogParams = {
    category: selectedCategory,
    query: debouncedQuery,
    sortBy,
    page: currentPage,
    perPage: MOVIES_PER_PAGE,
  }
  const catalogRequestKey = JSON.stringify(catalogParams)
  const isCatalogLoading = catalog.requestKey !== catalogRequestKey

  // #1 — первичная загрузка данных главной страницы при монтировании
  useEffect(() => {
    const controller = new AbortController()

    fetchHomeData(controller.signal)
      .then((data) => {
        setHomeData(data)
        setIsHomeLoading(false)
      })
      .catch((error) => {
        if (error.name === 'AbortError') return
        console.error(error)
        setIsHomeLoading(false)
      })

    return () => controller.abort()
  }, [])

  // #3 — при старте восстанавливаем избранное и выбранную тему из localStorage
  useEffect(() => {
    // по заданию данные читаются именно в эффекте при монтировании
    // oxlint-disable-next-line react/set-state-in-effect
    setFavoriteIds(readFromStorage(STORAGE_KEYS.favorites, []))
    const savedTheme = readFromStorage(STORAGE_KEYS.theme, null)
    if (savedTheme) setIsDarkMode(savedTheme === 'dark')
    setIsStorageReady(true)
  }, [])

  // #2 — синхронизируем избранное с localStorage при каждом изменении
  // (только после чтения, чтобы не затереть сохранённое пустым массивом)
  useEffect(() => {
    if (!isStorageReady) return
    writeToStorage(STORAGE_KEYS.favorites, favoriteIds)
  }, [favoriteIds, isStorageReady])

  // #15 — тема по настройкам ОС, пока пользователь не выбрал её сам
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    // начальная синхронизация с внешней системой (настройками ОС)
    // oxlint-disable-next-line react/set-state-in-effect
    if (!hasSavedTheme()) setIsDarkMode(media.matches)

    const handleChange = (event) => {
      if (!hasSavedTheme()) setIsDarkMode(event.matches)
    }

    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [])

  // #4 — заголовок вкладки зависит от открытого фильма и выбранного жанра
  useEffect(() => {
    if (isModalOpen && selectedMovie) {
      document.title = `${selectedMovie.title} — смотреть онлайн | ${SITE_NAME}`
    } else if (selectedCategory !== ALL_CATEGORY) {
      document.title = `Каталог — ${selectedCategory} | ${SITE_NAME}`
    } else {
      document.title = `${SITE_NAME} — онлайн-кинотеатр`
    }
  }, [isModalOpen, selectedMovie, selectedCategory])

  // #5 — debounce: запрос уходит через 500 мс после того, как пользователь перестал печатать
  useEffect(() => {
    const timerId = setTimeout(() => setDebouncedQuery(searchQuery.trim()), SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(timerId)
  }, [searchQuery])

  // #9 — каталог перезапрашивается при смене жанра, страницы, поиска или сортировки
  // #13 — AbortController отменяет предыдущий незавершённый запрос (защита от гонки)
  useEffect(() => {
    const controller = new AbortController()
    const params = JSON.parse(catalogRequestKey)

    fetchMovies(params, controller.signal)
      .then((result) => setCatalog({ requestKey: catalogRequestKey, ...result }))
      .catch((error) => {
        if (error.name === 'AbortError') return
        console.error(error)
        setCatalog({ requestKey: catalogRequestKey, items: [], total: 0, totalPages: 0 })
      })

    return () => controller.abort()
  }, [catalogRequestKey])

  // #10 — при переключении страницы прокручиваем к началу каталога
  useEffect(() => {
    if (previousPageRef.current === currentPage) return
    previousPageRef.current = currentPage
    catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [currentPage])

  const logoSrc = isDarkMode ? '/logo.svg' : '/logo-light.svg'
  const isSearchPending = searchQuery.trim() !== debouncedQuery
  const showSkeletons = isCatalogLoading && catalog.items.length === 0
  const isCatalogEmpty = !isCatalogLoading && !isSearchPending && catalog.items.length === 0

  const toggleTheme = () => {
    const nextIsDark = !isDarkMode
    setIsDarkMode(nextIsDark)
    writeToStorage(STORAGE_KEYS.theme, nextIsDark ? 'dark' : 'light')
  }

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

  // useCallback — чтобы эффекты Modal и Toast не переподписывались на каждый рендер
  const closeMovie = useCallback(() => setIsModalOpen(false), [])
  const closePremium = useCallback(() => setIsPremiumOpen(false), [])
  const hideToast = useCallback(() => setToast(null), [])

  const toggleFavorite = (movie, isFavorite) => {
    setFavoriteIds((prev) => (isFavorite ? [...prev, movie.id] : prev.filter((id) => id !== movie.id)))
    toastIdRef.current += 1
    setToast({
      id: toastIdRef.current,
      text: isFavorite ? `«${movie.title}» добавлен в избранное` : `«${movie.title}» убран из избранного`,
    })
  }

  return (
    <div className={`app ${isDarkMode ? 'theme-dark' : 'theme-light'}`}>
      <ScrollProgress />

      <Header
        navItems={navItems}
        user={currentUser}
        logoSrc={logoSrc}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
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

        {isPromoVisible && (
          <Container>
            <PromoBanner
              title={promo.title}
              text={promo.text}
              buttonText={promo.buttonText}
              durationSeconds={promo.durationSeconds}
              onAction={() => setIsPremiumOpen(true)}
              onClose={() => setIsPromoVisible(false)}
            />
          </Container>
        )}

        <section id="stats" className="section">
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

        <section id="catalog" className="section" ref={catalogRef}>
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
              categories={homeData.categories}
              activeCategory={selectedCategory}
              onSelect={handleCategorySelect}
            />

            <p className="catalog-status" aria-live="polite">
              {isSearchPending || isCatalogLoading
                ? 'Загружаем фильмы…'
                : `Найдено фильмов: ${catalog.total}`}
            </p>

            {showSkeletons && (
              <div className="movies-grid">
                {Array.from({ length: SKELETON_COUNT }, (_, index) => (
                  <div key={index} className="skeleton skeleton--card" />
                ))}
              </div>
            )}

            {!showSkeletons && !isCatalogEmpty && (
              <div className={`movies-grid${isCatalogLoading ? ' movies-grid--loading' : ''}`}>
                {catalog.items.map((movie) => (
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
                    onToggleFavorite={(isFavorite) => toggleFavorite(movie, isFavorite)}
                  />
                ))}
              </div>
            )}

            {isCatalogEmpty && (
              <div className="catalog-empty">
                <p className="catalog-empty__title">Ничего не нашлось</p>
                <p className="catalog-empty__text">
                  По запросу «{searchQuery}» в жанре «{selectedCategory}» фильмов нет.
                </p>
                <Button text="Сбросить фильтры" variant="secondary" onClick={resetCatalog} />
              </div>
            )}

            <Pagination currentPage={currentPage} totalPages={catalog.totalPages} onPageChange={setCurrentPage} />
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
              {isHomeLoading
                ? Array.from({ length: 3 }, (_, index) => (
                    <div key={index} className="skeleton skeleton--testimonial" />
                  ))
                : homeData.testimonials.map((review) => (
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

      <Toast toast={toast} onClose={hideToast} />
    </div>
  )
}

export default App
