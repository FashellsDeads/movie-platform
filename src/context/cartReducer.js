import { applyDiscount } from '../utils/helpers.js'

// Корзина магазина — чистый reducer: билеты на фильмы и товары кинобара в одном списке.
// Сложное состояние (позиции + заказы) меняется только через действия — useReducer в CartProvider.

export const CART_ACTIONS = {
  ADD: 'ADD',
  REMOVE: 'REMOVE',
  SET_QUANTITY: 'SET_QUANTITY',
  CLEAR: 'CLEAR',
  PLACE_ORDER: 'PLACE_ORDER',
}

/** Сколько штук одной позиции можно взять: билетов на фильм — 10, товара кинобара — 20. */
export const MAX_QUANTITY = { movie: 10, bar: 20 }

export const getMaxQuantity = (type) => MAX_QUANTITY[type] ?? MAX_QUANTITY.movie

const clampQuantity = (quantity, type) => Math.min(Math.max(quantity, 1), getMaxQuantity(type))

/**
 * @typedef {Object} CartItem
 * @property {number} id — id товара
 * @property {'movie' | 'bar'} type — билет или товар кинобара
 * @property {string} title
 * @property {number} price — цена за штуку на момент добавления, ₸
 * @property {string} imageUrl
 * @property {number} quantity
 */

/**
 * @typedef {Object} Order
 * @property {string} id — номер заказа, например CV-0001
 * @property {string} date — YYYY-MM-DD
 * @property {string} email — куда «отправлены» билеты
 * @property {CartItem[]} items
 * @property {number} totalCount
 * @property {number} discountPercent — скидка по промокоду, %
 * @property {number} totalPrice — к оплате, с учётом скидки
 */

/**
 * Снимок товара для корзины: корзина показывается без загрузки каталога,
 * а цена фиксируется в момент добавления.
 * @param {{ id: number, type: 'movie' | 'bar', title: string, price: number, imageUrl: string }} product
 * @returns {Omit<CartItem, 'quantity'>}
 */
export const toCartItem = ({ id, type, title, price, imageUrl }) => ({ id, type, title, price, imageUrl })

/** Сколько всего штук и на какую сумму. */
export function getCartTotals(items) {
  return items.reduce(
    (totals, item) => ({
      totalCount: totals.totalCount + item.quantity,
      totalPrice: totals.totalPrice + item.quantity * item.price,
    }),
    { totalCount: 0, totalPrice: 0 },
  )
}

const isValidCartItem = (item) =>
  Number.isInteger(item?.id) &&
  typeof item.title === 'string' &&
  Number.isFinite(item.price) &&
  item.price >= 0 &&
  Number.isInteger(item.quantity) &&
  item.quantity > 0

/**
 * Корзина из localStorage могла быть изменена вручную или сохранена старой версией сайта
 * (раньше в ней были только билеты, без поля type). Берём только корректные позиции.
 * @param {unknown} saved
 * @returns {CartItem[]}
 */
export function sanitizeCartItems(saved) {
  if (!Array.isArray(saved)) return []
  return saved.filter(isValidCartItem).map((item) => {
    const type = item.type === 'bar' ? 'bar' : 'movie'
    // лимит действует и для сохранённой корзины, а не только для новых добавлений
    return { ...item, type, quantity: clampQuantity(item.quantity, type) }
  })
}

const isValidOrder = (order) =>
  typeof order?.id === 'string' &&
  typeof order.date === 'string' &&
  Array.isArray(order.items) &&
  Number.isFinite(order.totalCount) &&
  Number.isFinite(order.totalPrice)

/**
 * Заказы из localStorage: повреждённые записи отбрасываются, иначе страница заказов не открылась бы.
 * @param {unknown} saved
 * @returns {Order[]}
 */
export function sanitizeOrders(saved) {
  if (!Array.isArray(saved)) return []
  return saved.filter(isValidOrder).map((order) => ({ ...order, items: sanitizeCartItems(order.items) }))
}

/**
 * @param {{ items: CartItem[], orders: Order[] }} state
 * @param {Object} action
 */
export function cartReducer(state, action) {
  switch (action.type) {
    case CART_ACTIONS.ADD: {
      const { product, quantity = 1 } = action
      const existing = state.items.find((item) => item.id === product.id)
      const items = existing
        ? state.items.map((item) =>
            item.id === product.id ? { ...item, quantity: clampQuantity(item.quantity + quantity, item.type) } : item,
          )
        : [...state.items, { ...product, quantity: clampQuantity(quantity, product.type) }]
      return { ...state, items }
    }

    case CART_ACTIONS.REMOVE:
      return { ...state, items: state.items.filter((item) => item.id !== action.id) }

    case CART_ACTIONS.SET_QUANTITY: {
      // только целое число штук; не-число и всё меньше 1 удаляют позицию
      const quantity = Number.isFinite(action.quantity) ? Math.trunc(action.quantity) : 0
      if (quantity < 1) return { ...state, items: state.items.filter((item) => item.id !== action.id) }
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.id ? { ...item, quantity: clampQuantity(quantity, item.type) } : item,
        ),
      }
    }

    case CART_ACTIONS.CLEAR:
      return { ...state, items: [] }

    case CART_ACTIONS.PLACE_ORDER: {
      // Номер, дата и скидка приходят в действии — reducer остаётся чистой функцией
      const { totalCount, totalPrice } = getCartTotals(state.items)
      const discountPercent = action.discountPercent ?? 0
      const order = {
        id: action.id,
        date: action.date,
        email: action.email,
        items: state.items,
        totalCount,
        discountPercent,
        totalPrice: applyDiscount(totalPrice, discountPercent),
      }
      return { items: [], orders: [order, ...state.orders] }
    }

    default:
      return state
  }
}
