// Правила проверки форм. Отдельно от компонентов: их легко прочитать списком
// и использовать и при отправке формы, и при исправлении одного поля.

export const EMAIL_PATTERN = /^\S+@\S+\.\S+$/
export const MIN_PASSWORD_LENGTH = 6
export const MIN_AGE = 18
export const MAX_AGE = 120

/**
 * @typedef {Object} RegisterValues
 * @property {string} name
 * @property {string} email
 * @property {string} password
 * @property {string} age — строка из поля ввода, '' пока поле пустое
 * @property {string} country
 * @property {string} gender
 * @property {string[]} genres
 * @property {string} about
 */

/** @type {Record<string, (value: any) => string>} — правило поля: '' значит «ошибки нет» */
const registerRules = {
  name: (value) => (value.trim() ? '' : 'Введите имя.'),
  email: (value) => {
    if (!value.trim()) return 'Введите email.'
    return EMAIL_PATTERN.test(value.trim()) ? '' : 'Проверьте email: в нём должны быть «@» и домен.'
  },
  password: (value) =>
    value.length >= MIN_PASSWORD_LENGTH ? '' : `Пароль должен быть не короче ${MIN_PASSWORD_LENGTH} символов.`,
  age: (value) => {
    if (value === '') return 'Укажите возраст.'
    const age = Number(value)
    if (!Number.isInteger(age) || age > MAX_AGE) return 'Возраст — целое число лет.'
    return age >= MIN_AGE ? '' : `Регистрация доступна с ${MIN_AGE} лет.`
  },
  country: (value) => (value ? '' : 'Выберите страну.'),
  gender: (value) => (value ? '' : 'Выберите пол.'),
  genres: (value) => (value.length > 0 ? '' : 'Отметьте хотя бы один жанр.'),
}

/**
 * Проверяет одно поле. Поля без правила (about — о себе) необязательные.
 * @param {keyof RegisterValues} field
 * @param {any} value
 * @returns {string} текст ошибки или '' если всё верно
 */
export function validateRegisterField(field, value) {
  const rule = registerRules[field]
  return rule ? rule(value) : ''
}

/**
 * Проверяет всю форму регистрации.
 * @param {RegisterValues} values
 * @returns {Record<string, string>} ошибки только по неверным полям; пустой объект — форма в порядке
 */
export function validateRegisterForm(values) {
  const errors = {}
  for (const field of Object.keys(registerRules)) {
    const message = validateRegisterField(field, values[field])
    if (message) errors[field] = message
  }
  return errors
}
