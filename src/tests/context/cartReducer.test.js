import { describe, expect, it } from 'vitest'
import { CART_ACTIONS, MAX_QUANTITY, cartReducer, getCartTotals, sanitizeCartItems, sanitizeOrders, toCartItem } from '../../context/cartReducer.js'

const dune = { id: 1, type: 'movie', title: 'Дюна: Часть вторая', price: 2500, imageUrl: 'dune.svg', rating: 4.7 }
const popcorn = { id: 101, type: 'bar', title: 'Попкорн солёный S', price: 990, imageUrl: 'pop.svg', rating: 4.6 }
const empty = { items: [], orders: [] }

const add = (state, product, quantity) => cartReducer(state, { type: CART_ACTIONS.ADD, product: toCartItem(product), quantity })

describe('toCartItem', () => {
  it('берёт из товара только то, что нужно корзине', () => {
    expect(toCartItem(dune)).toEqual({ id: 1, type: 'movie', title: 'Дюна: Часть вторая', price: 2500, imageUrl: 'dune.svg' })
  })
})

describe('cartReducer', () => {
  it('ADD нового товара и повторный ADD складывают количество', () => {
    let state = add(empty, dune, 2)
    state = add(state, dune, 1)

    expect(state.items).toEqual([{ ...toCartItem(dune), quantity: 3 }])
  })

  it('билет и попкорн — две позиции, итог считается по обеим', () => {
    let state = add(empty, dune, 2)
    state = add(state, popcorn, 1)

    expect(state.items).toHaveLength(2)
    expect(getCartTotals(state.items)).toEqual({ totalCount: 3, totalPrice: 2 * 2500 + 990 })
  })

  it('лимит: 10 билетов на фильм и 20 штук товара бара', () => {
    expect(MAX_QUANTITY).toEqual({ movie: 10, bar: 20 })
    expect(add(empty, dune, 15).items[0].quantity).toBe(10)
    expect(add(empty, popcorn, 25).items[0].quantity).toBe(20)

    const state = add(empty, popcorn, 1)
    const updated = cartReducer(state, { type: CART_ACTIONS.SET_QUANTITY, id: 101, quantity: 99 })
    expect(updated.items[0].quantity).toBe(20)
  })

  it('SET_QUANTITY: дробное число округляется вниз, не-число удаляет позицию', () => {
    const state = add(empty, dune, 2)

    expect(cartReducer(state, { type: CART_ACTIONS.SET_QUANTITY, id: 1, quantity: 2.7 }).items[0].quantity).toBe(2)
    expect(cartReducer(state, { type: CART_ACTIONS.SET_QUANTITY, id: 1, quantity: NaN }).items).toEqual([])
  })

  it('SET_QUANTITY 0 или меньше удаляет позицию', () => {
    const state = add(empty, dune, 2)

    expect(cartReducer(state, { type: CART_ACTIONS.SET_QUANTITY, id: 1, quantity: 0 }).items).toEqual([])
    expect(cartReducer(state, { type: CART_ACTIONS.SET_QUANTITY, id: 1, quantity: -3 }).items).toEqual([])
  })

  it('REMOVE убирает только свою позицию', () => {
    let state = add(empty, dune, 1)
    state = add(state, popcorn, 1)

    expect(cartReducer(state, { type: CART_ACTIONS.REMOVE, id: 1 }).items.map((item) => item.id)).toEqual([101])
  })

  it('CLEAR очищает корзину, заказы остаются', () => {
    const state = { items: add(empty, dune, 1).items, orders: [{ id: 'CV-0001' }] }

    expect(cartReducer(state, { type: CART_ACTIONS.CLEAR })).toEqual({ items: [], orders: [{ id: 'CV-0001' }] })
  })

  it('PLACE_ORDER переносит товары в новый заказ и очищает корзину', () => {
    let state = add(empty, dune, 2)
    state = add(state, popcorn, 1)
    state = cartReducer(state, { type: CART_ACTIONS.PLACE_ORDER, id: 'CV-0001', date: '2026-11-20', email: 'a@mail.kz' })

    expect(state.items).toEqual([])
    expect(state.orders[0]).toMatchObject({ id: 'CV-0001', date: '2026-11-20', email: 'a@mail.kz', totalCount: 3, totalPrice: 5990 })
    expect(state.orders[0].items).toHaveLength(2)
  })
})

describe('PLACE_ORDER со скидкой', () => {
  it('сумма заказа учитывает промокод', () => {
    const state = add(empty, dune, 2)
    const next = cartReducer(state, {
      type: CART_ACTIONS.PLACE_ORDER,
      id: 'CV-0002',
      date: '2026-11-20',
      email: 'a@mail.kz',
      discountPercent: 10,
    })

    expect(next.orders[0]).toMatchObject({ totalPrice: 4500, discountPercent: 10 })
  })
})

describe('sanitizeCartItems — данные из localStorage', () => {
  it('корзина старого формата без type считается билетами', () => {
    const saved = [{ id: 2, title: 'Интерстеллар', price: 2500, imageUrl: 'i.svg', quantity: 2 }]

    expect(sanitizeCartItems(saved)).toEqual([{ ...saved[0], type: 'movie' }])
  })

  it('количество выше лимита обрезается, отрицательная цена — мусор', () => {
    const saved = [
      { id: 1, type: 'movie', title: 'Дюна', price: 2500, imageUrl: 'd.svg', quantity: 50 },
      { id: 101, type: 'bar', title: 'Попкорн', price: 990, imageUrl: 'p.svg', quantity: 99 },
      { id: 102, type: 'bar', title: 'Попкорн L', price: -5, imageUrl: 'p.svg', quantity: 1 },
    ]

    expect(sanitizeCartItems(saved).map((item) => item.quantity)).toEqual([10, 20])
  })

  it('мусор отбрасывается, не-массив даёт пустую корзину', () => {
    const saved = [{ id: 'x' }, null, { id: 3, title: 'Оппенгеймер', price: 'дорого', quantity: 1 }]

    expect(sanitizeCartItems(saved)).toEqual([])
    expect(sanitizeCartItems('{not json')).toEqual([])
    expect(sanitizeCartItems(null)).toEqual([])
  })
})

describe('sanitizeOrders — заказы из localStorage', () => {
  it('оставляет только корректные заказы', () => {
    const good = { id: 'CV-0001', date: '2026-11-20', email: 'a@mail.kz', items: [], totalCount: 0, totalPrice: 0 }

    expect(sanitizeOrders([null, { id: 'x' }, good, 'мусор'])).toEqual([good])
    expect(sanitizeOrders({ not: 'array' })).toEqual([])
  })
})
