import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/cart/useCart.js'
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js'
import { formatDate, formatNumber, pluralize } from '../../utils/format.js'

/**
 * «/profile/orders» — история заказов. Сюда ведёт navigate() после оформления билетов,
 * номер нового заказа приходит в location.state.
 */
function ProfileOrders() {
  useDocumentTitle('Мои заказы')
  const { orders } = useCart()
  const location = useLocation()
  const navigate = useNavigate()
  // номер запоминаем при первом рендере: state в истории сразу очищаем ниже
  const [newOrderId] = useState(() => location.state?.orderId)
  const newOrder = orders.find((order) => order.id === newOrderId)

  // браузер хранит history.state и после F5 — без очистки «Заказ оформлен» показывался бы снова
  useEffect(() => {
    if (location.state?.orderId) navigate('.', { replace: true, state: null })
  }, [location.state, navigate])

  if (orders.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-state__title">Заказов пока нет</p>
        <p className="empty-state__text">Выберите фильм, добавьте билеты и оформите их — заказ появится здесь.</p>
        <Link className="link-button link-button--primary" to="/movies">
          Выбрать фильм
        </Link>
      </div>
    )
  }

  return (
    <div className="orders">
      {newOrder && (
        <p className="orders__success" role="status">
          Заказ {newOrder.id} оформлен — электронные билеты отправлены на {newOrder.email}.
        </p>
      )}

      <ul className="orders__list">
        {orders.map((order) => (
          <li key={order.id} className={`order${order.id === newOrderId ? ' order--new' : ''}`}>
            <div className="order__head">
              <span className="order__id">{order.id}</span>
              <time className="order__date" dateTime={order.date}>
                {formatDate(order.date)}
              </time>
            </div>
            <ul className="order__items">
              {order.items.map((item) => (
                <li key={item.id}>
                  <Link className="text-link" to={`/movie/${item.id}`}>
                    {item.title}
                  </Link>{' '}
                  × {item.quantity}
                </li>
              ))}
            </ul>
            <p className="order__total">
              {order.totalCount} {pluralize(order.totalCount, ['билет', 'билета', 'билетов'])} ·{' '}
              <strong>{formatNumber(order.totalPrice)} ₸</strong>
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ProfileOrders
