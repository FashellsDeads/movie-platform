import { useState } from 'react'
import { useAuth } from '../../context/auth/useAuth.js'
import { MAX_TICKETS_PER_MOVIE } from '../../context/cart/CartContext.js'
import { useCart } from '../../context/cart/useCart.js'
import { formatNumber, pluralize } from '../../utils/format.js'
import Button from '../Button/Button.jsx'
import Modal from '../Modal/Modal.jsx'
import './TicketsModal.css'

const TICKET_FORMS = ['билет', 'билета', 'билетов']

/**
 * Содержимое корзины. Живёт только пока окно открыто, поэтому сообщение
 * об оформлении сбрасывается при следующем открытии.
 * @param {{ onClose: () => void }} props
 */
function TicketsCart({ onClose }) {
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalCount, totalPrice } = useCart()
  const { user, isAuthenticated, openLogin } = useAuth()
  const [orderEmail, setOrderEmail] = useState(null)

  const handleCheckout = () => {
    if (!isAuthenticated) {
      onClose()
      openLogin()
      return
    }
    setOrderEmail(user.email)
    clearCart()
  }

  if (orderEmail) {
    return (
      <div className="tickets tickets--done">
        <p className="tickets__done-title">Билеты оформлены</p>
        <p className="tickets__done-text">Электронные билеты отправлены на {orderEmail}. Хорошего просмотра!</p>
        <Button text="Готово" variant="primary" onClick={onClose} />
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="tickets tickets--empty">
        <p className="tickets__done-title">Пока пусто</p>
        <p className="tickets__done-text">
          Нажмите кнопку с ценой на карточке фильма или выберите количество в окне фильма.
        </p>
        <Button text="К каталогу" variant="secondary" onClick={onClose} />
      </div>
    )
  }

  return (
    <div className="tickets">
      <ul className="tickets__list">
        {cartItems.map((item) => (
          <li key={item.id} className="tickets__item">
            <img className="tickets__poster" src={item.imageUrl} alt="" width={48} height={72} />
            <div className="tickets__info">
              <p className="tickets__title">{item.title}</p>
              <p className="tickets__price">{formatNumber(item.price)} ₸ за билет</p>
            </div>
            <div className="tickets__counter">
              <button
                type="button"
                className="quantity__button"
                aria-label={`Меньше билетов на «${item.title}»`}
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
              >
                −
              </button>
              <span className="tickets__quantity">{item.quantity}</span>
              <button
                type="button"
                className="quantity__button"
                aria-label={`Больше билетов на «${item.title}»`}
                disabled={item.quantity === MAX_TICKETS_PER_MOVIE}
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
              >
                +
              </button>
            </div>
            <span className="tickets__sum">{formatNumber(item.price * item.quantity)} ₸</span>
            <button
              type="button"
              className="tickets__remove"
              aria-label={`Убрать «${item.title}» из билетов`}
              onClick={() => removeFromCart(item.id)}
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      <div className="tickets__summary">
        <p className="tickets__total">
          {totalCount} {pluralize(totalCount, TICKET_FORMS)} · <strong>{formatNumber(totalPrice)} ₸</strong>
        </p>
        <div className="tickets__actions">
          <Button text="Очистить" variant="outline" onClick={clearCart} />
          <Button text={isAuthenticated ? 'Оформить' : 'Войти и оформить'} variant="primary" onClick={handleCheckout} />
        </div>
      </div>
    </div>
  )
}

/**
 * @typedef {Object} TicketsModalProps
 * @property {boolean} isOpen — показано ли окно
 * @property {() => void} onClose — закрыть окно
 */

/**
 * Окно «Мои билеты» — корзина из CartContext.
 * @param {TicketsModalProps} props
 */
function TicketsModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} title="Мои билеты" onClose={onClose}>
      <TicketsCart onClose={onClose} />
    </Modal>
  )
}

export default TicketsModal
