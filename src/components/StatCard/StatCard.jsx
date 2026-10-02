import { formatNumber } from '../../utils/format.js'
import './StatCard.css'

/**
 * @typedef {Object} StatCardProps
 * @property {string} title — название метрики
 * @property {number} value — значение
 * @property {number} change — изменение в процентах за месяц
 * @property {boolean} isPositive — рост (true) или падение (false)
 */

/**
 * Виджет с метрикой платформы.
 * @param {StatCardProps} props
 */
function StatCard({ title, value, change, isPositive }) {
  const trend = isPositive ? 'up' : 'down'

  return (
    <div className="stat-card">
      <p className="stat-card__title">{title}</p>
      <p className="stat-card__value">{formatNumber(value)}</p>
      <p className={`stat-card__change stat-card__change--${trend}`}>
        <span aria-hidden="true">{isPositive ? '▲' : '▼'}</span> {isPositive ? '+' : '−'}
        {Math.abs(change)}% <span className="stat-card__period">за месяц</span>
      </p>
    </div>
  )
}

export default StatCard
