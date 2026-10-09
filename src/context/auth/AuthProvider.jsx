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
  const [isLoginOpen, setIsLoginOpen] = useState(false)

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
    setIsLoginOpen(false)
  }, [])

  const logout = useCallback(() => {
    removeFromStorage(STORAGE_KEYS.session)
    setUser(null)
  }, [])

  const openLogin = useCallback(() => setIsLoginOpen(true), [])
  const closeLogin = useCallback(() => setIsLoginOpen(false), [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      isAuthChecking,
      login,
      logout,
      isLoginOpen,
      openLogin,
      closeLogin,
    }),
    [user, isAuthChecking, login, logout, isLoginOpen, openLogin, closeLogin],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
