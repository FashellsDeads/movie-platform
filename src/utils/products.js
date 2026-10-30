// ДЗ №9 — чистые функции для кинобара: фильтрация, сортировка, «тяжёлое» вычисление
// и генерация большого списка. Каждая пишет в консоль, когда выполняется, —
// так видно, спасает ли useMemo от лишних запусков.
import { ALL_BAR_CATEGORIES, barProducts } from '../data/barProducts.js'

/** @typedef {import('../data/barProducts.js').Product} Product */

const sorters = {
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  'rating-desc': (a, b) => b.rating - a.rating || a.price - b.price,
}

/**
 * Поиск по названию + категория + сортировка. Возвращает НОВЫЙ массив.
 * @param {Product[]} products
 * @param {{ query: string, category: string, sortBy: string }} filters
 */
export function filterProducts(products, { query, category, sortBy }) {
  console.log(`filterProducts: фильтруем ${products.length} товаров`)
  const normalizedQuery = query.trim().toLowerCase()

  return products
    .filter((product) => category === ALL_BAR_CATEGORIES || product.category === category)
    .filter((product) => product.name.toLowerCase().includes(normalizedQuery))
    .sort(sorters[sortBy] ?? sorters['rating-desc'])
}

// Сколько «лишней» работы делает тяжёлое вычисление: ~10–30 мс на обычном ноутбуке
const HEAVY_ITERATIONS = 3_000_000

/**
 * Искусственно тяжёлое вычисление (calculateSomething из задания): ищет самое выгодное
 * предложение — лучший рейтинг за каждую тысячу тенге — и нарочно крутит пустой цикл.
 * @param {Product[]} products
 * @returns {Product | null}
 */
export function calculateBestDeal(products) {
  console.log('calculateBestDeal: тяжёлое вычисление')

  let noise = 0
  for (let i = 0; i < HEAVY_ITERATIONS; i += 1) noise += Math.sqrt(i) % 1
  // результат цикла проверяем, чтобы движок JS не выбросил его как неиспользуемый
  if (!Number.isFinite(noise)) return null

  let best = null
  let bestScore = -Infinity
  for (const product of products) {
    const score = (product.rating ** 3 / product.price) * 1000
    if (score > bestScore) {
      best = product
      bestScore = score
    }
  }
  return best
}

/**
 * Для доп. задания: 1000 товаров из 24 базовых — с разными ценами и оценками.
 * Результат одинаковый при каждом вызове (без Math.random).
 * @param {number} count
 * @returns {Product[]}
 */
export function generateProducts(count) {
  console.log(`generateProducts: создаём ${count} товаров`)
  return Array.from({ length: count }, (_, index) => {
    const base = barProducts[index % barProducts.length]
    const batch = Math.floor(index / barProducts.length) + 1
    return {
      id: index + 1,
      name: batch === 1 ? base.name : `${base.name} · партия ${batch}`,
      category: base.category,
      price: base.price + ((index * 37) % 9) * 10,
      rating: Math.round(Math.min(5, Math.max(1, base.rating - ((index * 13) % 7) / 20)) * 10) / 10,
    }
  })
}
