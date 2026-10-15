import { createContext } from 'react'

/**
 * @typedef {import('../../components/UserProfile/UserProfile.jsx').User} User
 */

/**
 * @typedef {Object} AuthContextValue
 * @property {User | null} user — вошедший зритель или null для гостя
 * @property {boolean} isAuthenticated — выполнен ли вход
 * @property {boolean} isAuthChecking — идёт ли проверка сохранённой сессии
 * @property {(userData: User) => void} login — войти
 * @property {() => void} logout — выйти
 */

/** ДЗ №5 · AuthContext — сессия и профиль пользователя. */
/** @type {import('react').Context<AuthContextValue | null>} */
export const AuthContext = createContext(null)
