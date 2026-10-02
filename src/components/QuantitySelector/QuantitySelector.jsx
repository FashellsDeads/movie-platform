import { useState } from 'react'
import { formatNumber } from '../../utils/format.js'
import './QuantitySelector.css'

const MIN_QUANTITY = 1

/**
 * @typedef {Object} QuantitySelectorProps
 * @property {number} unitPrice — цена одного билета в тенге
 * @property {number} [max=10] — максимум билетов в одном заказе
 */

/**
 * Выбор количества билетов на премьерный показ с подсчётом суммы.
 * @param {QuantitySelectorProps} props
 */
function QuantitySelector({ unitPrice, max = 10 }) {
  const [quantity, setQuantity] = useState(MIN_QUANTITY)

  const decrease = () => setQuantity((prev) => Math.max(prev - 1, MIN_QUANTITY))
  const increase = () => setQuantity((prev) => Math.min(prev + 1, max))

  return (
    <div className="quantity">
      <span className="quantity__label">Билеты на премьеру</span>
      <div className="quantity__controls">
        <button
          type="button"
          className="quantity__button"
          aria-label="Уменьшить количество"
          disabled={quantity === MIN_QUANTITY}
          onClick={decrease}
        >
          −
        </button>
        <output className="quantity__value" aria-live="polite">
          {quantity}
        </output>
        <button
          type="button"
          className="quantity__button"
          aria-label="Увеличить количество"
          disabled={quantity === max}
          onClick={increase}
        >
          +
        </button>
      </div>
      <span className="quantity__total">{formatNumber(quantity * unitPrice)} ₸</span>
    </div>
  )
}

export default QuantitySelector
