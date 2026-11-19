import Button from '../Button/Button.jsx'

/**
 * @typedef {Object} ErrorMessageProps
 * @property {string} message — что случилось и что делать
 * @property {string} [title='Не удалось загрузить данные'] — заголовок
 * @property {() => void} [onRetry] — повторить запрос; без него кнопки нет
 * @property {string} [retryText='Повторить'] — надпись на кнопке
 * @property {import('react').ReactNode} [children] — дополнительные действия (например, ссылка в каталог)
 */

/**
 * Состояние «ошибка» для любой страницы с данными.
 * @param {ErrorMessageProps} props
 */
function ErrorMessage({ message, title = 'Не удалось загрузить данные', onRetry, retryText = 'Повторить', children }) {
  return (
    <div className="empty-state empty-state--error" role="alert">
      <p className="empty-state__title">{title}</p>
      <p className="empty-state__text">{message}</p>
      {onRetry && <Button onClick={onRetry}>{retryText}</Button>}
      {children}
    </div>
  )
}

export default ErrorMessage
