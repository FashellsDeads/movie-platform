import { useState } from 'react'
import './FavoriteButton.css'

/**
 * @typedef {Object} FavoriteButtonProps
 * @property {boolean} [initialIsFavorite=false] — был ли фильм в избранном при появлении кнопки
 * @property {(isFavorite: boolean) => void} onToggle — сообщает родителю новое значение
 */

/**
 * Кнопка-сердечко «В избранное» на постере фильма.
 * @param {FavoriteButtonProps} props
 */
function FavoriteButton({ initialIsFavorite = false, onToggle }) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite)

  const handleClick = (event) => {
    // клик по сердечку не должен открывать карточку фильма
    event.stopPropagation()
    const nextValue = !isFavorite
    setIsFavorite(nextValue)
    onToggle(nextValue)
  }

  const label = isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'

  return (
    <button
      type="button"
      className={`favorite-button${isFavorite ? ' favorite-button--active' : ''}`}
      aria-label={label}
      aria-pressed={isFavorite}
      title={label}
      onClick={handleClick}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <path d="M12 20.5s-7.5-4.6-9.3-9.4C1.5 7.9 3.6 4.5 7 4.5c2 0 3.5 1.1 5 3 1.5-1.9 3-3 5-3 3.4 0 5.5 3.4 4.3 6.6-1.8 4.8-9.3 9.4-9.3 9.4z" />
      </svg>
    </button>
  )
}

export default FavoriteButton
