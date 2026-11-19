import { useId } from 'react'
import '../Input/Input.css'

/**
 * @typedef {Object} SelectProps
 * @property {import('react').ReactNode} label — подпись
 * @property {string} value — выбранное значение (управляемый компонент)
 * @property {(value: string) => void} onChange — новый выбор строкой
 * @property {Array<string | { value: string, label: string }>} options — варианты
 * @property {string} [placeholder] — пустой первый вариант
 * @property {string} [error] — текст ошибки
 * @property {string} [id]
 */

/**
 * Выпадающий список с тем же API, что у Input: value + onChange(строка).
 * @param {SelectProps & Omit<import('react').SelectHTMLAttributes<HTMLSelectElement>, 'onChange'>} props
 */
function Select({ label, value, onChange, options, placeholder, error, id, className, ...rest }) {
  const generatedId = useId()
  const selectId = id ?? generatedId
  const errorId = `${selectId}-error`

  return (
    <div className={['ui-input', className].filter(Boolean).join(' ')}>
      <label className="ui-input__label" htmlFor={selectId}>
        {label}
      </label>
      <select
        {...rest}
        id={selectId}
        className={`ui-input__field${error ? ' ui-input__field--invalid' : ''}`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((option) => {
          const { value: optionValue, label: optionLabel } =
            typeof option === 'string' ? { value: option, label: option } : option
          return (
            <option key={optionValue} value={optionValue}>
              {optionLabel}
            </option>
          )
        })}
      </select>
      {error && (
        <p id={errorId} className="ui-input__error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export default Select
