// Вся работа с «сервером» — в одном месте. Компоненты не знают адресов и форматов ответов.
//
// Каталог — настоящие запросы fetch к JSON-файлам в public/api/ (их собирает `npm run api`).
// Учётные записи — имитация сервера в localStorage: настоящего бэкенда у проекта нет.
import { STORAGE_KEYS, readFromStorage, writeToStorage } from '../utils/storage.js'

export const API_BASE = `${import.meta.env.BASE_URL}api`

export const productsUrl = () => `${API_BASE}/products.json`
export const productUrl = (id) => `${API_BASE}/products/${encodeURIComponent(id)}.json`
export const homeUrl = () => `${API_BASE}/home.json`

/**
 * Понятное пользователю сообщение для ответа сервера с ошибкой.
 * @param {number} status — HTTP-статус
 */
export function getStatusMessage(status) {
  if (status === 404) return 'Такие данные не найдены (ошибка 404).'
  if (status >= 500) return `Сервер временно не работает (ошибка ${status}). Попробуйте ещё раз чуть позже.`
  return `Сервер отклонил запрос (ошибка ${status}).`
}

/**
 * GET-запрос, который возвращает JSON или выбрасывает Error с понятным текстом.
 * Используется и в useFetch, и в DataLoader — сообщения об ошибках везде одинаковые.
 * @param {string} url
 * @param {AbortSignal} [signal]
 * @returns {Promise<any>}
 */
export async function getJson(url, signal) {
  let response
  try {
    response = await fetch(url, { signal })
  } catch (err) {
    if (err.name === 'AbortError') throw err
    throw new Error('Не удалось связаться с сервером. Проверьте интернет и попробуйте снова.', { cause: err })
  }

  // fetch не считает ответы 404 и 500 ошибкой — проверяем статус сами
  if (!response.ok) throw new Error(getStatusMessage(response.status))

  // Dev-сервер на несуществующий файл может отдать index.html со статусом 200 — это тоже «не найдено»
  const contentType = response.headers?.get('content-type') ?? ''
  if (contentType && !contentType.includes('json')) throw new Error(getStatusMessage(404))

  try {
    return await response.json()
  } catch (err) {
    if (err.name === 'AbortError') throw err
    throw new Error('Сервер прислал данные, которые не удалось прочитать.', { cause: err })
  }
}

// ---------- Учётные записи (имитация сервера) ----------

const RESPONSE_DELAY = 400

/** Аккаунт для входа без регистрации — подсказка есть на странице входа. Не хранится в localStorage. */
export const DEMO_ACCOUNT = {
  name: 'Жумагали Адильжан',
  email: 'adilzhan@cinevibe.kz',
  password: 'cinevibe',
  city: 'Алматы',
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const normalizeEmail = (email) => String(email ?? '').trim().toLowerCase()

/**
 * SHA-256 пароля в hex — даже в учебном проекте пароль не лежит открытым текстом.
 * Если Web Crypto недоступен (старый браузер, тестовая среда) — простая пометка, только для демо.
 * @param {string} password
 * @returns {Promise<string>}
 */
export async function hashPassword(password) {
  const subtle = globalThis.crypto?.subtle
  if (!subtle) return `plain:${password}`
  const bytes = await subtle.digest('SHA-256', new TextEncoder().encode(password))
  return [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

const isValidAccount = (account) =>
  typeof account?.email === 'string' && typeof account.passwordHash === 'string' && typeof account.name === 'string'

function readAccounts() {
  const saved = readFromStorage(STORAGE_KEYS.accounts, [])
  return Array.isArray(saved) ? saved.filter(isValidAccount) : []
}

/** Публичные данные пользователя — без пароля. */
const toUser = ({ name, email, city }) => ({ name, email, city })

/**
 * @typedef {Object} User
 * @property {string} name
 * @property {string} email
 * @property {string} city
 */

/**
 * Регистрация: сохраняет аккаунт и возвращает пользователя.
 * @param {{ name: string, email: string, password: string, city: string, gender?: string }} values
 * @returns {Promise<User>}
 */
export async function register({ name, email, password, city, gender }) {
  await wait(RESPONSE_DELAY)
  const normalizedEmail = normalizeEmail(email)
  const accounts = readAccounts()

  if (normalizedEmail === DEMO_ACCOUNT.email || accounts.some((account) => account.email === normalizedEmail)) {
    throw new Error('Такой email уже зарегистрирован')
  }

  const account = { name: name.trim(), email: normalizedEmail, passwordHash: await hashPassword(password), city, gender }
  writeToStorage(STORAGE_KEYS.accounts, [...accounts, account])
  return toUser(account)
}

/**
 * Вход по email и паролю.
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<User>}
 */
export async function login({ email, password }) {
  await wait(RESPONSE_DELAY)
  const normalizedEmail = normalizeEmail(email)

  if (normalizedEmail === DEMO_ACCOUNT.email && password === DEMO_ACCOUNT.password) return toUser(DEMO_ACCOUNT)

  const account = readAccounts().find((item) => item.email === normalizedEmail)
  if (!account || account.passwordHash !== (await hashPassword(password))) {
    throw new Error('Неверный email или пароль')
  }
  return toUser(account)
}

/**
 * Новое имя в сохранённой учётной записи (у демо-аккаунта учётной записи в хранилище нет).
 * @param {string} email
 * @param {string} name
 */
export function renameAccount(email, name) {
  const normalizedEmail = normalizeEmail(email)
  const accounts = readAccounts()
  if (!accounts.some((account) => account.email === normalizedEmail)) return
  writeToStorage(
    STORAGE_KEYS.accounts,
    accounts.map((account) => (account.email === normalizedEmail ? { ...account, name } : account)),
  )
}
