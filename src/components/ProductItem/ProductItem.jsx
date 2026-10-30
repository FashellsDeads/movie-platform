import { memo } from 'react'
import { formatNumber } from '../../utils/format.js'
import Button from '../Button/Button.jsx'
import './ProductItem.css'

/**
 * @typedef {Object} ProductItemProps
 * @property {import('../../data/barProducts.js').Product} product — товар (объект из родителя)
 * @property {number} quantity — сколько таких уже в заказе
 * @property {(product: import('../../data/barProducts.js').Product) => void} onAddToCart — функция из родителя
 */

/**
 * Карточка товара кинобара. ДЗ №9: console.log показывает каждую перерисовку.
 * @param {ProductItemProps} props
 */
function ProductItem({ product, quantity, onAddToCart }) {
  console.log('ProductItem render', product.name)

  return (
    <article className={`product${quantity > 0 ? ' product--in-cart' : ''}`}>
      <span className="product__category">{product.category}</span>
      <h3 className="product__name">{product.name}</h3>
      <p className="product__meta">
        <span className="product__rating" aria-label={`Оценка ${product.rating} из 5`}>
          ★ {product.rating.toFixed(1)}
        </span>
        <span className="product__price">{formatNumber(product.price)} ₸</span>
      </p>
      <div className="product__actions">
        <Button text="Добавить в корзину" variant="secondary" onClick={() => onAddToCart(product)} />
        {quantity > 0 && <span className="product__quantity">В заказе: {quantity}</span>}
      </div>
    </article>
  )
}

/**
 * Та же карточка в React.memo: перерисуется, только если изменились props
 * (сравнение поверхностное — по ссылке для объекта и функции, по значению для числа).
 */
export const MemoProductItem = memo(ProductItem)

export default ProductItem
