import './Button.css'

/**
 * @typedef {Object} ButtonProps
 * @property {import('react').ReactNode} children — содержимое кнопки (текст, иконка)
 * @property {'primary' | 'secondary' | 'danger' | 'outline'} [variant='primary'] — визуальный стиль
 * @property {boolean} [disabled=false] — заблокирована ли кнопка
 * @property {'button' | 'submit' | 'reset'} [type='button'] — submit отправляет форму, внутри которой стоит кнопка
 * @property {(event: import('react').MouseEvent<HTMLButtonElement>) => void} [onClick] — обработчик нажатия
 * @property {string} [className] — дополнительный класс снаружи
 */

/**
 * ДЗ №12 — универсальная кнопка: содержимое приходит через children,
 * остальные атрибуты (aria-*, title…) уходят прямо в <button>.
 * @param {ButtonProps & import('react').ButtonHTMLAttributes<HTMLButtonElement>} props
 */
function Button({ children, variant = 'primary', disabled = false, type = 'button', onClick, className, ...rest }) {
  const classes = ['button', `button--${variant}`, className].filter(Boolean).join(' ')

  return (
    <button {...rest} type={type} className={classes} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  )
}

export default Button
