import './Button.css'

/**
 * @typedef {Object} ButtonProps
 * @property {string} text — надпись на кнопке
 * @property {'primary' | 'secondary' | 'outline'} [variant='primary'] — визуальный стиль
 * @property {boolean} [isDisabled=false] — заблокирована ли кнопка
 * @property {() => void} [onClick] — обработчик нажатия
 */

/**
 * Универсальная кнопка сайта.
 * @param {ButtonProps} props
 */
function Button({ text, variant = 'primary', isDisabled = false, onClick }) {
  return (
    <button
      type="button"
      className={`button button--${variant}`}
      disabled={isDisabled}
      onClick={onClick}
    >
      {text}
    </button>
  )
}

export default Button
