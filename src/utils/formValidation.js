// Проверка полей формы: правило выбирается по типу поля, поэтому любая форма,
// описанная массивом полей (вход, регистрация), проверяется без дополнительного кода.

export const EMAIL_PATTERN = /^\S+@\S+\.\S+$/
export const MIN_PASSWORD_LENGTH = 6

// Целое или дробное число; дробь — через точку или запятую (на казахстанской и русской раскладке — запятая)
const NUMBER_PATTERN = /^-?\d+([.,]\d+)?$/

const isEmpty = (value) => (typeof value === 'boolean' ? value === false : String(value ?? '').trim() === '')

/**
 * Ошибка одного поля или '' если всё верно.
 * @param {import('../components/forms/FormProvider/formReducer.js').FormField} field
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
 * @param {import('../components/forms/FormProvider/formReducer.js').FormField[]} fields
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

/**
 * Проверки регистрации, которых нет в правилах отдельных полей: длина пароля и совпадение повтора.
 * Пустая строка — проверка пройдена.
 * @param {{ password?: string, confirm?: string }} values
 * @returns {{ password: string, confirm: string }}
 */
export function validatePasswords({ password = '', confirm = '' }) {
  return {
    password: password && password.length < MIN_PASSWORD_LENGTH ? `Пароль — минимум ${MIN_PASSWORD_LENGTH} символов` : '',
    confirm: confirm && confirm !== password ? 'Пароли не совпадают' : '',
  }
}
