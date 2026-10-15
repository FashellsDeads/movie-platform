import { createContext } from 'react'

/**
 * @typedef {Object} FavoritesContextValue
 * @property {number[]} favoriteIds — id фильмов в избранном
 * @property {(movieId: number) => boolean} isFavorite — есть ли фильм в избранном
 * @property {(movieId: number, shouldAdd: boolean) => void} setFavorite — добавить или убрать фильм
 */

/** ДЗ №6 · избранное стало глобальным: оно нужно шапке, каталогу, странице фильма и странице «Избранное». */
/** @type {import('react').Context<FavoritesContextValue | null>} */
export const FavoritesContext = createContext(null)
