import { useCallback, useEffect, useMemo, useState } from 'react'
import { STORAGE_KEYS, readFromStorage, writeToStorage } from '../../utils/storage.js'
import { FavoritesContext } from './FavoritesContext.js'

/**
 * Хранит избранное для всех страниц.
 * @param {{ children: import('react').ReactNode }} props
 */
export function FavoritesProvider({ children }) {
  // избранное восстанавливается из localStorage один раз при создании состояния
  const [favoriteIds, setFavoriteIds] = useState(() => readFromStorage(STORAGE_KEYS.favorites, []))

  // ДЗ №4 · #2 — синхронизация избранного с localStorage при каждом изменении
  useEffect(() => {
    writeToStorage(STORAGE_KEYS.favorites, favoriteIds)
  }, [favoriteIds])

  const setFavorite = useCallback((movieId, shouldAdd) => {
    setFavoriteIds((prev) => {
      const withoutMovie = prev.filter((id) => id !== movieId)
      return shouldAdd ? [...withoutMovie, movieId] : withoutMovie
    })
  }, [])

  const isFavorite = useCallback((movieId) => favoriteIds.includes(movieId), [favoriteIds])

  const value = useMemo(() => ({ favoriteIds, isFavorite, setFavorite }), [favoriteIds, isFavorite, setFavorite])

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}
