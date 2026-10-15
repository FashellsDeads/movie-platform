import { useContext } from 'react'
import { FavoritesContext } from './FavoritesContext.js'

/**
 * Доступ к избранному из любого компонента внутри FavoritesProvider.
 * @returns {import('./FavoritesContext.js').FavoritesContextValue}
 */
export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) throw new Error('useFavorites нужно вызывать внутри <FavoritesProvider>')
  return context
}
