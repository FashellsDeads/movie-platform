import './SortDropdown.css'

/**
 * @typedef {Object} SortOption
 * @property {string} value — ключ сортировки
 * @property {string} label — подпись в списке
 */

/**
 * @typedef {Object} SortDropdownProps
 * @property {SortOption[]} options — варианты сортировки
 * @property {string} value — выбранный вариант
 * @property {(value: string) => void} onChange — смена сортировки
 */

/**
 * Выпадающий список сортировки каталога.
 * @param {SortDropdownProps} props
 */
function SortDropdown({ options, value, onChange }) {
  return (
    <label className="sort-dropdown">
      <span className="sort-dropdown__label">Сортировка</span>
      <select className="sort-dropdown__select" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

export default SortDropdown
