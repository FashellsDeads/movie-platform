import { Link, useNavigate } from 'react-router-dom'
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
 * @property {number} id — id фильма (из него строится адрес /movie/:id)
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
 * @property {(isFavorite: boolean) => void} onToggleFavorite — добавить / убрать из избранного
 */

/**
 * Карточка фильма. Название — ссылка на страницу фильма, растянутая на всю карточку,
 * поэтому кликабельна вся карточка (ДЗ №6). Тема и корзина берутся из контекстов.
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
  onToggleFavorite,
}) {
  const { theme } = useTheme()
  const { addToCart } = useCart()
  const navigate = useNavigate()
  const moviePath = `/movie/${id}`

  const handleAddTicket = () => {
    addToCart(toTicket({ id, title, ticketPrice, imageUrl }))
  }

  return (
    <article className={`card card--${theme}`}>
      <div className="card__poster">
        <img src={imageUrl} alt="" loading="lazy" />
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
        <h3 className="card__title">
          <Link className="card__link" to={moviePath}>
            {title}
          </Link>
        </h3>
        <RatingStars score={score} reviewsCount={reviewsCount} />
        <p className="card__description">{description}</p>

        <div className="card__actions">
          {isAvailable ? (
            <Button text="Смотреть" variant="primary" onClick={() => navigate(moviePath)} />
          ) : (
            <Button text="Скоро онлайн" variant="outline" isDisabled />
          )}
          <Button text={`+ ${formatNumber(ticketPrice)} ₸`} variant="secondary" onClick={handleAddTicket} />
        </div>
      </div>
    </article>
  )
}

export default Card
