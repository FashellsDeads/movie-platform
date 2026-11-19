import { useCallback, useMemo, useReducer, useRef, useState } from 'react'
import { validateFields } from '../../utils/formValidation.js'
import { FormContext } from './FormContext.js'
import { FORM_ACTIONS, createFormState, createHistory, formReducer, withHistory } from './formReducer.js'

/**
 * @typedef {(state: import('./formReducer.js').FormState, action: Object,
 *   defaultReducer: typeof formReducer) => import('./formReducer.js').FormState} CustomReducer
 */

/**
 * @typedef {Object} FormProviderProps
 * @property {import('./formReducer.js').FormField[]} initialFields — стартовая структура формы
 * @property {Record<string, string | boolean>} [initialValues] — стартовые значения
 * @property {CustomReducer} [reducer] — внешний reducer: может переопределить любое действие,
 *   а для остальных вызвать стандартный (третий аргумент)
 * @property {import('react').ReactNode} children
 */

/**
 * ДЗ №13 — FormProvider: одно состояние формы на useReducer, доступное всем
 * компонентам внутри через Context. Все изменения идут только через dispatch().
 * @param {FormProviderProps} props
 */
function FormProvider({ initialFields, initialValues, reducer, children }) {
  // начальное состояние запоминается один раз — к нему возвращает «Сбросить»
  const [initialState] = useState(() => createFormState(initialFields, initialValues))

  // State Reducer Pattern: внешний reducer получает стандартный третьим аргументом.
  // React использует reducer из последнего рендера, поэтому смена prop сразу меняет поведение.
  const historyReducer = useMemo(
    () => withHistory(reducer ? (state, action) => reducer(state, action, formReducer) : formReducer),
    [reducer],
  )
  const [history, dispatch] = useReducer(historyReducer, initialState, createHistory)
  const { fields, values, errors } = history.present

  // счётчик для id новых полей: не участвует в рендере, поэтому ref, а не state
  const nextFieldIdRef = useRef(0)

  const updateValue = useCallback((name, value) => dispatch({ type: FORM_ACTIONS.UPDATE_VALUE, name, value }), [])

  const addField = useCallback((type = 'text') => {
    nextFieldIdRef.current += 1
    const id = `field-${nextFieldIdRef.current}`
    const field = { id, name: id, label: `Новое поле ${nextFieldIdRef.current}`, type, required: false }
    if (type === 'select' || type === 'radio') field.options = ['Вариант 1', 'Вариант 2']
    dispatch({ type: FORM_ACTIONS.ADD_FIELD, field })
  }, [])

  const removeField = useCallback((id) => dispatch({ type: FORM_ACTIONS.REMOVE_FIELD, id }), [])
  const updateField = useCallback((id, changes) => dispatch({ type: FORM_ACTIONS.UPDATE_FIELD, id, changes }), [])
  const resetForm = useCallback(() => dispatch({ type: FORM_ACTIONS.RESET_FORM, initialState }), [initialState])
  const setErrors = useCallback((nextErrors) => dispatch({ type: FORM_ACTIONS.SET_ERRORS, errors: nextErrors }), [])
  const undo = useCallback(() => dispatch({ type: FORM_ACTIONS.UNDO }), [])
  const redo = useCallback(() => dispatch({ type: FORM_ACTIONS.REDO }), [])

  // extraErrors — проверки, которых нет в правилах полей (например, «пароли не совпадают»)
  const validate = useCallback(
    (extraErrors = {}) => {
      // пустые строки в extraErrors означают «проверка пройдена» — как и в validateFields
      const filledExtra = Object.fromEntries(Object.entries(extraErrors).filter(([, message]) => message))
      const nextErrors = { ...validateFields(fields, values), ...filledExtra }
      dispatch({ type: FORM_ACTIONS.SET_ERRORS, errors: nextErrors })
      return Object.keys(nextErrors).length === 0
    },
    [fields, values],
  )

  const value = useMemo(
    () => ({
      fields,
      values,
      errors,
      updateValue,
      addField,
      removeField,
      updateField,
      resetForm,
      setErrors,
      validate,
      undo,
      redo,
      canUndo: history.past.length > 0,
      canRedo: history.future.length > 0,
    }),
    [fields, values, errors, updateValue, addField, removeField, updateField, resetForm, setErrors, validate, undo, redo, history],
  )

  return <FormContext value={value}>{children}</FormContext>
}

export default FormProvider
