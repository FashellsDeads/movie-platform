import { useCallback, useMemo, useReducer, useState } from 'react'
import { validateFields } from '../../../utils/formValidation.js'
import { FormContext } from './FormContext.js'
import { FORM_ACTIONS, createFormState, formReducer } from './formReducer.js'

/**
 * @typedef {Object} FormProviderProps
 * @property {import('./formReducer.js').FormField[]} initialFields — стартовая структура формы
 * @property {Record<string, string | boolean>} [initialValues] — стартовые значения
 * @property {import('react').ReactNode} children
 */

/**
 * FormProvider: одно состояние формы на useReducer, доступное всем
 * компонентам внутри через Context. Все изменения идут только через dispatch().
 * @param {FormProviderProps} props
 */
function FormProvider({ initialFields, initialValues, children }) {
  // Начальное состояние запоминается один раз — к нему возвращает «Сбросить»
  const [initialState] = useState(() => createFormState(initialFields, initialValues))

  // Сложное состояние формы (поля, значения, ошибки) — на useReducer, изменения только через dispatch
  const [{ fields, values, errors }, dispatch] = useReducer(formReducer, initialState)

  // useCallback + useMemo(value): функции и значение контекста стабильны, пока не изменились данные,
  // иначе каждый рендер провайдера перерисовывал бы всех потребителей контекста
  const updateValue = useCallback((name, value) => dispatch({ type: FORM_ACTIONS.UPDATE_VALUE, name, value }), [])


  const resetForm = useCallback(() => dispatch({ type: FORM_ACTIONS.RESET_FORM, initialState }), [initialState])

  // extraErrors — проверки, которых нет в правилах полей (например, «пароли не совпадают»)
  const validate = useCallback(
    (extraErrors = {}) => {
      // Пустые строки в extraErrors означают «проверка пройдена» — как и в validateFields
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
      resetForm,
      validate,
    }),
    [fields, values, errors, updateValue, resetForm, validate],
  )

  return <FormContext value={value}>{children}</FormContext>
}

export default FormProvider
