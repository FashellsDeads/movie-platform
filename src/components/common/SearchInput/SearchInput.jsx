import { forwardRef, useId } from 'react'
import '../Input/Input.css'
import './SearchInput.css'

/**
 * @typedef {Object} SearchInputProps
 * @property {string} value — текущий запрос
 * @property {(value: string) => void} onChange — новый запрос строкой
 * @property {string} [placeholder='Поиск…']
 * @property {string} [label='Поиск'] — подпись (видна экранному диктору)
 */

/**
 * forwardRef: родитель получает ссылку на настоящий DOM-элемент <input>
 * и может, например, поставить в него фокус: inputRef.current.focus().
 */
const SearchInput = forwardRef(
  /**
   * @param {SearchInputProps} props
   * @param {import('react').ForwardedRef<HTMLInputElement>} ref
   */
  function SearchInput({ value, onChange, placeholder = 'Поиск…', label = 'Поиск' }, ref) {
    const inputId = useId()

    return (
      <div className="search-input">
        <label className="visually-hidden" htmlFor={inputId}>
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          type="search"
          className="ui-input__field search-input__field"
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    )
  },
)

export default SearchInput
