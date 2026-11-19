/**
 * @typedef {Object} EmptyStateProps
 * @property {string} message — что пусто
 * @property {string} [hint] — подсказка, что делать дальше
 * @property {import('react').ReactNode} [children] — действия: кнопка или ссылка
 */

/**
 * Состояние «пусто»: ничего не найдено, корзина пуста, избранного нет.
 * @param {EmptyStateProps} props
 */
function EmptyState({ message, hint, children }) {
  return (
    <div className="empty-state">
      <p className="empty-state__title">{message}</p>
      {hint && <p className="empty-state__text">{hint}</p>}
      {children}
    </div>
  )
}

export default EmptyState
