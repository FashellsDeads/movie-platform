const comparators = {
  'rating-desc': (a, b) => b.score - a.score,
  'rating-asc': (a, b) => a.score - b.score,
  'year-desc': (a, b) => b.year - a.year,
  'year-asc': (a, b) => a.year - b.year,
  'title-asc': (a, b) => a.title.localeCompare(b.title, 'ru'),
}

/**
 * Возвращает новый отсортированный массив фильмов, исходный не меняется.
 * @param {Array<{ score: number, year: number, title: string }>} list
 * @param {keyof typeof comparators} sortBy
 */
export const sortMovies = (list, sortBy) => [...list].sort(comparators[sortBy])

/**
 * Билет для корзины из данных фильма.
 * @param {{ id: number, title: string, ticketPrice: number, imageUrl: string }} movie
 */
export const toTicket = ({ id, title, ticketPrice, imageUrl }) => ({ id, title, price: ticketPrice, imageUrl })

/**
 * Ищет фильмы по названию без учёта регистра.
 * @param {Array<{ title: string }>} list
 * @param {string} query
 */
export function searchMovies(list, query) {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return list
  return list.filter((movie) => movie.title.toLowerCase().includes(normalized))
}
