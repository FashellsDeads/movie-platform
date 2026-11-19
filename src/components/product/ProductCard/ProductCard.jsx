import { memo } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../../../context/ThemeContext.jsx'
import { formatPrice } from '../../../utils/helpers.js'
import Badge from '../../common/Badge/Badge.jsx'
import Button from '../../common/Button/Button.jsx'
import Card from '../../common/Card/Card.jsx'
import RatingStars from '../../common/RatingStars/RatingStars.jsx'
import FavoriteButton from '../FavoriteButton/FavoriteButton.jsx'
import './ProductCard.css'

/**
 * @typedef {Object} Product
 * @property {number} id
 * @property {'movie' | 'bar'} type — билет на фильм или товар кинобара
 * @property {string} title
 * @property {string} description
 * @property {string} category — жанр или раздел кинобара
 * @property {number} price — ₸
 * @property {number} rating — оценка от 1 до 5
 * @property {string} imageUrl
 * @property {number} [year] — только у фильмов
 * @property {string} [duration]
 * @property {number} [reviewsCount]
 * @property {{ label: string, colorScheme: 'green' | 'red' | 'yellow' }} [status]
 * @property {boolean} [isAvailable] — идёт ли фильм в прокате
 */

/**
 * @typedef {Object} ProductCardProps
 * @property {Product} product
 * @property {boolean} isFavorite
 * @property {(product: Product, isFavorite: boolean) => void} onToggleFavorite
 * @property {(product: Product) => void} onAddToCart
 */

/**
 * Карточка товара в каталоге. Название — ссылка на /products/:id, растянутая на всю карточку.
 *
 * React.memo: в каталоге десятки карточек, а родитель перерисовывается при каждой букве
 * в поиске и при смене количества в шапке. С memo карточка перерисуется, только если
 * изменились её собственные props (товар, отметка избранного, стабильные колбэки).
 * @param {ProductCardProps} props
 */
function ProductCard({ product, isFavorite, onToggleFavorite, onAddToCart }) {
  const { theme } = useTheme()
  const { id, type, title, description, category, price, rating, imageUrl, status } = product
  const isMovie = type === 'movie'
  const canBuy = !isMovie || product.isAvailable

  const meta = isMovie ? `${product.year} · ${category} · ${product.duration}` : category

  return (
    <Card size="small" className={`product-card product-card--${theme}`}>
      <div className="product-card__poster">
        <img src={imageUrl} alt="" loading="lazy" />
        {status && (
          <div className="product-card__badge">
            <Badge label={status.label} colorScheme={status.colorScheme} />
          </div>
        )}
        <div className="product-card__favorite">
          <FavoriteButton isFavorite={isFavorite} onToggle={(next) => onToggleFavorite(product, next)} />
        </div>
      </div>

      <div className="product-card__body">
        <p className="product-card__meta">{meta}</p>
        <h3 className="product-card__title">
          <Link className="product-card__link" to={`/products/${id}`}>
            {title}
          </Link>
        </h3>
        <RatingStars score={rating} reviewsCount={isMovie ? product.reviewsCount : undefined} />
        <p className="product-card__description">{description}</p>

        <div className="product-card__actions">
          {canBuy ? (
            <Button variant="secondary" onClick={() => onAddToCart(product)}>
              {isMovie ? 'Билет' : 'В корзину'} · {formatPrice(price)}
            </Button>
          ) : (
            <Button variant="outline" disabled>
              Скоро в прокате
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}

export default memo(ProductCard)
