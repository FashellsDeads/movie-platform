import { formatNumber, pluralize } from '../../utils/format.js'
import './RatingStars.css'

const MAX_SCORE = 5

/**
 * @typedef {Object} RatingStarsProps
 * @property {number} score — оценка зрителей от 1 до 5 (допускаются дробные)
 * @property {number} reviewsCount — количество отзывов
 */

/**
 * Рейтинг фильма в виде звёзд с частичной заливкой.
 * @param {RatingStarsProps} props
 */
function RatingStars({ score, reviewsCount }) {
  const safeScore = Math.min(Math.max(score, 1), MAX_SCORE)
  const fillPercent = (safeScore / MAX_SCORE) * 100

  return (
    <div className="rating">
      <span className="rating__stars" role="img" aria-label={`Оценка ${safeScore} из ${MAX_SCORE}`}>
        <span className="rating__stars-base" aria-hidden="true">★★★★★</span>
        <span className="rating__stars-fill" style={{ width: `${fillPercent}%` }} aria-hidden="true">
          ★★★★★
        </span>
      </span>
      <span className="rating__score">{safeScore.toFixed(1)}</span>
      <span className="rating__count">
        {formatNumber(reviewsCount)} {pluralize(reviewsCount, ['отзыв', 'отзыва', 'отзывов'])}
      </span>
    </div>
  )
}

export default RatingStars
