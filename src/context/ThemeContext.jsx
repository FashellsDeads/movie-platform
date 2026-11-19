import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { STORAGE_KEYS, readFromStorage, writeToStorage } from '../utils/storage.js'

/**
 * @typedef {'light' | 'dark'} Theme
 */

/**
 * @typedef {Object} ThemeContextValue
 * @property {Theme} theme — текущая тема
 * @property {boolean} isDarkMode — включена ли тёмная тема
 * @property {() => void} toggleTheme — переключить тему и запомнить выбор
 */

/** ThemeContext — глобальная тема оформления. */
/** @type {import('react').Context<ThemeContextValue | null>} */
export const ThemeContext = createContext(null)

const isTheme = (value) => value === 'light' || value === 'dark'
const hasSavedTheme = () => isTheme(readFromStorage(STORAGE_KEYS.theme, null))

/**
 * Хранит тему для всего приложения.
 * @param {{ children: import('react').ReactNode }} props
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark')

  // При старте восстанавливаем тему, выбранную пользователем
  useEffect(() => {
    const savedTheme = readFromStorage(STORAGE_KEYS.theme, null)
    // Сохранённые данные читаются в эффекте при монтировании
    // oxlint-disable-next-line react/set-state-in-effect
    if (isTheme(savedTheme)) setTheme(savedTheme)
  }, [])

  // Тема по настройкам ОС, пока пользователь не выбрал её сам
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const applySystemTheme = (isDark) => setTheme(isDark ? 'dark' : 'light')

    // Начальная синхронизация с внешней системой (настройками ОС)
    // oxlint-disable-next-line react/set-state-in-effect
    if (!hasSavedTheme()) applySystemTheme(media.matches)

    const handleChange = (event) => {
      if (!hasSavedTheme()) applySystemTheme(event.matches)
    }

    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [])

  // Выбор сохраняется только по клику: тема из настроек ОС не считается выбором пользователя
  const toggleTheme = useCallback(() => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
    writeToStorage(STORAGE_KEYS.theme, nextTheme)
  }, [theme])

  // значение контекста меняется только при смене темы — потребители не перерисовываются зря
  const value = useMemo(() => ({ theme, isDarkMode: theme === 'dark', toggleTheme }), [theme, toggleTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

/**
 * Доступ к теме из любого компонента внутри ThemeProvider.
 * @returns {import('./ThemeContext.jsx').ThemeContextValue}
 */
export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme нужно вызывать внутри <ThemeProvider>')
  return context
}
