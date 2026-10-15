import { useCallback, useEffect, useMemo, useState } from 'react'
import { createSessionToken, fetchSession } from '../../api/cinemaApi.js'
import { STORAGE_KEYS, removeFromStorage, writeToStorage } from '../../utils/storage.js'
import { AuthContext } from './AuthContext.js'

/**
 * Хранит сессию зрителя для всего приложения.
 * @param {{ children: import('react').ReactNode }} props
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthChecking, setIsAuthChecking] = useState(true)

  // Имитация проверки сохранённого токена при загрузке приложения
  useEffect(() => {
    const controller = new AbortController()

    fetchSession(controller.signal)
      .then((sessionUser) => {
        setUser(sessionUser)
        setIsAuthChecking(false)
      })
      .catch((error) => {
        if (error.name === 'AbortError') return
        console.error(error)
        setIsAuthChecking(false)
      })

    return () => controller.abort()
  }, [])

  const login = useCallback((userData) => {
    writeToStorage(STORAGE_KEYS.session, { token: createSessionToken(userData.email), user: userData })
    setUser(userData)
  }, [])

  const logout = useCallback(() => {
    removeFromStorage(STORAGE_KEYS.session)
    setUser(null)
  }, [])

  // с ДЗ №6 вход — отдельная страница /login, поэтому состояния окна входа здесь больше нет
  const value = useMemo(
    () => ({ user, isAuthenticated: user !== null, isAuthChecking, login, logout }),
    [user, isAuthChecking, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
