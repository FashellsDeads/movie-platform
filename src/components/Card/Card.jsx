import Badge from '../Badge/Badge.jsx'
import Button from '../Button/Button.jsx'
import FavoriteButton from '../FavoriteButton/FavoriteButton.jsx'
import RatingStars from '../RatingStars/RatingStars.jsx'
import './Card.css'

/**
 * @typedef {Object} MovieStatus
 * @property {string} label — текст статуса
 * @property {'green' | 'red' | 'yellow'} colorScheme — цвет бейджа
 */

/**
 * @typedef {Object} CardProps
 * @property {string} title — название фильма
 * @property {string} description — краткое описание сюжета
 * @property {string} imageUrl — постер
 * @property {number} year — год выхода
 * @property {string} genre — жанр
 * @property {string} duration — продолжительность
 * @property {number} score — оценка зрителей (1–5)
 * @property {number} reviewsCount — количество отзывов
 * @property {MovieStatus} status — статус для бейджа
 * @property {boolean} isAvailable — можно ли смотреть фильм уже сейчас
 * @property {boolean} isFavorite — находится ли фильм в избранном
 * @property {() => void} onOpen — открыть быстрый просмотр
 * @property {(isFavorite: boolean) => void} onToggleFavorite — добавить / убрать из избранного
 */

/**
 * Карточка фильма в каталоге. Клик по любому месту карточки открывает быстрый просмотр.
 * @param {CardProps} props
 */
function Card({
  title,
  description,
  imageUrl,
  year,
  genre,
  duration,
  score,
  reviewsCount,
  status,
  isAvailable,
  isFavorite,
  onOpen,
  onToggleFavorite,
}) {
  const handleKeyDown = (event) => {
    if (event.target !== event.currentTarget) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onOpen()
    }
  }

  return (
    <article
      className="card"
      tabIndex={0}
      aria-label={`${title}, открыть подробности`}
      onClick={onOpen}
      onKeyDown={handleKeyDown}
    >
      <div className="card__poster">
        <img src={imageUrl} alt={`Постер фильма «${title}»`} loading="lazy" />
        <div className="card__badge">
          <Badge label={status.label} colorScheme={status.colorScheme} />
        </div>
        <div className="card__favorite">
          <FavoriteButton initialIsFavorite={isFavorite} onToggle={onToggleFavorite} />
        </div>
      </div>

      <div className="card__body">
        <p className="card__meta">
          {year} · {genre} · {duration}
        </p>
        <h3 className="card__title">{title}</h3>
        <RatingStars score={score} reviewsCount={reviewsCount} />
        <p className="card__description">{description}</p>

        <div className="card__actions">
          {/* клик по кнопке всплывает до карточки и открывает быстрый просмотр */}
          {isAvailable ? (
            <Button text="Смотреть" variant="primary" />
          ) : (
            <Button text="Билеты на премьеру" variant="outline" />
          )}
        </div>
      </div>
    </article>
  )
}

export default Card
