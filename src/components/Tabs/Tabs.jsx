import { Children, cloneElement, createContext, isValidElement, use, useId, useRef, useState } from 'react'
import './Tabs.css'

/**
 * @typedef {Object} TabsContextValue
 * @property {number} activeIndex — номер открытой вкладки
 * @property {(index: number) => void} setActiveIndex — открыть вкладку
 * @property {string} baseId — основа для id, связывающих вкладку и её панель
 */

/** @type {import('react').Context<TabsContextValue | null>} */
const TabsContext = createContext(null)

function useTabsContext(partName) {
  const context = use(TabsContext)
  if (!context) throw new Error(`${partName} используется вне <Tabs>`)
  return context
}

/**
 * Раздаёт детям нужного типа скрытый prop index по порядку: n-я вкладка открывает n-ю панель,
 * поэтому при использовании не нужно вручную нумеровать части.
 */
function withIndexes(children, type) {
  let index = 0
  return Children.map(children, (child) => {
    if (!isValidElement(child) || child.type !== type) return child
    const indexed = cloneElement(child, { index })
    index += 1
    return indexed
  })
}

/**
 * ДЗ №12 — Compound Component. Tabs сам хранит открытую вкладку,
 * а части получают её через Context, без передачи props вручную.
 * @param {{ defaultIndex?: number, children: import('react').ReactNode }} props
 */
function Tabs({ defaultIndex = 0, children }) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex)
  const baseId = useId()

  return (
    <TabsContext value={{ activeIndex, setActiveIndex, baseId }}>
      <div className="tabs">{withIndexes(children, TabsPanel)}</div>
    </TabsContext>
  )
}

// Клавиши по образцу WAI-ARIA Tabs: стрелки по кругу, Home и End — к краям
const KEY_STEPS = {
  ArrowRight: (index, count) => (index + 1) % count,
  ArrowLeft: (index, count) => (index - 1 + count) % count,
  Home: () => 0,
  End: (index, count) => count - 1,
}

/** Строка с вкладками; переключается и мышью, и с клавиатуры. */
function TabsList({ children }) {
  const { activeIndex, setActiveIndex } = useTabsContext('Tabs.List')
  const listRef = useRef(null)

  const handleKeyDown = (event) => {
    const step = KEY_STEPS[event.key]
    if (!step) return
    const tabs = listRef.current.querySelectorAll('[role="tab"]')
    const nextIndex = step(activeIndex, tabs.length)
    event.preventDefault()
    setActiveIndex(nextIndex)
    tabs[nextIndex].focus()
  }

  return (
    <div className="tabs__list" role="tablist" ref={listRef} onKeyDown={handleKeyDown}>
      {withIndexes(children, TabsTab)}
    </div>
  )
}

/** Одна вкладка; index приходит от Tabs.List. */
function TabsTab({ children, index }) {
  const { activeIndex, setActiveIndex, baseId } = useTabsContext('Tabs.Tab')
  const isActive = index === activeIndex

  return (
    <button
      type="button"
      role="tab"
      id={`${baseId}-tab-${index}`}
      className={`tabs__tab${isActive ? ' tabs__tab--active' : ''}`}
      aria-selected={isActive}
      aria-controls={`${baseId}-panel-${index}`}
      tabIndex={isActive ? 0 : -1}
      onClick={() => setActiveIndex(index)}
    >
      {children}
    </button>
  )
}

/** Содержимое вкладки; рендерится, только пока вкладка открыта. */
function TabsPanel({ children, index }) {
  const { activeIndex, baseId } = useTabsContext('Tabs.Panel')
  if (index !== activeIndex) return null

  return (
    <div
      role="tabpanel"
      id={`${baseId}-panel-${index}`}
      className="tabs__panel"
      aria-labelledby={`${baseId}-tab-${index}`}
    >
      {children}
    </div>
  )
}

Tabs.List = TabsList
Tabs.Tab = TabsTab
Tabs.Panel = TabsPanel

export default Tabs
