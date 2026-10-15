import { Link, useLocation, useNavigate } from 'react-router-dom'
import Button from '../components/Button/Button.jsx'
import Container from '../components/Container/Container.jsx'
import SectionHeader from '../components/SectionHeader/SectionHeader.jsx'
import { useAuth } from '../context/auth/useAuth.js'
import { MAX_TICKETS_PER_MOVIE } from '../context/cart/CartContext.js'
import { useCart } from '../context/cart/useCart.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { formatNumber, pluralize } from '../utils/format.js'
import './TicketsPage.css'

const TICKET_FORMS = ['билет', 'билета', 'билетов']

/**
 * Страница «/tickets» — корзина билетов из CartContext.
 * ДЗ №6 · #6 — после оформления useNavigate переводит на страницу заказов,
 * а гостя — на вход с возвратом сюда же.
 */
function TicketsPage() {
  useDocumentTitle('Мои билеты')
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalCount, totalPrice, placeOrder } = useCart()
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } })
      return
    }
    const orderId = placeOrder(user.email)
    navigate('/profile/orders', { state: { orderId } })
  }

  return (
    <section className="page">
      <Container maxWidth={880}>
        <SectionHeader
          title="Мои билеты"
          subtitle="Билеты на показы в зале CineVibe Hall. Электронные билеты придут на email после оформления."
          align="left"
        />

        {cartItems.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state__title">Пока пусто</p>
            <p className="empty-state__text">
              Нажмите кнопку с ценой на карточке фильма или выберите количество на странице фильма.
            </p>
            <Link className="link-button link-button--primary" to="/movies">
              К каталогу
            </Link>
          </div>
        ) : (
          <div className="tickets">
            <ul className="tickets__list">
              {cartItems.map((item) => (
                <li key={item.id} className="tickets__item">
                  <img className="tickets__poster" src={item.imageUrl} alt="" width={48} height={72} />
                  <div className="tickets__info">
                    <Link className="tickets__title" to={`/movie/${item.id}`}>
                      {item.title}
                    </Link>
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
                <Button
                  text={isAuthenticated ? 'Оформить' : 'Войти и оформить'}
                  variant="primary"
                  onClick={handleCheckout}
                />
              </div>
            </div>
          </div>
        )}
      </Container>
    </section>
  )
}

export default TicketsPage
