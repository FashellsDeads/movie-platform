import { useCallback } from 'react'
import { useFavorites } from '../context/FavoritesContext.jsx'
import { useLayout } from './useLayout.js'

/**
 * Добавляет фильм в избранное или убирает его и показывает уведомление.
 * Один и тот же сценарий нужен каталогу, главной, странице фильма и «Избранному».
 * @returns {(movie: { id: number, title: string }, isFavorite: boolean) => void}
 */
export function useToggleFavorite() {
  const { setFavorite } = useFavorites()
  const { showToast } = useLayout()

  // стабильная функция: уходит в memo-карточки каталога — без useCallback memo потерял бы смысл
  return useCallback(
    (movie, isFavorite) => {
      setFavorite(movie.id, isFavorite)
      showToast(isFavorite ? `«${movie.title}» добавлен в избранное` : `«${movie.title}» убран из избранного`)
    },
    [setFavorite, showToast],
  )
}
