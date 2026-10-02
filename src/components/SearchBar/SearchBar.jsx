import './SearchBar.css'

/**
 * @typedef {Object} SearchBarProps
 * @property {string} value — текущий поисковый запрос
 * @property {(value: string) => void} onChange — изменение запроса
 * @property {string} [placeholder] — подсказка в поле
 */

/**
 * Контролируемое поле поиска фильмов по названию.
 * @param {SearchBarProps} props
 */
function SearchBar({ value, onChange, placeholder = 'Поиск по названию…' }) {
  return (
    <div className="search-bar">
      <svg className="search-bar__icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path d="M10.5 4a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM20 20l-4.6-4.6" />
      </svg>
      <input
        className="search-bar__input"
        type="search"
        value={value}
        placeholder={placeholder}
        aria-label="Поиск фильмов"
        onChange={(event) => onChange(event.target.value)}
      />
      {value && (
        <button type="button" className="search-bar__clear" aria-label="Очистить поиск" onClick={() => onChange('')}>
          ×
        </button>
      )}
    </div>
  )
}

export default SearchBar
