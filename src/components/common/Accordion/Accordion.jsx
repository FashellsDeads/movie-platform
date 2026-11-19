import { createContext, use, useCallback, useId, useMemo, useState } from 'react'
import './Accordion.css'

/**
 * @typedef {Object} AccordionContextValue
 * @property {string[]} openIds — id открытых элементов
 * @property {(id: string) => void} toggle — открыть или закрыть элемент
 */

/** @type {import('react').Context<AccordionContextValue | null>} */
const AccordionContext = createContext(null)

/** @type {import('react').Context<{ id: string } | null>} */
const AccordionItemContext = createContext(null)

function useAccordionContext(partName) {
  const accordion = use(AccordionContext)
  const item = use(AccordionItemContext)
  if (!accordion || !item) throw new Error(`${partName} используется вне <Accordion.Item>`)
  return { ...accordion, id: item.id, isOpen: accordion.openIds.includes(item.id) }
}

/**
 * Accordion (Compound Component + Context).
 * multiple=false: открыт только один элемент; multiple=true: сколько угодно.
 * @param {{ multiple?: boolean, children: import('react').ReactNode }} props
 */
function Accordion({ multiple = false, children }) {
  const [openIds, setOpenIds] = useState([])

  // toggle и value стабильны — части аккордеона не перерисовываются, пока не изменились открытые элементы
  const toggle = useCallback(
    (id) =>
      setOpenIds((prev) => {
        if (!multiple) return prev.at(-1) === id ? [] : [id]
        return prev.includes(id) ? prev.filter((openId) => openId !== id) : [...prev, id]
      }),
    [multiple],
  )

  // При переходе из multiple в обычный режим открытым остаётся последний открытый элемент
  const visibleOpenIds = useMemo(() => (multiple ? openIds : openIds.slice(-1)), [multiple, openIds])
  const value = useMemo(() => ({ openIds: visibleOpenIds, toggle }), [visibleOpenIds, toggle])

  return (
    <AccordionContext value={value}>
      <div className="accordion">{children}</div>
    </AccordionContext>
  )
}

/** Один элемент; даёт своим частям собственный id. */
function AccordionItem({ children }) {
  const id = useId()
  return (
    <AccordionItemContext value={{ id }}>
      <div className="accordion__item">{children}</div>
    </AccordionItemContext>
  )
}

/** Заголовок-кнопка элемента. */
function AccordionTitle({ children }) {
  const { id, isOpen, toggle } = useAccordionContext('Accordion.Title')

  return (
    <h3 className="accordion__heading">
      <button
        type="button"
        id={`${id}-title`}
        className="accordion__title"
        aria-expanded={isOpen}
        aria-controls={`${id}-content`}
        onClick={() => toggle(id)}
      >
        {children}
      </button>
    </h3>
  )
}

/** Содержимое элемента; закрытое не рендерится. */
function AccordionContent({ children }) {
  const { id, isOpen } = useAccordionContext('Accordion.Content')
  if (!isOpen) return null

  return (
    <div id={`${id}-content`} role="region" aria-labelledby={`${id}-title`} className="accordion__content">
      {children}
    </div>
  )
}

Accordion.Item = AccordionItem
Accordion.Title = AccordionTitle
Accordion.Content = AccordionContent

export default Accordion
