import './CategoryFilter.css'

/**
 * @typedef {Object} CategoryFilterProps
 * @property {string[]} categories — список жанров
 * @property {string} activeCategory — выбранный жанр
 * @property {(category: string) => void} onSelect — выбор жанра
 */

/**
 * Фильтр каталога по жанрам.
 * @param {CategoryFilterProps} props
 */
function CategoryFilter({ categories, activeCategory, onSelect }) {
  return (
    <div className="category-filter" role="group" aria-label="Фильтр по жанрам">
      {categories.map((category) => {
        const isActive = category === activeCategory

        return (
          <button
            key={category}
            type="button"
            className={`category-filter__item${isActive ? ' category-filter__item--active' : ''}`}
            aria-pressed={isActive}
            onClick={() => onSelect(category)}
          >
            {category}
          </button>
        )
      })}
    </div>
  )
}

export default CategoryFilter
