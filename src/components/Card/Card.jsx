import { useCart } from '../../context/cart/useCart.js'
import { useTheme } from '../../context/theme/useTheme.js'
import { formatNumber } from '../../utils/format.js'
import { toTicket } from '../../utils/movies.js'
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
 * @property {number} id — id фильма
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
 * @property {number} ticketPrice — цена билета на показ в зале
 * @property {boolean} isFavorite — находится ли фильм в избранном
 * @property {() => void} onOpen — открыть быстрый просмотр
 * @property {(isFavorite: boolean) => void} onToggleFavorite — добавить / убрать из избранного
 */

/**
 * Карточка фильма в каталоге. Клик по любому месту карточки открывает быстрый просмотр.
 * Тема (класс оформления) и корзина билетов берутся из контекстов.
 * @param {CardProps} props
 */
function Card({
  id,
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
  ticketPrice,
  isFavorite,
  onOpen,
  onToggleFavorite,
}) {
  const { theme } = useTheme()
  const { addToCart } = useCart()

  const handleAddTicket = (event) => {
    // кнопка внутри карточки: клик не должен открывать быстрый просмотр
    event.stopPropagation()
    addToCart(toTicket({ id, title, ticketPrice, imageUrl }))
  }

  const handleKeyDown = (event) => {
    if (event.target !== event.currentTarget) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onOpen()
    }
  }

  return (
    <article
      className={`card card--${theme}`}
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
            <Button text="Подробнее" variant="outline" />
          )}
          <Button text={`+ ${formatNumber(ticketPrice)} ₸`} variant="secondary" onClick={handleAddTicket} />
        </div>
      </div>
    </article>
  )
}

export default Card
