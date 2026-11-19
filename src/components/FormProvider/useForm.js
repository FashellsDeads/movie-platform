import { use } from 'react'
import { FormContext } from './FormContext.js'

/**
 * Доступ к состоянию формы из любого компонента внутри FormProvider — без prop drilling.
 * @returns {import('./FormContext.js').FormContextValue}
 */
export function useForm() {
  const context = use(FormContext)
  if (!context) throw new Error('useForm используется вне <FormProvider>')
  return context
}
