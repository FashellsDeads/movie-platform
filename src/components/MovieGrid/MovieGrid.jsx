import { useFavorites } from '../../context/favorites/useFavorites.js'
import { useToggleFavorite } from '../../hooks/useToggleFavorite.js'
import Card from '../Card/Card.jsx'

/**
 * @typedef {Object} MovieGridProps
 * @property {Array<Object>} movies — фильмы для показа
 * @property {boolean} [isLoading=false] — идёт ли обновление (сетка становится полупрозрачной)
 */

/**
 * Сетка карточек фильмов. Избранное берёт из FavoritesContext.
 * @param {MovieGridProps} props
 */
function MovieGrid({ movies, isLoading = false }) {
  const { isFavorite } = useFavorites()
  const toggleFavorite = useToggleFavorite()

  return (
    <div className={`movies-grid${isLoading ? ' movies-grid--loading' : ''}`}>
      {movies.map((movie) => (
        <Card
          key={movie.id}
          id={movie.id}
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
          ticketPrice={movie.ticketPrice}
          isFavorite={isFavorite(movie.id)}
          onToggleFavorite={(nextIsFavorite) => toggleFavorite(movie, nextIsFavorite)}
        />
      ))}
    </div>
  )
}

export default MovieGrid
