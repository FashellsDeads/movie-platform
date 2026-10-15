import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { fetchMovie } from '../api/cinemaApi.js'
import Badge from '../components/Badge/Badge.jsx'
import Button from '../components/Button/Button.jsx'
import Container from '../components/Container/Container.jsx'
import FavoriteButton from '../components/FavoriteButton/FavoriteButton.jsx'
import MovieGrid from '../components/MovieGrid/MovieGrid.jsx'
import QuantitySelector from '../components/QuantitySelector/QuantitySelector.jsx'
import RatingStars from '../components/RatingStars/RatingStars.jsx'
import SectionHeader from '../components/SectionHeader/SectionHeader.jsx'
import { useCart } from '../context/cart/useCart.js'
import { useFavorites } from '../context/favorites/useFavorites.js'
import { movies } from '../data/movies.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { useLayout } from '../hooks/useLayout.js'
import { useToggleFavorite } from '../hooks/useToggleFavorite.js'
import { formatNumber } from '../utils/format.js'
import { toTicket } from '../utils/movies.js'
import './MovieDetailsPage.css'

const SIMILAR_COUNT = 4

/**
 * Страница фильма «/movie/:id». ДЗ №6 · #4 — id берётся из адреса через useParams.
 */
function MovieDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { isFavorite } = useFavorites()
  const toggleFavorite = useToggleFavorite()
  const { showToast } = useLayout()

  // ответ хранится вместе с id, для которого он получен: пока id не совпадает — идёт загрузка
  const [result, setResult] = useState({ id: null, movie: null })
  const isLoading = result.id !== id
  const movie = isLoading ? null : result.movie

  useEffect(() => {
    const controller = new AbortController()

    fetchMovie(Number(id), controller.signal)
      .then((found) => setResult({ id, movie: found }))
      .catch((error) => {
        if (error.name === 'AbortError') return
        console.error(error)
        setResult({ id, movie: null })
      })

    return () => controller.abort()
  }, [id])

  useDocumentTitle(isLoading ? 'Загрузка фильма' : movie ? `${movie.title} — смотреть онлайн` : 'Фильм не найден')

  const handleAddTickets = (quantity) => {
    addToCart(toTicket(movie), quantity)
    showToast(`Билеты на «${movie.title}» добавлены: ${quantity} шт.`)
  }

  // navigate(-1) — шаг назад по истории; если страницу открыли по прямой ссылке, ведём в каталог
  const goBack = () => (window.history.length > 1 ? navigate(-1) : navigate('/movies'))

  if (isLoading) {
    return (
      <section className="page">
        <Container>
          <div className="movie-details movie-details--loading" role="status" aria-label="Загружаем фильм">
            <div className="skeleton movie-details__poster-skeleton" />
            <div className="movie-details__info">
              <div className="skeleton movie-details__line-skeleton" />
              <div className="skeleton movie-details__line-skeleton movie-details__line-skeleton--short" />
            </div>
          </div>
        </Container>
      </section>
    )
  }

  if (!movie) {
    return (
      <section className="page">
        <Container>
          <div className="empty-state">
            <p className="empty-state__title">Фильм не найден</p>
            <p className="empty-state__text">Фильма с номером «{id}» нет в каталоге. Возможно, ссылка устарела.</p>
            <div className="empty-state__actions">
              <Link className="link-button link-button--primary" to="/movies">
                Открыть каталог
              </Link>
              <Link className="link-button link-button--outline" to="/">
                На главную
              </Link>
            </div>
          </div>
        </Container>
      </section>
    )
  }

  const similarMovies = movies
    .filter((item) => item.genre === movie.genre && item.id !== movie.id)
    .slice(0, SIMILAR_COUNT)

  return (
    <section className="page">
      <Container>
        <div className="page__back">
          <Button text="← Назад" variant="outline" onClick={goBack} />
        </div>

        <article className="movie-details">
          <div className="movie-details__poster">
            <img src={movie.imageUrl} alt={`Постер фильма «${movie.title}»`} />
            <div className="movie-details__favorite">
              {/* key: при переходе на другой фильм кнопка создаётся заново со своим состоянием */}
              <FavoriteButton
                key={movie.id}
                initialIsFavorite={isFavorite(movie.id)}
                onToggle={(nextIsFavorite) => toggleFavorite(movie, nextIsFavorite)}
              />
            </div>
          </div>

          <div className="movie-details__info">
            <div className="movie-details__meta">
              <Badge label={movie.status.label} colorScheme={movie.status.colorScheme} />
              <span>
                {movie.year} · {movie.genre} · {movie.duration}
              </span>
            </div>
            <h1 className="movie-details__title">{movie.title}</h1>
            <RatingStars score={movie.score} reviewsCount={movie.reviewsCount} />
            <p className="movie-details__description">{movie.description}</p>

            <p className="movie-details__availability">
              {movie.isAvailable
                ? 'Доступен онлайн по подписке Premium в 4K.'
                : 'Скоро появится онлайн — а пока его можно посмотреть в зале CineVibe Hall.'}
            </p>

            <QuantitySelector
              key={movie.id}
              unitPrice={movie.ticketPrice}
              label={`Билеты в зал · ${formatNumber(movie.ticketPrice)} ₸`}
              confirmText="В мои билеты"
              onConfirm={handleAddTickets}
            />

            <Link className="text-link" to="/tickets">
              Перейти к моим билетам →
            </Link>
          </div>
        </article>
      </Container>

      {similarMovies.length > 0 && (
        <Container>
          <div className="movie-details__similar">
            <SectionHeader title="Похожие фильмы" subtitle={`Ещё из жанра «${movie.genre}».`} align="left" />
            <MovieGrid movies={similarMovies} />
          </div>
        </Container>
      )}
    </section>
  )
}

export default MovieDetailsPage
