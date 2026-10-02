import Badge from '../Badge/Badge.jsx'
import Button from '../Button/Button.jsx'
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
 * @property {() => void} onWatch — открыть просмотр фильма
 */

/**
 * Карточка фильма в каталоге.
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
  onWatch,
}) {
  return (
    <article className="card">
      <div className="card__poster">
        <img src={imageUrl} alt={`Постер фильма «${title}»`} loading="lazy" />
        <div className="card__badge">
          <Badge label={status.label} colorScheme={status.colorScheme} />
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
          {isAvailable ? (
            <Button text="Смотреть" variant="primary" onClick={onWatch} />
          ) : (
            <Button text="Скоро на CineVibe" variant="outline" isDisabled />
          )}
        </div>
      </div>
    </article>
  )
}

export default Card
