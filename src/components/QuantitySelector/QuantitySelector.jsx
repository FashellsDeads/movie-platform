import { useState } from 'react'
import { formatNumber } from '../../utils/format.js'
import Button from '../Button/Button.jsx'
import './QuantitySelector.css'

const MIN_QUANTITY = 1

/**
 * @typedef {Object} QuantitySelectorProps
 * @property {number} unitPrice — цена одного билета в тенге
 * @property {number} [max=10] — максимум билетов в одном заказе
 * @property {string} [label='Билеты на показ'] — подпись слева
 * @property {(quantity: number) => void} [onConfirm] — подтвердить выбранное количество
 * @property {string} [confirmText='В корзину'] — текст кнопки подтверждения
 */

/**
 * Выбор количества билетов с подсчётом суммы.
 * Количество хранится внутри (ДЗ №3), наружу отдаётся только по кнопке подтверждения.
 * @param {QuantitySelectorProps} props
 */
function QuantitySelector({ unitPrice, max = 10, label = 'Билеты на показ', onConfirm, confirmText = 'В корзину' }) {
  const [quantity, setQuantity] = useState(MIN_QUANTITY)

  const decrease = () => setQuantity((prev) => Math.max(prev - 1, MIN_QUANTITY))
  const increase = () => setQuantity((prev) => Math.min(prev + 1, max))

  return (
    <div className="quantity">
      <span className="quantity__label">{label}</span>
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
      {onConfirm && <Button text={confirmText} variant="secondary" onClick={() => onConfirm(quantity)} />}
    </div>
  )
}

export default QuantitySelector
