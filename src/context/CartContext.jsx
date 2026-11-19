import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from 'react'
import { todayIso } from '../utils/helpers.js'
import { STORAGE_KEYS, readFromStorage, writeToStorage } from '../utils/storage.js'
import {
  CART_ACTIONS,
  cartReducer,
  getCartTotals,
  getMaxQuantity,
  sanitizeCartItems,
  sanitizeOrders,
  toCartItem,
} from './cartReducer.js'

/**
 * @typedef {import('./cartReducer.js').CartItem} CartItem
 * @typedef {import('./cartReducer.js').Order} Order
 */

/**
 * @typedef {Object} CartContextValue
 * @property {CartItem[]} cartItems — позиции корзины: билеты и товары кинобара
 * @property {(product: Object, quantity?: number) => number} addToCart — добавить товар; возвращает, сколько штук добавлено
 * @property {(id: number) => void} removeFromCart — убрать позицию
 * @property {(id: number, quantity: number) => void} updateQuantity — изменить количество (меньше 1 — убрать)
 * @property {() => void} clearCart — очистить корзину
 * @property {number} totalCount — всего штук
 * @property {number} totalPrice — общая стоимость, ₸
 * @property {Order[]} orders — оформленные заказы, новые первыми
 * @property {(email: string, options?: { discountPercent?: number }) => string} placeOrder — оформить, вернуть номер заказа
 */

/** CartContext — корзина магазина. */
/** @type {import('react').Context<CartContextValue | null>} */
export const CartContext = createContext(null)

// Корзина и заказы переживают перезагрузку страницы: читаем их один раз при создании состояния
function readCartState() {
  return {
    items: sanitizeCartItems(readFromStorage(STORAGE_KEYS.tickets, [])),
    orders: sanitizeOrders(readFromStorage(STORAGE_KEYS.orders, [])),
  }
}

/**
 * Корзина магазина для всего приложения: билеты и товары кинобара.
 * Сложное состояние (позиции + заказы) — на useReducer, все изменения через dispatch.
 * @param {{ children: import('react').ReactNode }} props
 */
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, readCartState)
  const { items: cartItems, orders } = state

  useEffect(() => {
    writeToStorage(STORAGE_KEYS.tickets, cartItems)
  }, [cartItems])

  useEffect(() => {
    writeToStorage(STORAGE_KEYS.orders, orders)
  }, [orders])

  // Функции стабильны (useCallback без зависимостей от состояния): их получают
  // memo-компоненты карточек и строк корзины, и смена корзины не перерисовывает их зря.
  // актуальная корзина для addToCart: функция остаётся стабильной, но знает, сколько уже лежит
  const itemsRef = useRef(cartItems)
  useEffect(() => {
    itemsRef.current = cartItems
  }, [cartItems])

  // Возвращает, сколько штук реально добавлено: у лимита (10 билетов, 20 товаров бара) — меньше запрошенного
  const addToCart = useCallback((product, quantity = 1) => {
    const item = { ...toCartItem(product), type: product.type ?? 'movie' }
    const inCart = itemsRef.current.find((cartItem) => cartItem.id === item.id)?.quantity ?? 0
    const added = Math.max(0, Math.min(quantity, getMaxQuantity(item.type) - inCart))
    dispatch({ type: CART_ACTIONS.ADD, product: item, quantity })
    return added
  }, [])

  const removeFromCart = useCallback((id) => dispatch({ type: CART_ACTIONS.REMOVE, id }), [])
  const updateQuantity = useCallback((id, quantity) => dispatch({ type: CART_ACTIONS.SET_QUANTITY, id, quantity }), [])
  const clearCart = useCallback(() => dispatch({ type: CART_ACTIONS.CLEAR }), [])

  // Номер заказа и дата вычисляются здесь, чтобы reducer оставался чистой функцией
  const placeOrder = useCallback(
    (email, { discountPercent = 0 } = {}) => {
      const id = `CV-${String(orders.length + 1).padStart(4, '0')}`
      dispatch({ type: CART_ACTIONS.PLACE_ORDER, id, date: todayIso(), email, discountPercent })
      return id
    },
    [orders.length],
  )

  // Итоги пересчитываются только при изменении позиций, а не при каждом рендере провайдера
  const { totalCount, totalPrice } = useMemo(() => getCartTotals(cartItems), [cartItems])

  const value = useMemo(
    () => ({ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, totalCount, totalPrice, orders, placeOrder }),
    [cartItems, addToCart, removeFromCart, updateQuantity, clearCart, totalCount, totalPrice, orders, placeOrder],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

/**
 * Доступ к корзине билетов из любого компонента внутри CartProvider.
 * @returns {import('./CartContext.jsx').CartContextValue}
 */
export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart нужно вызывать внутри <CartProvider>')
  return context
}
