import { useCallback, useEffect, useMemo, useState } from 'react'
import { todayIso } from '../../utils/format.js'
import { STORAGE_KEYS, readFromStorage, writeToStorage } from '../../utils/storage.js'
import { CartContext, MAX_TICKETS_PER_MOVIE } from './CartContext.js'

const clampQuantity = (quantity) => Math.min(Math.max(quantity, 1), MAX_TICKETS_PER_MOVIE)

// localStorage мог быть изменён вручную или старой версией сайта — берём только корректные билеты,
// иначе в шапке вместо суммы появился бы NaN
const isValidCartItem = (item) =>
  Number.isInteger(item?.id) &&
  typeof item.title === 'string' &&
  Number.isFinite(item.price) &&
  Number.isInteger(item.quantity) &&
  item.quantity > 0

const readCart = () => {
  const saved = readFromStorage(STORAGE_KEYS.tickets, [])
  return Array.isArray(saved) ? saved.filter(isValidCartItem) : []
}

/**
 * Хранит корзину билетов для всего приложения.
 * @param {{ children: import('react').ReactNode }} props
 */
export function CartProvider({ children }) {
  // корзина переживает перезагрузку страницы: читаем её один раз при создании состояния
  const [cartItems, setCartItems] = useState(readCart)

  // ДЗ №6 · история оформленных заказов для страницы /profile/orders
  const [orders, setOrders] = useState(() => readFromStorage(STORAGE_KEYS.orders, []))

  useEffect(() => {
    writeToStorage(STORAGE_KEYS.tickets, cartItems)
  }, [cartItems])

  useEffect(() => {
    writeToStorage(STORAGE_KEYS.orders, orders)
  }, [orders])

  const addToCart = useCallback((item, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((cartItem) => cartItem.id === item.id)
      if (!existing) return [...prev, { ...item, quantity: clampQuantity(quantity) }]
      return prev.map((cartItem) =>
        cartItem.id === item.id ? { ...cartItem, quantity: clampQuantity(cartItem.quantity + quantity) } : cartItem,
      )
    })
  }, [])

  const removeFromCart = useCallback((itemId) => {
    setCartItems((prev) => prev.filter((cartItem) => cartItem.id !== itemId))
  }, [])

  const updateQuantity = useCallback((itemId, newQty) => {
    setCartItems((prev) =>
      newQty < 1
        ? prev.filter((cartItem) => cartItem.id !== itemId)
        : prev.map((cartItem) => (cartItem.id === itemId ? { ...cartItem, quantity: clampQuantity(newQty) } : cartItem)),
    )
  }, [])

  const clearCart = useCallback(() => setCartItems([]), [])

  // Итоги считаются внутри провайдера — компонентам не нужно знать, как они получаются
  const totalCount = cartItems.reduce((sum, cartItem) => sum + cartItem.quantity, 0)
  const totalPrice = cartItems.reduce((sum, cartItem) => sum + cartItem.quantity * cartItem.price, 0)

  // Оформление: билеты переезжают из корзины в новый заказ, корзина очищается
  const placeOrder = useCallback(
    (email) => {
      const orderId = `CV-${String(orders.length + 1).padStart(4, '0')}`
      const order = { id: orderId, date: todayIso(), email, items: cartItems, totalCount, totalPrice }
      setOrders((prev) => [order, ...prev])
      setCartItems([])
      return orderId
    },
    [orders.length, cartItems, totalCount, totalPrice],
  )

  const value = useMemo(
    () => ({
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalCount,
      totalPrice,
      orders,
      placeOrder,
    }),
    [cartItems, addToCart, removeFromCart, updateQuantity, clearCart, totalCount, totalPrice, orders, placeOrder],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
