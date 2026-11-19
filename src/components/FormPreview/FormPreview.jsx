import { useState } from 'react'
import Button from '../Button/Button.jsx'
import DynamicField from '../DynamicField/DynamicField.jsx'
import { useForm } from '../FormProvider/useForm.js'
import './FormPreview.css'

/**
 * Объект «подпись → значение». Подписи могут совпадать или быть пустыми —
 * тогда ключ уточняется, чтобы ни одно значение не пропало.
 */
function toSubmittedObject(fields, values) {
  const seen = new Map()
  const result = {}
  for (const field of fields) {
    const base = field.label.trim() || field.name
    const count = (seen.get(base) ?? 0) + 1
    seen.set(base, count)
    result[count === 1 ? base : `${base} (${count})`] = values[field.name]
  }
  return result
}

/**
 * ДЗ №13 — FormPreview: форма глазами конечного пользователя.
 * Submit проверяет поля и показывает объект со всеми введёнными значениями.
 */
function FormPreview() {
  const { fields, values, validate } = useForm()
  const [submitted, setSubmitted] = useState(null)

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!validate()) {
      setSubmitted(null)
      return
    }
    // ключи — подписи полей, как их видит пользователь
    setSubmitted(toSubmittedObject(fields, values))
  }

  return (
    <div className="form-preview">
      <form className="form-preview__form" onSubmit={handleSubmit} noValidate>
        {fields.length === 0 && <p className="form-preview__empty">Добавьте поля в режиме Edit.</p>}
        {fields.map((field) => (
          <DynamicField key={field.id} field={field} />
        ))}
        <Button type="submit" disabled={fields.length === 0}>
          Submit
        </Button>
      </form>

      {submitted && (
        <div className="form-preview__result" role="status">
          <p className="form-preview__result-title">Форма отправлена:</p>
          <pre data-testid="submit-result">{JSON.stringify(submitted, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

export default FormPreview
