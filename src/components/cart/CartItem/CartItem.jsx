import { memo } from 'react'
import { Link } from 'react-router-dom'
import { getMaxQuantity } from '../../../context/cartReducer.js'
import { formatPrice } from '../../../utils/helpers.js'
import './CartItem.css'

/**
 * @typedef {Object} CartItemProps
 * @property {import('../../../context/cartReducer.js').CartItem} item
 * @property {(id: number, quantity: number) => void} onQuantityChange
 * @property {(item: import('../../../context/cartReducer.js').CartItem) => void} onRemoveRequest — спросить, удалять ли
 */

/**
 * Строка корзины: товар, количество, сумма, удаление.
 * React.memo: при изменении количества одной позиции остальные строки не перерисовываются —
 * у них не меняются ни item, ни стабильные колбэки из CartList.
 * @param {CartItemProps} props
 */
function CartItem({ item, onQuantityChange, onRemoveRequest }) {
  const { id, type, title, price, imageUrl, quantity } = item
  const unit = type === 'movie' ? 'за билет' : 'за шт.'

  return (
    <li className="cart-item">
      <img className="cart-item__image" src={imageUrl} alt="" width={48} height={72} />
      <div className="cart-item__info">
        <Link className="cart-item__title" to={`/products/${id}`}>
          {title}
        </Link>
        <p className="cart-item__price">
          {formatPrice(price)} {unit}
        </p>
      </div>
      <div className="cart-item__counter">
        <button
          type="button"
          className="quantity__button"
          aria-label={`Меньше: ${title}`}
          disabled={quantity === 1}
          onClick={() => onQuantityChange(id, quantity - 1)}
        >
          −
        </button>
        <span className="cart-item__quantity" aria-label={`Количество: ${quantity}`}>
          {quantity}
        </span>
        <button
          type="button"
          className="quantity__button"
          aria-label={`Больше: ${title}`}
          disabled={quantity >= getMaxQuantity(type)}
          onClick={() => onQuantityChange(id, quantity + 1)}
        >
          +
        </button>
      </div>
      <span className="cart-item__sum">{formatPrice(price * quantity)}</span>
      <button
        type="button"
        className="cart-item__remove"
        aria-label={`Удалить «${title}»`}
        title="Удалить"
        onClick={() => onRemoveRequest(item)}
      >
        ×
      </button>
    </li>
  )
}

export default memo(CartItem)
