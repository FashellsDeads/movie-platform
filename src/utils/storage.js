// Обёртки над localStorage: хранилище может быть недоступно
// (приватный режим, запрет cookies), поэтому ошибки не роняют приложение.

export const STORAGE_KEYS = {
  favorites: 'cinevibe:favorites',
  theme: 'cinevibe:theme',
  session: 'cinevibe:session',
  tickets: 'cinevibe:tickets',
  orders: 'cinevibe:orders',
  accounts: 'cinevibe:accounts',
  reviews: 'cinevibe:reviews',
}

// store — какое хранилище: localStorage (по умолчанию, переживает закрытие браузера)
// или sessionStorage (живёт, пока открыта вкладка — вход без «Запомнить меня»)
// (сам доступ к localStorage может бросить ошибку при запрете cookies — поэтому он внутри try)
const resolveStore = (store) => (store === 'session' ? globalThis.sessionStorage : globalThis.localStorage)

/**
 * @template T
 * @param {string} key
 * @param {T} fallback — значение, если ключа нет или данные повреждены
 * @param {'local' | 'session'} [store='local']
 * @returns {T}
 */
export function readFromStorage(key, fallback, store) {
  try {
    const raw = resolveStore(store).getItem(key)
    return raw === null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

/**
 * @param {string} key
 * @param {unknown} value
 * @param {'local' | 'session'} [store='local']
 */
export function writeToStorage(key, value, store) {
  try {
    resolveStore(store).setItem(key, JSON.stringify(value))
  } catch {
    // Хранилище недоступно — просто не сохраняем
  }
}

/**
 * @param {string} key
 * @param {'local' | 'session'} [store='local']
 */
export function removeFromStorage(key, store) {
  try {
    resolveStore(store).removeItem(key)
  } catch {
    // Хранилище недоступно — удалять нечего
  }
}
