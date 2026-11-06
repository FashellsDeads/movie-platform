import Button from '../Button/Button.jsx'

/**
 * @typedef {Object} ErrorStateProps
 * @property {string} [title='Не удалось загрузить данные'] — заголовок
 * @property {string} message — что случилось и что делать
 * @property {() => void} onRetry — повторить запрос
 * @property {string} [retryText='Повторить'] — надпись на кнопке
 */

/**
 * Экран ошибки загрузки с кнопкой «Повторить» — для каталога, страницы фильма и главной.
 * @param {ErrorStateProps} props
 */
function ErrorState({ title = 'Не удалось загрузить данные', message, onRetry, retryText = 'Повторить' }) {
  return (
    <div className="empty-state empty-state--error" role="alert">
      <p className="empty-state__title">{title}</p>
      <p className="empty-state__text">{message}</p>
      <Button text={retryText} variant="primary" onClick={onRetry} />
    </div>
  )
}

export default ErrorState
