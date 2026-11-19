// ДЗ №13 — State Reducer Pattern: всё состояние динамической формы меняется
// только через dispatch(action). Здесь чистые функции без React — их легко тестировать.

export const FORM_ACTIONS = {
  ADD_FIELD: 'ADD_FIELD',
  REMOVE_FIELD: 'REMOVE_FIELD',
  UPDATE_FIELD: 'UPDATE_FIELD',
  UPDATE_VALUE: 'UPDATE_VALUE',
  RESET_FORM: 'RESET_FORM',
  SET_ERRORS: 'SET_ERRORS',
  UNDO: 'UNDO',
  REDO: 'REDO',
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

/** Значения вариантов select и radio (строки из конструктора — без пробелов по краям). */
const optionValues = (field) =>
  (field.options ?? []).map((option) => (typeof option === 'string' ? option.trim() : option.value))

/** Подходит ли значение полю: выбранный вариант списка должен существовать. */
function keepsValue(field, value) {
  if (field.type !== 'select' && field.type !== 'radio') return true
  return value === '' || optionValues(field).includes(value)
}

/**
 * Стандартный reducer формы.
 * @param {FormState} state
 * @param {Object} action
 * @returns {FormState}
 */
export function formReducer(state, action) {
  switch (action.type) {
    case FORM_ACTIONS.ADD_FIELD: {
      const { field } = action
      return {
        ...state,
        fields: [...state.fields, field],
        values: { ...state.values, [field.name]: emptyValue(field.type) },
      }
    }

    case FORM_ACTIONS.REMOVE_FIELD: {
      const field = state.fields.find((item) => item.id === action.id)
      if (!field) return state
      return {
        fields: state.fields.filter((item) => item.id !== action.id),
        values: without(state.values, field.name),
        errors: without(state.errors, field.name),
      }
    }

    case FORM_ACTIONS.UPDATE_FIELD: {
      const field = state.fields.find((item) => item.id === action.id)
      if (!field) return state
      const updated = { ...field, ...action.changes }
      const currentValue = state.values[field.name]
      // при смене типа старое значение теряет смысл (текст в чекбоксе), а у списка
      // не может быть выбран вариант, которого больше нет, — такие значения сбрасываем
      const isValueStale = updated.type !== field.type || !keepsValue(updated, currentValue)
      return {
        fields: state.fields.map((item) => (item.id === action.id ? updated : item)),
        values: isValueStale ? { ...state.values, [field.name]: emptyValue(updated.type) } : state.values,
        // правила поля изменились — старая ошибка могла стать неверной
        errors: without(state.errors, field.name),
      }
    }

    case FORM_ACTIONS.UPDATE_VALUE:
      return {
        ...state,
        values: { ...state.values, [action.name]: action.value },
        // пользователь исправляет поле — старая ошибка больше не актуальна
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

/**
 * @typedef {Object} FormHistory
 * @property {FormState[]} past — состояния до текущего (для Undo)
 * @property {FormState} present — текущее состояние
 * @property {FormState[]} future — отменённые состояния (для Redo)
 * @property {string} [typingKey] — какое свойство какого поля сейчас печатается (склейка шагов)
 */

/** @param {FormState} state @returns {FormHistory} */
export const createHistory = (state) => ({ past: [], present: state, future: [] })

// В историю попадают только изменения структуры формы: ввод значений
// в историю не пишется, иначе Undo откатывал бы по одной букве.
const STRUCTURE_ACTIONS = new Set([FORM_ACTIONS.ADD_FIELD, FORM_ACTIONS.REMOVE_FIELD, FORM_ACTIONS.UPDATE_FIELD])

// Свойства поля, которые пользователь печатает с клавиатуры
const TYPED_PROPS = new Set(['label', 'options'])

/** Ключ «печатаю в это свойство этого поля» или undefined, если правка не текстовая. */
function getTypingKey(action) {
  if (action.type !== FORM_ACTIONS.UPDATE_FIELD) return undefined
  const keys = Object.keys(action.changes)
  if (keys.length !== 1 || !TYPED_PROPS.has(keys[0])) return undefined
  return `${action.id}:${keys[0]}`
}

/**
 * ДЗ №13 · дополнительное задание — Undo / Redo. Оборачивает любой reducer формы
 * и хранит историю состояний past / present / future.
 * @param {(state: FormState, action: Object) => FormState} reducer
 * @returns {(history: FormHistory, action: Object) => FormHistory}
 */
/**
 * В истории хранятся снимки целиком, но Undo/Redo откатывают только структуру:
 * значения, введённые в поля, которые остались того же типа, не теряются.
 * @param {FormState} snapshot — состояние из past или future
 * @param {FormState} present — текущее состояние
 * @returns {FormState}
 */
function restoreStructure(snapshot, present) {
  const values = {}
  const errors = {}
  for (const field of snapshot.fields) {
    const current = present.fields.find((item) => item.name === field.name)
    const isSameField = current?.type === field.type && keepsValue(field, present.values[field.name])
    values[field.name] = isSameField ? present.values[field.name] : (snapshot.values[field.name] ?? emptyValue(field.type))
    if (isSameField && present.errors[field.name]) errors[field.name] = present.errors[field.name]
  }
  return { fields: snapshot.fields, values, errors }
}

export function withHistory(reducer) {
  return function historyReducer(history, action) {
    const { past, present, future } = history

    switch (action.type) {
      case FORM_ACTIONS.UNDO:
        if (past.length === 0) return history
        return { past: past.slice(0, -1), present: restoreStructure(past.at(-1), present), future: [present, ...future] }

      case FORM_ACTIONS.REDO:
        if (future.length === 0) return history
        return { past: [...past, present], present: restoreStructure(future[0], present), future: future.slice(1) }

      case FORM_ACTIONS.RESET_FORM:
        return createHistory(reducer(present, action))

      default: {
        const next = reducer(present, action)
        if (next === present) return history
        if (!STRUCTURE_ACTIONS.has(action.type)) return { ...history, present: next, typingKey: undefined }

        // Название и варианты вводятся по буквам: подряд идущие правки одного свойства
        // одного поля склеиваются в один шаг, чтобы Undo отменял переименование целиком
        const typingKey = getTypingKey(action)
        if (typingKey && typingKey === history.typingKey) {
          return { past, present: next, future: [], typingKey }
        }
        // новое изменение структуры: старое будущее больше недостижимо
        return { past: [...past, present], present: next, future: [], typingKey }
      }
    }
  }
}
