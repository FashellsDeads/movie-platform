import { useId } from 'react'
import './Input.css'

/**
 * @typedef {Object} InputProps
 * @property {import('react').ReactNode} label — подпись поля
 * @property {string} [value] — значение от родителя: если передано, поле управляемое (controlled)
 * @property {string} [defaultValue] — начальное значение неуправляемого поля (uncontrolled)
 * @property {(value: string, event: import('react').ChangeEvent<HTMLInputElement>) => void} [onChange]
 *   — новое значение строкой (первым аргументом), событие — вторым
 * @property {string} [error] — текст ошибки под полем
 * @property {string} [id] — id поля; по умолчанию генерируется
 * @property {string} [type='text'] — тип поля
 * @property {import('react').Ref<HTMLInputElement>} [ref] — ссылка на сам <input>
 */

/**
 * ДЗ №13 — один компонент для двух режимов.
 * Controlled: <Input value={name} onChange={setName} /> — значение хранит родитель.
 * Uncontrolled: <Input defaultValue="John" /> — значение живёт в DOM, читается через ref.
 * @param {InputProps & Omit<import('react').InputHTMLAttributes<HTMLInputElement>, 'onChange'>} props
 */
function Input({ label, value, defaultValue, onChange, error, id, type = 'text', ref, className, ...rest }) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = `${inputId}-error`
  const isControlled = value !== undefined

  return (
    <div className={['ui-input', className].filter(Boolean).join(' ')}>
      <label className="ui-input__label" htmlFor={inputId}>
        {label}
      </label>
      <input
        {...rest}
        ref={ref}
        id={inputId}
        type={type}
        className={`ui-input__field${error ? ' ui-input__field--invalid' : ''}`}
        // в каждый момент передаётся ровно один из двух props — иначе React предупредит о смене режима
        {...(isControlled ? { value } : { defaultValue })}
        onChange={(event) => onChange?.(event.target.value, event)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
      />
      {error && (
        <p id={errorId} className="ui-input__error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export default Input
