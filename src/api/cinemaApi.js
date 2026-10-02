// Имитация сервера кинотеатра: данные берутся из src/data, но приходят
// асинхронно, со случайной задержкой, и поддерживают отмену через AbortSignal.
import { ALL_CATEGORY, categories, movies } from '../data/movies.js'
import { stats } from '../data/site.js'
import { testimonials } from '../data/testimonials.js'
import { searchMovies, sortMovies } from '../utils/movies.js'

/**
 * Пауза, которую можно прервать сигналом AbortController.
 * @param {number} ms
 * @param {AbortSignal} [signal]
 */
function delay(ms, signal) {
  return new Promise((resolve, reject) => {
    const abortError = () => new DOMException('Запрос отменён', 'AbortError')
    if (signal?.aborted) {
      reject(abortError())
      return
    }
    const timerId = setTimeout(resolve, ms)
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timerId)
        reject(abortError())
      },
      { once: true },
    )
  })
}

// Случайная задержка 300–900 мс — так легче заметить гонку запросов
const randomLatency = () => 300 + Math.round(Math.random() * 600)

/**
 * Данные главной страницы: справочник жанров, статистика, отзывы.
 * @param {AbortSignal} [signal]
 */
export async function fetchHomeData(signal) {
  await delay(700, signal)
  return { categories, stats, testimonials }
}

/**
 * Страница каталога с учётом жанра, поиска и сортировки.
 * @param {{ category: string, query: string, sortBy: string, page: number, perPage: number }} params
 * @param {AbortSignal} [signal]
 * @returns {Promise<{ items: typeof movies, total: number, totalPages: number }>}
 */
export async function fetchMovies({ category, query, sortBy, page, perPage }, signal) {
  await delay(randomLatency(), signal)

  const inCategory = category === ALL_CATEGORY ? movies : movies.filter((movie) => movie.genre === category)
  const found = sortMovies(searchMovies(inCategory, query), sortBy)
  const start = (page - 1) * perPage

  return {
    items: found.slice(start, start + perPage),
    total: found.length,
    totalPages: Math.ceil(found.length / perPage),
  }
}
