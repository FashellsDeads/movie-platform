// Подмена fetch в тестах: вместо сети — те же JSON-файлы, что отдаёт сайт из public/api/.
import { vi } from 'vitest'
import home from '../../../public/api/home.json'
import products from '../../../public/api/products.json'

const productFiles = import.meta.glob('../../../public/api/products/*.json', { eager: true, import: 'default' })
const productsById = new Map(Object.values(productFiles).map((product) => [String(product.id), product]))

/** Каталог из public/api/products.json — для проверок в тестах. */
export const catalog = products

/**
 * Успешный ответ сервера с JSON.
 * @param {unknown} body
 */
export const jsonResponse = (body) => ({
  ok: true,
  status: 200,
  headers: new Headers({ 'content-type': 'application/json' }),
  json: async () => body,
})

/**
 * Ответ сервера с ошибкой.
 * @param {number} status
 */
export const errorResponse = (status) => ({ ok: false, status, headers: new Headers(), json: async () => ({}) })

/** Подменяет глобальный fetch на управляемый из теста. */
export function stubFetch() {
  const fetchMock = vi.fn()
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

/** Ответ «сервера» по адресу — как у настоящего public/api. */
export function respondLikeApi(url) {
  if (url.endsWith('/api/products.json')) return jsonResponse(products)
  if (url.endsWith('/api/home.json')) return jsonResponse(home)
  const match = url.match(/\/api\/products\/([^/]+)\.json$/)
  const product = match && productsById.get(decodeURIComponent(match[1]))
  return product ? jsonResponse(product) : errorResponse(404)
}

/**
 * fetch, который отвечает данными из public/api.
 * @param {Record<string, (url: string, init: RequestInit) => Promise<unknown>>} [overrides]
 *   — свой ответ для адреса: ошибка, задержка (отложенный промис) и т. п.
 */
export function stubApi(overrides = {}) {
  const fetchMock = stubFetch()
  fetchMock.mockImplementation(async (url, init) => {
    const override = overrides[url]
    if (override) return override(url, init)
    return respondLikeApi(url)
  })
  return fetchMock
}
