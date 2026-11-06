// Тестовые данные и подмена fetch: тесты не ходят в настоящий API.
import { vi } from 'vitest'

export const mockUsers = [
  {
    id: 1,
    name: 'Leanne Graham',
    username: 'Bret',
    email: 'leanne@april.biz',
    phone: '1-770-736-8031',
    website: 'hildegard.org',
    address: { city: 'Gwenborough' },
    company: { name: 'Romaguera-Crona' },
  },
  {
    id: 2,
    name: 'Ervin Howell',
    username: 'Antonette',
    email: 'ervin@melissa.tv',
    phone: '010-692-6593',
    website: 'anastasia.net',
    address: { city: 'Wisokyburgh' },
    company: { name: 'Deckow-Crist' },
  },
  {
    id: 3,
    name: 'Clementine Bauch',
    username: 'Samantha',
    email: 'nathan@yesenia.net',
    phone: '1-463-123-4447',
    website: 'ramiro.info',
    address: { city: 'McKenziehaven' },
    company: { name: 'Romaguera-Jacobson' },
  },
]

/**
 * Успешный ответ сервера с JSON.
 * @param {unknown} body
 */
export const jsonResponse = (body) => ({ ok: true, status: 200, json: async () => body })

/**
 * Ответ сервера с ошибкой.
 * @param {number} status
 */
export const errorResponse = (status) => ({ ok: false, status, json: async () => ({}) })

/** Подменяет глобальный fetch на управляемый из теста. */
export function stubFetch() {
  const fetchMock = vi.fn()
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}
