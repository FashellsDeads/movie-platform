import { createContext } from 'react'

/**
 * @typedef {Object} FormContextValue
 * @property {import('./formReducer.js').FormField[]} fields — структура формы
 * @property {Record<string, string | boolean>} values — введённые значения
 * @property {Record<string, string>} errors — ошибки по имени поля
 * @property {(name: string, value: string | boolean) => void} updateValue — изменить значение поля
 * @property {() => void} resetForm — вернуть форму к начальному виду
 * @property {(extraErrors?: Record<string, string>) => boolean} validate — проверить все поля; true — ошибок нет
 */

/** Provider Pattern: общее состояние динамической формы. */
/** @type {import('react').Context<FormContextValue | null>} */
export const FormContext = createContext(null)
