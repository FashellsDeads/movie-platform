import { createContext } from 'react'

export const MAX_TICKETS_PER_MOVIE = 10

/**
 * @typedef {Object} CartItem
 * @property {number} id — id фильма
 * @property {string} title — название фильма
 * @property {number} price — цена одного билета в тенге
 * @property {string} imageUrl — постер
 * @property {number} quantity — количество билетов
 */

/**
 * @typedef {Object} CartContextValue
 * @property {CartItem[]} cartItems — билеты в корзине
 * @property {(item: Omit<CartItem, 'quantity'>, quantity?: number) => void} addToCart — добавить билеты
 * @property {(itemId: number) => void} removeFromCart — убрать фильм из корзины
 * @property {(itemId: number, newQty: number) => void} updateQuantity — изменить количество (меньше 1 — убрать)
 * @property {() => void} clearCart — очистить корзину
 * @property {number} totalCount — всего билетов
 * @property {number} totalPrice — общая стоимость в тенге
 */

/** ДЗ №5 · CartContext — корзина билетов на кинопоказы. */
/** @type {import('react').Context<CartContextValue | null>} */
export const CartContext = createContext(null)
