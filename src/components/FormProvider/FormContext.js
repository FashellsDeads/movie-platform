import { createContext } from 'react'

/**
 * @typedef {Object} FormContextValue
 * @property {import('./formReducer.js').FormField[]} fields — структура формы
 * @property {Record<string, string | boolean>} values — введённые значения
 * @property {Record<string, string>} errors — ошибки по имени поля
 * @property {(name: string, value: string | boolean) => void} updateValue — изменить значение поля
 * @property {(type?: import('./formReducer.js').FieldType) => void} addField — добавить новое поле
 * @property {(id: string) => void} removeField — удалить поле
 * @property {(id: string, changes: Partial<import('./formReducer.js').FormField>) => void} updateField — изменить описание поля
 * @property {() => void} resetForm — вернуть форму к начальному виду
 * @property {(errors: Record<string, string>) => void} setErrors — записать ошибки
 * @property {(extraErrors?: Record<string, string>) => boolean} validate — проверить все поля; true — ошибок нет
 * @property {() => void} undo — отменить изменение структуры
 * @property {() => void} redo — вернуть отменённое
 * @property {boolean} canUndo
 * @property {boolean} canRedo
 */

/** ДЗ №13 — Provider Pattern: общее состояние динамической формы. */
/** @type {import('react').Context<FormContextValue | null>} */
export const FormContext = createContext(null)
