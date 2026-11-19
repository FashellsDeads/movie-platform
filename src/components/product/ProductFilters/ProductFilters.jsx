import { ALL, PRODUCT_TYPES, SORT_OPTIONS } from '../../../utils/helpers.js'
import Button from '../../common/Button/Button.jsx'
import SearchInput from '../../common/SearchInput/SearchInput.jsx'
import Select from '../../common/Select/Select.jsx'
import './ProductFilters.css'

/**
 * @typedef {Object} ProductFiltersProps
 * @property {string} query — текст в поиске
 * @property {(query: string) => void} onQueryChange
 * @property {string} type — раздел: all | movie | bar
 * @property {(type: string) => void} onTypeChange
 * @property {string} category — категория или 'all'
 * @property {string[]} categories — категории выбранного раздела
 * @property {(category: string) => void} onCategoryChange
 * @property {string} sortBy — ключ сортировки
 * @property {(sortBy: string) => void} onSortChange
 * @property {() => void} onReset — сбросить все фильтры
 * @property {import('react').Ref<HTMLInputElement>} searchRef — ссылка на поле поиска (SearchInput на forwardRef)
 */

/**
 * Панель фильтров каталога. Своего состояния нет — значения живут в адресе страницы.
 * @param {ProductFiltersProps} props
 */
function ProductFilters({
  query,
  onQueryChange,
  type,
  onTypeChange,
  category,
  categories,
  onCategoryChange,
  sortBy,
  onSortChange,
  onReset,
  searchRef,
}) {
  const categoryOptions = [{ value: ALL, label: 'Все категории' }, ...categories]

  return (
    <div className="product-filters">
      <SearchInput ref={searchRef} value={query} onChange={onQueryChange} label="Поиск по каталогу" placeholder="Фильм или попкорн…" />

      <div className="product-filters__types" role="group" aria-label="Раздел каталога">
        {PRODUCT_TYPES.map((option) => (
          <Button
            key={option.value}
            variant={type === option.value ? 'primary' : 'outline'}
            aria-pressed={type === option.value}
            onClick={() => onTypeChange(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>

      <Select label="Категория" value={category} onChange={onCategoryChange} options={categoryOptions} />
      <Select label="Сортировка" value={sortBy} onChange={onSortChange} options={SORT_OPTIONS} />

      <Button variant="secondary" onClick={onReset}>
        Сбросить фильтры
      </Button>
    </div>
  )
}

export default ProductFilters
