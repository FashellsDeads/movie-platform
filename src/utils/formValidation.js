// ДЗ №13 — проверка динамических полей: правило выбирается по типу поля,
// поэтому новые поля из конструктора проверяются без дополнительного кода.
import { EMAIL_PATTERN } from './validation.js'

// Целое или дробное число; дробь — через точку или запятую (на казахстанской и русской раскладке — запятая)
const NUMBER_PATTERN = /^-?\d+([.,]\d+)?$/

const isEmpty = (value) => (typeof value === 'boolean' ? value === false : String(value ?? '').trim() === '')

/**
 * Ошибка одного поля или '' если всё верно.
 * @param {import('../components/FormProvider/formReducer.js').FormField} field
 * @param {string | boolean} value
 * @returns {string}
 */
export function validateField(field, value) {
  if (isEmpty(value)) return field.required ? 'Обязательное поле' : ''

  const text = String(value).trim()
  if (field.type === 'email' && !EMAIL_PATTERN.test(text)) return 'Введите корректный email'
  if (field.type === 'number' && !NUMBER_PATTERN.test(text)) return 'Введите число'
  return ''
}

/**
 * Ошибки всех полей формы — только непустые.
 * @param {import('../components/FormProvider/formReducer.js').FormField[]} fields
 * @param {Record<string, string | boolean>} values
 * @returns {Record<string, string>}
 */
export function validateFields(fields, values) {
  const errors = {}
  for (const field of fields) {
    const error = validateField(field, values[field.name])
    if (error) errors[field.name] = error
  }
  return errors
}
