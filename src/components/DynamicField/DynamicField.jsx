import { useId } from 'react'
import Input from '../Input/Input.jsx'
import { useForm } from '../FormProvider/useForm.js'
import './DynamicField.css'

/**
 * Варианты могут быть строками (из конструктора — как ввёл пользователь, с пробелами)
 * или парами { value, label }. Пустые варианты не показываются.
 */
const toOptions = (options = []) =>
  options
    .map((option) => (typeof option === 'string' ? { value: option.trim(), label: option.trim() } : option))
    .filter((option) => option.label !== '')

function FieldLabel({ field }) {
  return (
    <>
      {field.label}
      {field.required && (
        <span className="dynamic-field__required" aria-hidden="true">
          *
        </span>
      )}
    </>
  )
}

function FieldError({ id, error }) {
  if (!error) return null
  return (
    <p id={id} className="ui-input__error" role="alert">
      {error}
    </p>
  )
}

/**
 * ДЗ №13 — Dynamic Component: получает описание поля и сам решает,
 * какой элемент отрисовать. Значение и ошибку берёт из FormProvider.
 * @param {{ field: import('../FormProvider/formReducer.js').FormField }} props
 */
function DynamicField({ field }) {
  const { values, errors, updateValue } = useForm()
  const fieldId = useId()
  const errorId = `${fieldId}-error`
  const value = values[field.name]
  const error = errors[field.name]
  const errorProps = { 'aria-invalid': error ? true : undefined, 'aria-describedby': error ? errorId : undefined }

  switch (field.type) {
    case 'select':
      return (
        <div className="ui-input">
          <label className="ui-input__label" htmlFor={fieldId}>
            <FieldLabel field={field} />
          </label>
          <select
            id={fieldId}
            className={`ui-input__field${error ? ' ui-input__field--invalid' : ''}`}
            value={value}
            required={field.required}
            onChange={(event) => updateValue(field.name, event.target.value)}
            {...errorProps}
          >
            <option value="">Выберите…</option>
            {toOptions(field.options).map((option, index) => (
              <option key={`${index}-${option.value}`} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <FieldError id={errorId} error={error} />
        </div>
      )

    case 'checkbox':
      return (
        <div className="dynamic-field__choice-wrap">
          <label className="dynamic-field__choice">
            <input
              type="checkbox"
              checked={Boolean(value)}
              required={field.required}
              onChange={(event) => updateValue(field.name, event.target.checked)}
              {...errorProps}
            />
            <span>
              <FieldLabel field={field} />
            </span>
          </label>
          <FieldError id={errorId} error={error} />
        </div>
      )

    case 'radio':
      return (
        <fieldset className="dynamic-field__group" {...(error ? { 'aria-describedby': errorId } : {})}>
          <legend className="ui-input__label">
            <FieldLabel field={field} />
          </legend>
          <div className="dynamic-field__options">
            {toOptions(field.options).map((option, index) => (
              <label key={`${index}-${option.value}`} className="dynamic-field__choice">
                <input
                  type="radio"
                  name={`${fieldId}-${field.name}`}
                  value={option.value}
                  checked={value === option.value}
                  onChange={() => updateValue(field.name, option.value)}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
          <FieldError id={errorId} error={error} />
        </fieldset>
      )

    default:
      // text, email, number, password — одно управляемое поле Input.
      // number рисуется как текст с цифровой клавиатурой: <input type="number"> вместо «2x»
      // отдаёт пустую строку, и проверка «Введите число» никогда бы не сработала.
      return (
        <Input
          id={fieldId}
          label={<FieldLabel field={field} />}
          type={field.type === 'number' ? 'text' : field.type}
          value={value}
          placeholder={field.placeholder}
          required={field.required}
          inputMode={field.type === 'number' ? 'decimal' : undefined}
          error={error}
          onChange={(nextValue) => updateValue(field.name, nextValue)}
        />
      )
  }
}

export default DynamicField
