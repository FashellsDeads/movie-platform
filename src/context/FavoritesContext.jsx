import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { STORAGE_KEYS, readFromStorage, writeToStorage } from '../utils/storage.js'

/**
 * @typedef {Object} FavoritesContextValue
 * @property {number[]} favoriteIds — id фильмов в избранном
 * @property {(movieId: number) => boolean} isFavorite — есть ли фильм в избранном
 * @property {(movieId: number, shouldAdd: boolean) => void} setFavorite — добавить или убрать фильм
 */

/** Избранное стало глобальным: оно нужно шапке, каталогу, странице фильма и странице «Избранное». */
/** @type {import('react').Context<FavoritesContextValue | null>} */
export const FavoritesContext = createContext(null)

/**
 * Хранит избранное для всех страниц.
 * @param {{ children: import('react').ReactNode }} props
 */
export function FavoritesProvider({ children }) {
  // Избранное восстанавливается из localStorage один раз при создании состояния
  const [favoriteIds, setFavoriteIds] = useState(() => {
    const saved = readFromStorage(STORAGE_KEYS.favorites, [])
    return Array.isArray(saved) ? saved.filter(Number.isInteger) : []
  })

  // Синхронизация избранного с localStorage при каждом изменении
  useEffect(() => {
    writeToStorage(STORAGE_KEYS.favorites, favoriteIds)
  }, [favoriteIds])

  // useCallback + useMemo(value): функции и значение контекста стабильны, пока не изменились данные,
  // иначе каждый рендер провайдера перерисовывал бы всех потребителей контекста
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

/**
 * Доступ к избранному из любого компонента внутри FavoritesProvider.
 * @returns {import('./FavoritesContext.jsx').FavoritesContextValue}
 */
export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) throw new Error('useFavorites нужно вызывать внутри <FavoritesProvider>')
  return context
}
