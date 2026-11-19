import { useState } from 'react'
import Button from '../../common/Button/Button.jsx'
import DynamicField from '../DynamicField/DynamicField.jsx'
import FormProvider from '../FormProvider/FormProvider.jsx'
import { useForm } from '../FormProvider/useForm.js'
import './SchemaForm.css'

/**
 * @typedef {Object} SchemaFormProps
 * @property {import('../FormProvider/formReducer.js').FormField[]} fields — описание полей
 * @property {string} label — название формы для экранного диктора (role=form)
 * @property {string} submitText — надпись на кнопке отправки
 * @property {string} pendingText — надпись, пока ждём ответа сервера
 * @property {(values: Record<string, string | boolean>) => Promise<void>} onSubmit
 *   — отправка; отклонённый промис показывается как ошибка над кнопками
 * @property {(values: Record<string, string | boolean>) => Record<string, string>} [getExtraErrors]
 *   — проверки, которых нет в правилах полей (пустая строка — проверка пройдена)
 */

function SchemaFormBody({ label, submitText, pendingText, onSubmit, getExtraErrors }) {
  const { fields, values, validate, resetForm } = useForm()
  const [serverError, setServerError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setServerError('')
    if (!validate(getExtraErrors?.(values))) return

    setIsSubmitting(true)
    try {
      await onSubmit(values)
    } catch (err) {
      setServerError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    resetForm()
    setServerError('')
  }

  return (
    <form className="schema-form" aria-label={label} onSubmit={handleSubmit} noValidate>
      {fields.map((field) => (
        <DynamicField key={field.id} field={field} />
      ))}

      {serverError && (
        <p className="schema-form__server-error" role="alert">
          {serverError}
        </p>
      )}

      <div className="schema-form__actions">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? pendingText : submitText}
        </Button>
        <Button variant="secondary" onClick={handleReset} disabled={isSubmitting}>
          Сбросить
        </Button>
      </div>
    </form>
  )
}

/**
 * Управляемая форма по описанию полей: значения в FormProvider (useReducer + Context),
 * поля рисует DynamicField, проверка — formValidation. Используется для входа и регистрации.
 * @param {SchemaFormProps} props
 */
function SchemaForm({ fields, ...props }) {
  return (
    <FormProvider initialFields={fields}>
      <SchemaFormBody {...props} />
    </FormProvider>
  )
}

export default SchemaForm
