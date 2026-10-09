// Обёртки над localStorage: хранилище может быть недоступно
// (приватный режим, запрет cookies), поэтому ошибки не роняют приложение.

export const STORAGE_KEYS = {
  favorites: 'cinevibe:favorites',
  theme: 'cinevibe:theme',
  session: 'cinevibe:session',
  tickets: 'cinevibe:tickets',
}

/**
 * @template T
 * @param {string} key
 * @param {T} fallback — значение, если ключа нет или данные повреждены
 * @returns {T}
 */
export function readFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw === null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

/**
 * @param {string} key
 * @param {unknown} value
 */
export function writeToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // хранилище недоступно — просто не сохраняем
  }
}

/**
 * @param {string} key
 */
export function removeFromStorage(key) {
  try {
    localStorage.removeItem(key)
  } catch {
    // хранилище недоступно — удалять нечего
  }
}
