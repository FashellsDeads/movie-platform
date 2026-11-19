

/**
 * Форматирует число с разделителями разрядов: 12480 → «12 480».
 * @param {number} value
 * @returns {string}
 */
export const formatNumber = (value) => value.toLocaleString('ru-RU')

/**
 * Склоняет существительное после числа: 1 отзыв, 2 отзыва, 5 отзывов.
 * @param {number} count
 * @param {[string, string, string]} forms — формы для 1, 2 и 5
 * @returns {string}
 */
export function pluralize(count, [one, few, many]) {
  const mod10 = count % 10
  const mod100 = count % 100
  if (mod10 === 1 && mod100 !== 11) return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few
  return many
}

/**
 * Сегодняшняя дата в формате YYYY-MM-DD по местному времени.
 * @returns {string}
 */
export function todayIso() {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

/**
 * Форматирует ISO-дату в вид «12 сентября 2026 г.».
 * @param {string} isoDate
 * @returns {string}
 */
export const formatDate = (isoDate) =>
  new Date(isoDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })

/** Цена в тенге: 2500 → «2 500 ₸». */
export const formatPrice = (price) => `${formatNumber(price)} ₸`

// ---------- Каталог магазина ----------

export const ALL = 'all'

/** Разделы каталога. */
export const PRODUCT_TYPES = [
  { value: ALL, label: 'Все' },
  { value: 'movie', label: 'Билеты' },
  { value: 'bar', label: 'Кинобар' },
]

export const SORT_OPTIONS = [
  { value: 'rating', label: 'По рейтингу' },
  { value: 'price-asc', label: 'Сначала дешевле' },
  { value: 'price-desc', label: 'Сначала дороже' },
  { value: 'title', label: 'По названию' },
]

const productComparators = {
  rating: (a, b) => b.rating - a.rating,
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  title: (a, b) => a.title.localeCompare(b.title, 'ru'),
}

// «ё» и «е» в поиске не различаются: «унесенные» находит «Унесённые призраками»
const normalizeText = (text) => text.trim().toLowerCase().replaceAll('ё', 'е')

/**
 * Товары раздела и категории, в названии которых есть запрос.
 * @param {Array<{ type: string, category: string, title: string }>} products
 * @param {{ query?: string, type?: string, category?: string }} filters
 */
export function filterProducts(products, { query = '', type = ALL, category = ALL }) {
  const normalizedQuery = normalizeText(query)
  return products.filter(
    (product) =>
      (type === ALL || product.type === type) &&
      (category === ALL || product.category === category) &&
      (!normalizedQuery || normalizeText(product.title).includes(normalizedQuery)),
  )
}

/**
 * Новый отсортированный массив, исходный не меняется.
 * @param {Array<{ rating: number, price: number, title: string }>} products
 * @param {string} sortBy — ключ из SORT_OPTIONS
 */
export const sortProducts = (products, sortBy) =>
  [...products].sort(productComparators[sortBy] ?? productComparators.rating)

/**
 * Категории раздела в порядке появления: жанры у билетов, «Попкорн», «Напитки»… у кинобара.
 * @param {Array<{ type: string, category: string }>} products
 * @param {string} type
 */
export const getCategories = (products, type) => [
  ...new Set(products.filter((product) => type === ALL || product.type === type).map((product) => product.category)),
]

// ---------- Промокоды ----------

/** Промокоды магазина: код → скидка в процентах. */
export const PROMO_CODES = { CINEVIBE10: 10 }

/**
 * Скидка по промокоду в процентах; 0 — промокода нет. Регистр и пробелы по краям не важны.
 * @param {string} code
 */
export const getPromoDiscount = (code) => PROMO_CODES[code.trim().toUpperCase()] ?? 0

/** Сумма со скидкой, округлённая до тенге. */
export const applyDiscount = (price, percent) => Math.round((price * (100 - percent)) / 100)

/**
 * Текст уведомления после «В корзину» — честный и у лимита.
 * @param {string} title — товар
 * @param {number} requested — сколько хотели добавить
 * @param {number} added — сколько добавилось на самом деле
 * @param {number} max — лимит на позицию
 */
export function cartToastText(title, requested, added, max) {
  if (added === 0) return `«${title}»: в корзине уже ${max} шт. — это максимум`
  if (added < requested) return `«${title}»: добавлено ${added} шт. — больше ${max} шт. в одном заказе нельзя`
  return `«${title}» в корзине: ${added} шт.`
}
