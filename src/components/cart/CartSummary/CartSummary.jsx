import { applyDiscount, formatPrice, pluralize } from '../../../utils/helpers.js'
import Card from '../../common/Card/Card.jsx'
import './CartSummary.css'

/**
 * @typedef {Object} CartSummaryProps
 * @property {number} totalCount — всего штук
 * @property {number} totalPrice — сумма без скидки, ₸
 * @property {number} discountPercent — скидка по промокоду, %
 * @property {import('react').ReactNode} [children] — промокод и кнопки оформления
 */

/**
 * Итог заказа: сумма, скидка и «К оплате».
 * @param {CartSummaryProps} props
 */
function CartSummary({ totalCount, totalPrice, discountPercent, children }) {
  const toPay = applyDiscount(totalPrice, discountPercent)

  return (
    <Card as="section" title="Итог заказа" className="cart-summary" aria-label="Итог заказа">
      <dl className="cart-summary__rows">
        <div className="cart-summary__row">
          <dt>
            {totalCount} {pluralize(totalCount, ['товар', 'товара', 'товаров'])}
          </dt>
          <dd>{formatPrice(totalPrice)}</dd>
        </div>
        {discountPercent > 0 && (
          <div className="cart-summary__row cart-summary__row--discount">
            <dt>Скидка {discountPercent}%</dt>
            <dd>−{formatPrice(totalPrice - toPay)}</dd>
          </div>
        )}
        <div className="cart-summary__row cart-summary__row--total">
          <dt>К оплате</dt>
          <dd>{formatPrice(toPay)}</dd>
        </div>
      </dl>
      {children}
    </Card>
  )
}

export default CartSummary
