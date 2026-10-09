import { useCallback, useEffect, useMemo, useState } from 'react'
import { STORAGE_KEYS, readFromStorage, writeToStorage } from '../../utils/storage.js'
import { CartContext, MAX_TICKETS_PER_MOVIE } from './CartContext.js'

const clampQuantity = (quantity) => Math.min(Math.max(quantity, 1), MAX_TICKETS_PER_MOVIE)

/**
 * Хранит корзину билетов для всего приложения.
 * @param {{ children: import('react').ReactNode }} props
 */
export function CartProvider({ children }) {
  // корзина переживает перезагрузку страницы: читаем её один раз при создании состояния
  const [cartItems, setCartItems] = useState(() => readFromStorage(STORAGE_KEYS.tickets, []))

  useEffect(() => {
    writeToStorage(STORAGE_KEYS.tickets, cartItems)
  }, [cartItems])

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

  const value = useMemo(
    () => ({ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, totalCount, totalPrice }),
    [cartItems, addToCart, removeFromCart, updateQuantity, clearCart, totalCount, totalPrice],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
