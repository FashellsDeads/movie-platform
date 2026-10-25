import './FormField.css'

/**
 * @typedef {Object} FormFieldProps
 * @property {string} id — id поля; ошибка получает id `${id}-error` для aria-describedby
 * @property {string} label — подпись
 * @property {string} [hint] — подсказка под полем, пока нет ошибки
 * @property {string} [error] — текст ошибки; пусто — ошибка не показывается
 * @property {boolean} [isGroup=false] — группа radio/checkbox: fieldset + legend вместо label
 * @property {import('react').ReactNode} children — само поле или группа вариантов
 */

/**
 * Обёртка поля формы: подпись, поле (children) и ошибка прямо под ним.
 * @param {FormFieldProps} props
 */
function FormField({ id, label, hint, error, isGroup = false, children }) {
  const message = error ? (
    <p className="form-field__error" id={`${id}-error`} role="alert">
      {error}
    </p>
  ) : (
    hint && <p className="form-field__hint">{hint}</p>
  )

  // у группы нет одного поля, к которому привязать label, — её подписывает legend
  if (isGroup) {
    return (
      <fieldset
        className={`form-field form-field--group${error ? ' form-field--invalid' : ''}`}
        aria-describedby={error ? `${id}-error` : undefined}
      >
        <legend className="form-field__label">{label}</legend>
        {children}
        {message}
      </fieldset>
    )
  }

  return (
    <div className={`form-field${error ? ' form-field--invalid' : ''}`}>
      <label className="form-field__label" htmlFor={id}>
        {label}
      </label>
      {children}
      {message}
    </div>
  )
}

export default FormField
