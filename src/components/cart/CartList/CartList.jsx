import { useCallback, useState } from 'react'
import { useCart } from '../../../context/CartContext.jsx'
import Button from '../../common/Button/Button.jsx'
import Modal from '../../common/Modal/Modal.jsx'
import CartItem from '../CartItem/CartItem.jsx'
import './CartList.css'

/**
 * Список позиций корзины. Удаление — только после подтверждения в Modal.
 * @param {{ items: import('../../../context/cartReducer.js').CartItem[] }} props
 */
function CartList({ items }) {
  const { updateQuantity, removeFromCart } = useCart()
  const [pendingRemoval, setPendingRemoval] = useState(null)

  // useCallback: колбэки уходят в memo-строки CartItem — со стабильной ссылкой
  // смена количества одной позиции не перерисовывает остальные
  const askRemove = useCallback((item) => setPendingRemoval(item), [])
  const closeDialog = useCallback(() => setPendingRemoval(null), [])

  const confirmRemove = () => {
    removeFromCart(pendingRemoval.id)
    setPendingRemoval(null)
  }

  return (
    <>
      <ul className="cart-list">
        {items.map((item) => (
          <CartItem key={item.id} item={item} onQuantityChange={updateQuantity} onRemoveRequest={askRemove} />
        ))}
      </ul>

      <Modal isOpen={pendingRemoval !== null} title={`Удалить «${pendingRemoval?.title}» из корзины?`} onClose={closeDialog}>
        <p className="cart-list__dialog-text">Товар можно будет снова добавить из каталога.</p>
        <div className="cart-list__dialog-actions">
          <Button variant="secondary" onClick={closeDialog}>
            Отмена
          </Button>
          <Button variant="danger" onClick={confirmRemove}>
            Удалить
          </Button>
        </div>
      </Modal>
    </>
  )
}

export default CartList
