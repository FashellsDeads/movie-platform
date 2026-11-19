import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import CartList from '../../components/cart/CartList/CartList.jsx'
import CartSummary from '../../components/cart/CartSummary/CartSummary.jsx'
import PromoCode from '../../components/cart/PromoCode/PromoCode.jsx'
import Button from '../../components/common/Button/Button.jsx'
import EmptyState from '../../components/common/EmptyState/EmptyState.jsx'
import Modal from '../../components/common/Modal/Modal.jsx'
import SectionHeader from '../../components/common/SectionHeader/SectionHeader.jsx'
import Container from '../../components/layout/Container/Container.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useCart } from '../../context/CartContext.jsx'
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js'
import { applyDiscount, formatPrice } from '../../utils/helpers.js'
import './CartPage.css'

/**
 * Корзина «/cart»: билеты и товары кинобара из CartContext, промокод и оформление заказа.
 * Оформить заказ может только вошедший зритель; гость получает ссылку на вход с возвратом сюда.
 */
function CartPage() {
  useDocumentTitle('Корзина')
  const { cartItems, totalCount, totalPrice, placeOrder } = useCart()
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Скидка живёт только на этой странице: в контекст попадает уже в оформленном заказе
  const [discountPercent, setDiscountPercent] = useState(0)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  if (cartItems.length === 0) {
    return (
      <section className="page">
        <Container maxWidth={960}>
          <SectionHeader title="Корзина" align="left" level={1} />
          <EmptyState message="Корзина пуста" hint="Добавьте билеты на сеанс или что-нибудь из кинобара.">
            <Link className="link-button link-button--primary" to="/products">
              Перейти в каталог
            </Link>
          </EmptyState>
        </Container>
      </section>
    )
  }

  const confirmOrder = () => {
    const orderId = placeOrder(user.email, { discountPercent })
    setIsConfirmOpen(false)
    navigate('/profile/orders', { state: { orderId } })
  }

  return (
    <section className="page">
      <Container maxWidth={1080}>
        <SectionHeader title="Корзина" subtitle="Билеты и заказ из кинобара оформляются вместе." align="left" level={1} />

        <div className="cart-page">
          <CartList items={cartItems} />

          <CartSummary totalCount={totalCount} totalPrice={totalPrice} discountPercent={discountPercent}>
            <PromoCode discountPercent={discountPercent} onApply={setDiscountPercent} />
            {isAuthenticated ? (
              <Button onClick={() => setIsConfirmOpen(true)}>Оформить заказ</Button>
            ) : (
              <Link className="link-button link-button--primary" to="/login" state={{ from: location }}>
                Войдите, чтобы оформить заказ
              </Link>
            )}
          </CartSummary>
        </div>
      </Container>

      <Modal isOpen={isConfirmOpen} title="Оформить заказ?" onClose={() => setIsConfirmOpen(false)}>
        <p className="cart-page__confirm-text">
          К оплате: <strong>{formatPrice(applyDiscount(totalPrice, discountPercent))}</strong>. Билеты придут на{' '}
          {user?.email}.
        </p>
        <div className="cart-page__confirm-actions">
          <Button variant="secondary" onClick={() => setIsConfirmOpen(false)}>
            Отмена
          </Button>
          <Button onClick={confirmOrder}>Подтвердить</Button>
        </div>
      </Modal>
    </section>
  )
}

export default CartPage
