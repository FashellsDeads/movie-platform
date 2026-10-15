import { useCallback } from 'react'
import { useFavorites } from '../context/favorites/useFavorites.js'
import { useLayout } from './useLayout.js'

/**
 * Добавляет фильм в избранное или убирает его и показывает уведомление.
 * Один и тот же сценарий нужен каталогу, главной, странице фильма и «Избранному».
 * @returns {(movie: { id: number, title: string }, isFavorite: boolean) => void}
 */
export function useToggleFavorite() {
  const { setFavorite } = useFavorites()
  const { showToast } = useLayout()

  return useCallback(
    (movie, isFavorite) => {
      setFavorite(movie.id, isFavorite)
      showToast(isFavorite ? `«${movie.title}» добавлен в избранное` : `«${movie.title}» убран из избранного`)
    },
    [setFavorite, showToast],
  )
}
