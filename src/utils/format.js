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
 * Форматирует ISO-дату в вид «12 сентября 2026 г.».
 * @param {string} isoDate
 * @returns {string}
 */
export const formatDate = (isoDate) =>
  new Date(isoDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
