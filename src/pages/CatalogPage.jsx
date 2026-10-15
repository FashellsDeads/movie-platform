import { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchMovies } from '../api/cinemaApi.js'
import Button from '../components/Button/Button.jsx'
import CategoryFilter from '../components/CategoryFilter/CategoryFilter.jsx'
import Container from '../components/Container/Container.jsx'
import ErrorState from '../components/ErrorState/ErrorState.jsx'
import MovieGrid from '../components/MovieGrid/MovieGrid.jsx'
import Pagination from '../components/Pagination/Pagination.jsx'
import SearchBar from '../components/SearchBar/SearchBar.jsx'
import SectionHeader from '../components/SectionHeader/SectionHeader.jsx'
import SortDropdown from '../components/SortDropdown/SortDropdown.jsx'
import { ALL_CATEGORY, MOVIES_PER_PAGE, categories, sortOptions } from '../data/movies.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import './CatalogPage.css'

const SEARCH_DEBOUNCE_MS = 500
const SKELETON_COUNT = 4
const DEFAULT_SORT = 'rating-desc'
const isKnownSort = (value) => sortOptions.some((option) => option.value === value)

/**
 * Каталог «/movies». ДЗ №6 · #5 — все фильтры живут в адресе:
 * /movies?genre=Драма&q=дюна&sort=year-desc&page=2 — такой ссылкой можно поделиться,
 * а кнопка «Назад» возвращает предыдущие фильтры.
 */
function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  // Значения читаются из URL при каждом рендере, у некорректных — значения по умолчанию
  const genre = categories.includes(searchParams.get('genre')) ? searchParams.get('genre') : ALL_CATEGORY
  const query = searchParams.get('q') ?? ''
  const sortBy = isKnownSort(searchParams.get('sort')) ? searchParams.get('sort') : DEFAULT_SORT
  const page = Math.max(1, Number.parseInt(searchParams.get('page') ?? '1', 10) || 1)

  useDocumentTitle(genre === ALL_CATEGORY ? 'Фильмы' : `Фильмы — ${genre}`)

  /**
   * Меняет часть параметров адреса; null или значение по умолчанию убирают параметр,
   * чтобы ссылка оставалась короткой.
   */
  const updateParams = useCallback(
    (changes, options) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        Object.entries(changes).forEach(([key, value]) => {
          if (value === null || value === '') next.delete(key)
          else next.set(key, String(value))
        })
        return next
      }, options)
    },
    [setSearchParams],
  )

  // Текст в поле поиска меняется на каждую букву, а в адрес попадает после паузы (debounce).
  // Если адрес сменился снаружи (кнопка «Назад»), поле подстраивается под него.
  const [searchInput, setSearchInput] = useState(query)
  const [syncedQuery, setSyncedQuery] = useState(query)
  if (query !== syncedQuery) {
    setSyncedQuery(query)
    setSearchInput(query)
  }

  // ДЗ №4 · #5 — debounce: параметр q обновляется через 500 мс после окончания ввода
  useEffect(() => {
    const trimmed = searchInput.trim()
    if (trimmed === query) return

    // replace: каждая буква не должна становиться отдельной записью в истории браузера
    const timerId = setTimeout(() => updateParams({ q: trimmed, page: null }, { replace: true }), SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(timerId)
  }, [searchInput, query, updateParams])

  // ДЗ №4 · #9 + #13 — загрузка страницы каталога при смене параметров, устаревший запрос отменяется
  // attempt — номер попытки: «Повторить» после ошибки меняет ключ и запускает запрос заново
  const [attempt, setAttempt] = useState(0)
  const catalogRequestKey = JSON.stringify({ category: genre, query, sortBy, page, perPage: MOVIES_PER_PAGE, attempt })
  const [catalog, setCatalog] = useState({ requestKey: null, items: [], total: 0, totalPages: 0, error: null })
  const isCatalogLoading = catalog.requestKey !== catalogRequestKey
  const loadError = isCatalogLoading ? null : catalog.error

  useEffect(() => {
    const controller = new AbortController()

    fetchMovies(JSON.parse(catalogRequestKey), controller.signal)
      .then((result) => setCatalog({ requestKey: catalogRequestKey, ...result, error: null }))
      .catch((error) => {
        if (error.name === 'AbortError') return
        setCatalog({ requestKey: catalogRequestKey, items: [], total: 0, totalPages: 0, error: error.message })
      })

    return () => controller.abort()
  }, [catalogRequestKey])

  // ?page=7 при трёх страницах (старая ссылка, фильтр сузил выдачу) — переходим на последнюю существующую
  const lastPage = catalog.totalPages
  const isPageOutOfRange = !isCatalogLoading && lastPage > 0 && page > lastPage
  useEffect(() => {
    if (isPageOutOfRange) updateParams({ page: lastPage === 1 ? null : lastPage }, { replace: true })
  }, [isPageOutOfRange, lastPage, updateParams])

  // ДЗ №4 · #10 — при смене страницы каталога возвращаемся к его началу
  const previousPageRef = useRef(page)
  useEffect(() => {
    if (previousPageRef.current === page) return
    previousPageRef.current = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [page])

  const isSearchPending = searchInput.trim() !== query
  const showSkeletons = isCatalogLoading && catalog.items.length === 0
  const isCatalogEmpty = !isCatalogLoading && !isSearchPending && !loadError && catalog.items.length === 0

  let statusText = `Найдено фильмов: ${catalog.total}`
  if (isSearchPending || isCatalogLoading) statusText = 'Загружаем фильмы…'
  else if (loadError) statusText = 'Каталог не загрузился'

  return (
    <section className="page">
      <Container>
        <SectionHeader
          title="Каталог фильмов"
          subtitle="Выберите жанр — и мы покажем лучшее из нашей коллекции."
          align="left"
        />

        <div className="catalog-toolbar">
          <SearchBar value={searchInput} onChange={setSearchInput} />
          <SortDropdown
            options={sortOptions}
            value={sortBy}
            onChange={(value) => updateParams({ sort: value === DEFAULT_SORT ? null : value, page: null })}
          />
        </div>

        <CategoryFilter
          categories={categories}
          activeCategory={genre}
          onSelect={(category) => updateParams({ genre: category === ALL_CATEGORY ? null : category, page: null })}
        />

        <p className="catalog-status" aria-live="polite">
          {statusText}
        </p>

        {showSkeletons && (
          <div className="movies-grid">
            {Array.from({ length: SKELETON_COUNT }, (_, index) => (
              <div key={index} className="skeleton skeleton--card" />
            ))}
          </div>
        )}

        {loadError && <ErrorState message={loadError} onRetry={() => setAttempt((prev) => prev + 1)} />}

        {!showSkeletons && !isCatalogEmpty && !loadError && (
          <MovieGrid movies={catalog.items} isLoading={isCatalogLoading} />
        )}

        {isCatalogEmpty && (
          <div className="empty-state">
            <p className="empty-state__title">Ничего не нашлось</p>
            <p className="empty-state__text">
              {query ? `По запросу «${query}»` : 'По этим условиям'} в жанре «{genre}» фильмов нет.
            </p>
            <Button text="Сбросить фильтры" variant="secondary" onClick={() => setSearchParams({})} />
          </div>
        )}

        <Pagination
          currentPage={page}
          totalPages={catalog.totalPages}
          onPageChange={(nextPage) => updateParams({ page: nextPage === 1 ? null : nextPage })}
        />
      </Container>
    </section>
  )
}

export default CatalogPage
