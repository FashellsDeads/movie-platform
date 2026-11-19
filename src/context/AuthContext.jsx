import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { login as loginRequest, register as registerRequest, renameAccount } from '../services/api.js'
import { createAvatar, getInitials } from '../utils/placeholders.js'
import { STORAGE_KEYS, readFromStorage, removeFromStorage, writeToStorage } from '../utils/storage.js'

const AVATAR_COLOR = '#e11d48'

/**
 * @typedef {Object} User
 * @property {string} name
 * @property {string} email
 * @property {string} [city]
 * @property {string} avatarUrl — аватар с инициалами
 * @property {string} role — подпись под именем (в отзывах)
 */

/**
 * @typedef {Object} AuthContextValue
 * @property {User | null} user — вошедший зритель или null для гостя
 * @property {boolean} isAuthenticated — выполнен ли вход
 * @property {(credentials: { email: string, password: string }, options?: { remember?: boolean, city?: string }) => Promise<void>} login
 *   — войти; при ошибке промис отклоняется с понятным текстом
 * @property {(values: Object) => Promise<void>} register — зарегистрироваться и сразу войти
 * @property {(name: string) => void} updateName — сменить имя в профиле
 * @property {() => void} logout — выйти
 */

/** AuthContext — состояние авторизации: кто вошёл и как войти или выйти. */
/** @type {import('react').Context<AuthContextValue | null>} */
export const AuthContext = createContext(null)

/** Данные с «сервера» плюс то, что нужно только интерфейсу: аватар и подпись. */
const toSessionUser = ({ name, email, city }) => ({
  name,
  email,
  city,
  avatarUrl: createAvatar(getInitials(name), AVATAR_COLOR),
  role: city ? `Зритель CineVibe · ${city}` : 'Зритель CineVibe',
})

const isValidUser = (user) => typeof user?.name === 'string' && user.name.trim() !== '' && typeof user.email === 'string'

/**
 * Сессия «на эту вкладку» лежит в sessionStorage, «запомнить меня» — в localStorage.
 * Читается синхронно при запуске, поэтому защищённые страницы сразу знают, вошёл ли пользователь.
 */
function readSession() {
  const saved =
    readFromStorage(STORAGE_KEYS.session, null, 'session') ?? readFromStorage(STORAGE_KEYS.session, null, 'local')
  return isValidUser(saved?.user) ? toSessionUser(saved.user) : null
}

function saveSession({ name, email, city }, remember) {
  // В хранилище — только публичные данные, без пароля
  removeFromStorage(STORAGE_KEYS.session, remember ? 'session' : 'local')
  writeToStorage(STORAGE_KEYS.session, { user: { name, email, city } }, remember ? 'local' : 'session')
}

/**
 * Хранит сессию зрителя для всего приложения.
 * @param {{ children: import('react').ReactNode }} props
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSession)

  // useCallback + useMemo(value): функции и значение контекста стабильны, пока не изменились данные,
  // иначе каждый рендер провайдера перерисовывал бы всех потребителей контекста.
  // city — город, выбранный в форме входа: если указан, он становится городом зрителя
  const login = useCallback(async (credentials, { remember = false, city } = {}) => {
    const account = await loginRequest(credentials)
    const sessionAccount = city ? { ...account, city } : account
    saveSession(sessionAccount, remember)
    setUser(toSessionUser(sessionAccount))
  }, [])

  // После регистрации сразу входим; новый аккаунт запоминаем на этом устройстве
  const register = useCallback(async (values) => {
    const account = await registerRequest(values)
    saveSession(account, true)
    setUser(toSessionUser(account))
  }, [])

  const updateName = useCallback(
    (name) => {
      if (!user) return
      const updated = toSessionUser({ ...user, name })
      // Сессия остаётся в том же хранилище: «запомненная» — в localStorage, иначе — в sessionStorage
      const isRemembered = readFromStorage(STORAGE_KEYS.session, null, 'session') === null
      saveSession(updated, isRemembered)
      renameAccount(user.email, name)
      setUser(updated)
    },
    [user],
  )

  const logout = useCallback(() => {
    removeFromStorage(STORAGE_KEYS.session, 'local')
    removeFromStorage(STORAGE_KEYS.session, 'session')
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, isAuthenticated: user !== null, login, register, updateName, logout }),
    [user, login, register, updateName, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Доступ к сессии из любого компонента внутри AuthProvider.
 * @returns {AuthContextValue}
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth нужно вызывать внутри <AuthProvider>')
  return context
}
