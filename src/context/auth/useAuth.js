import { useContext } from 'react'
import { AuthContext } from './AuthContext.js'

/**
 * Доступ к сессии из любого компонента внутри AuthProvider.
 * @returns {import('./AuthContext.js').AuthContextValue}
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth нужно вызывать внутри <AuthProvider>')
  return context
}
