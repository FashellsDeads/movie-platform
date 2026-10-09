import { useCallback, useEffect, useMemo, useState } from 'react'
import { STORAGE_KEYS, readFromStorage, writeToStorage } from '../../utils/storage.js'
import { ThemeContext } from './ThemeContext.js'

const isTheme = (value) => value === 'light' || value === 'dark'
const hasSavedTheme = () => isTheme(readFromStorage(STORAGE_KEYS.theme, null))

/**
 * Хранит тему для всего приложения.
 * @param {{ children: import('react').ReactNode }} props
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark')

  // ДЗ №4 · #3 — при старте восстанавливаем тему, выбранную пользователем
  useEffect(() => {
    const savedTheme = readFromStorage(STORAGE_KEYS.theme, null)
    // по заданию ДЗ №4 сохранённые данные читаются в эффекте при монтировании
    // oxlint-disable-next-line react/set-state-in-effect
    if (isTheme(savedTheme)) setTheme(savedTheme)
  }, [])

  // ДЗ №4 · #15 — тема по настройкам ОС, пока пользователь не выбрал её сам
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const applySystemTheme = (isDark) => setTheme(isDark ? 'dark' : 'light')

    // начальная синхронизация с внешней системой (настройками ОС)
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

  const value = useMemo(() => ({ theme, isDarkMode: theme === 'dark', toggleTheme }), [theme, toggleTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
