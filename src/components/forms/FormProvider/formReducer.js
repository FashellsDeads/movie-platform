// State Reducer Pattern: всё состояние динамической формы меняется только через dispatch(action).
// Здесь чистые функции без React — их легко тестировать.

export const FORM_ACTIONS = {
  UPDATE_VALUE: 'UPDATE_VALUE',
  RESET_FORM: 'RESET_FORM',
  SET_ERRORS: 'SET_ERRORS',
}

/**
 * @typedef {'text' | 'email' | 'number' | 'select' | 'password' | 'checkbox' | 'radio'} FieldType
 */

/**
 * @typedef {Object} FieldOption
 * @property {string} value
 * @property {string} label
 */

/**
 * @typedef {Object} FormField
 * @property {string} id — постоянный id поля
 * @property {string} name — ключ значения в values
 * @property {string} label — подпись
 * @property {FieldType} type
 * @property {boolean} required — обязательное ли поле
 * @property {Array<string | FieldOption>} [options] — варианты для select и radio
 * @property {string} [placeholder]
 * @property {string} [autoComplete] — подсказка браузеру для автозаполнения (email, current-password…)
 */

/**
 * @typedef {Object} FormState
 * @property {FormField[]} fields — структура формы
 * @property {Record<string, string | boolean>} values — введённые значения по name
 * @property {Record<string, string>} errors — ошибки по name
 */

/** Пустое значение поля: у чекбокса — false, у остальных — пустая строка. */
export const emptyValue = (type) => (type === 'checkbox' ? false : '')

/**
 * Начальное состояние формы.
 * @param {FormField[]} fields
 * @param {Record<string, string | boolean>} [values]
 * @returns {FormState}
 */
export function createFormState(fields, values = {}) {
  const filledValues = Object.fromEntries(fields.map((field) => [field.name, values[field.name] ?? emptyValue(field.type)]))
  return { fields, values: filledValues, errors: {} }
}

const without = (object, key) => Object.fromEntries(Object.entries(object).filter(([name]) => name !== key))


/**
 * Стандартный reducer формы.
 * @param {FormState} state
 * @param {Object} action
 * @returns {FormState}
 */
export function formReducer(state, action) {
  switch (action.type) {
    case FORM_ACTIONS.UPDATE_VALUE:
      return {
        ...state,
        values: { ...state.values, [action.name]: action.value },
        // Пользователь исправляет поле — старая ошибка больше не актуальна
        errors: without(state.errors, action.name),
      }

    case FORM_ACTIONS.SET_ERRORS:
      return { ...state, errors: action.errors }

    case FORM_ACTIONS.RESET_FORM:
      return action.initialState

    default:
      return state
  }
}
