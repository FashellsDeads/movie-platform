import { Link } from 'react-router-dom'
import Container from '../components/Container/Container.jsx'
import MovieGrid from '../components/MovieGrid/MovieGrid.jsx'
import SectionHeader from '../components/SectionHeader/SectionHeader.jsx'
import { useFavorites } from '../context/favorites/useFavorites.js'
import { movies } from '../data/movies.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { pluralize } from '../utils/format.js'

/**
 * Страница «/favorites» — фильмы, отмеченные сердечком на любой странице.
 */
function FavoritesPage() {
  useDocumentTitle('Избранное')
  const { favoriteIds } = useFavorites()

  // порядок — как в избранном: последний добавленный в конце
  const favoriteMovies = favoriteIds.map((id) => movies.find((movie) => movie.id === id)).filter(Boolean)
  const count = favoriteMovies.length

  return (
    <section className="page">
      <Container>
        <SectionHeader
          title="Избранное"
          subtitle={
            count > 0
              ? `${count} ${pluralize(count, ['фильм', 'фильма', 'фильмов'])}, к которым хочется вернуться.`
              : 'Отмечайте фильмы сердечком — они появятся здесь.'
          }
          align="left"
        />

        {count > 0 ? (
          <MovieGrid movies={favoriteMovies} />
        ) : (
          <div className="empty-state">
            <p className="empty-state__title">Пока пусто</p>
            <p className="empty-state__text">Нажмите ♡ на постере любого фильма, чтобы сохранить его в избранное.</p>
            <Link className="link-button link-button--primary" to="/movies">
              Перейти в каталог
            </Link>
          </div>
        )}
      </Container>
    </section>
  )
}

export default FavoritesPage
