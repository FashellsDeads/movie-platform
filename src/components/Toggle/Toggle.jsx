import { createContext, use, useId, useState } from 'react'
import './Toggle.css'

/**
 * @typedef {Object} ToggleContextValue
 * @property {boolean} isOpen — показано ли содержимое
 * @property {() => void} toggle — показать или спрятать
 * @property {string} contentId — id содержимого для aria-controls
 */

/** @type {import('react').Context<ToggleContextValue | null>} */
const ToggleContext = createContext(null)

function useToggleContext(partName) {
  const context = use(ToggleContext)
  if (!context) throw new Error(`${partName} используется вне <Toggle>`)
  return context
}

/**
 * ДЗ №12 — Compound Component: Toggle хранит «открыто/закрыто»,
 * а кнопка и содержимое получают это через Context.
 * @param {{ defaultOpen?: boolean, children: import('react').ReactNode }} props
 */
function Toggle({ defaultOpen = false, children }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const contentId = useId()
  const toggle = () => setIsOpen((prev) => !prev)

  return (
    <ToggleContext value={{ isOpen, toggle, contentId }}>
      <div className="toggle">{children}</div>
    </ToggleContext>
  )
}

/** Кнопка; без children пишет «Показать» / «Скрыть». */
function ToggleButton({ children }) {
  const { isOpen, toggle, contentId } = useToggleContext('Toggle.Button')

  return (
    <button
      type="button"
      className="toggle__button"
      aria-expanded={isOpen}
      aria-controls={contentId}
      onClick={toggle}
    >
      {children ?? (isOpen ? 'Скрыть' : 'Показать')}
    </button>
  )
}

/** Содержимое; пока Toggle закрыт, не рендерится. */
function ToggleContent({ children }) {
  const { isOpen, contentId } = useToggleContext('Toggle.Content')
  if (!isOpen) return null

  return (
    <div id={contentId} className="toggle__content">
      {children}
    </div>
  )
}

Toggle.Button = ToggleButton
Toggle.Content = ToggleContent

export default Toggle
