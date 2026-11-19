import { formatDate, formatPrice } from '../../../utils/helpers.js'
import Badge from '../../common/Badge/Badge.jsx'
import QuantitySelector from '../../common/QuantitySelector/QuantitySelector.jsx'
import RatingStars from '../../common/RatingStars/RatingStars.jsx'
import Tabs from '../../common/Tabs/Tabs.jsx'
import FavoriteButton from '../FavoriteButton/FavoriteButton.jsx'
import ReviewForm from '../ReviewForm/ReviewForm.jsx'
import './ProductDetails.css'

/**
 * @typedef {Object} ProductDetailsProps
 * @property {import('../ProductCard/ProductCard.jsx').Product & { showtimes?: Array<{ time: string, hall: string }> }} product
 * @property {import('../../../hooks/useProductReviews.js').Review[]} reviews — отзывы с сервера и с этого устройства
 * @property {number} maxQuantity — сколько штук можно взять за раз
 * @property {boolean} isFavorite
 * @property {(isFavorite: boolean) => void} onToggleFavorite
 * @property {(quantity: number) => void} onAddToCart
 * @property {(review: { authorName: string, text: string }) => void} onAddReview
 */

function ReviewList({ reviews }) {
  if (reviews.length === 0) return <p className="product-details__muted">Отзывов пока нет — будьте первым.</p>
  return (
    <ul className="product-details__reviews">
      {reviews.map((review) => (
        <li key={review.id} className="product-details__review">
          <p className="product-details__review-head">
            <strong>{review.author}</strong>
            <span>{formatDate(review.date)}</span>
            {review.rating && <span aria-label={`Оценка ${review.rating} из 5`}>{'★'.repeat(review.rating)}</span>}
          </p>
          <p>{review.text}</p>
        </li>
      ))}
    </ul>
  )
}

/**
 * Карточка товара на его странице. У фильма — вкладки «Описание / Сеансы / Отзывы» (Tabs),
 * у товара кинобара — просто описание. Данные и действия приходят от страницы.
 * @param {ProductDetailsProps} props
 */
function ProductDetails({ product, reviews, maxQuantity, isFavorite, onToggleFavorite, onAddToCart, onAddReview }) {
  const isMovie = product.type === 'movie'
  const canBuy = !isMovie || product.isAvailable

  const purchase = canBuy ? (
    <QuantitySelector
      key={product.id}
      unitPrice={product.price}
      max={maxQuantity}
      label={`${isMovie ? 'Билеты' : 'Количество'} · ${formatPrice(product.price)}`}
      confirmText="В корзину"
      onConfirm={onAddToCart}
    />
  ) : (
    <p className="product-details__notice">Фильм скоро в прокате. Продажа билетов откроется, когда появится расписание.</p>
  )

  return (
    <article className="product-details">
      <div className="product-details__poster">
        <img src={product.imageUrl} alt={`${isMovie ? 'Постер фильма' : 'Фото товара'} «${product.title}»`} />
        <div className="product-details__favorite">
          <FavoriteButton isFavorite={isFavorite} onToggle={onToggleFavorite} />
        </div>
      </div>

      <div className="product-details__info">
        <div className="product-details__meta">
          {product.status && <Badge label={product.status.label} colorScheme={product.status.colorScheme} />}
          <span>{isMovie ? `${product.year} · ${product.category} · ${product.duration}` : product.category}</span>
        </div>
        <h1 className="product-details__title">{product.title}</h1>
        <RatingStars score={product.rating} reviewsCount={isMovie ? product.reviewsCount : undefined} />

        {isMovie ? (
          <Tabs>
            <Tabs.List>
              <Tabs.Tab>Описание</Tabs.Tab>
              <Tabs.Tab>Сеансы</Tabs.Tab>
              <Tabs.Tab>Отзывы ({reviews.length})</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel>
              <p className="product-details__description">{product.description}</p>
            </Tabs.Panel>
            <Tabs.Panel>
              {product.showtimes?.length ? (
                <>
                  <ul className="product-details__showtimes">
                    {product.showtimes.map((showtime) => (
                      <li key={`${showtime.time}-${showtime.hall}`}>
                        <strong>{showtime.time}</strong> {showtime.hall}
                      </li>
                    ))}
                  </ul>
                  <p className="product-details__muted">Билет действует на любой сеанс дня — выберите время на кассе.</p>
                </>
              ) : (
                <p className="product-details__muted">Расписание ещё не опубликовано.</p>
              )}
            </Tabs.Panel>
            <Tabs.Panel>
              <ReviewForm onSubmit={onAddReview} />
              <ReviewList reviews={reviews} />
            </Tabs.Panel>
          </Tabs>
        ) : (
          <p className="product-details__description">{product.description}</p>
        )}

        {purchase}
      </div>
    </article>
  )
}

export default ProductDetails
