import './Badge.css'

/**
 * @typedef {Object} BadgeProps
 * @property {string} label — текст бейджа
 * @property {'green' | 'red' | 'yellow'} [colorScheme='green'] — цветовая схема
 */

/**
 * Бейдж статуса фильма: новинка, хит, возрастное ограничение.
 * @param {BadgeProps} props
 */
function Badge({ label, colorScheme = 'green' }) {
  return <span className={`badge badge--${colorScheme}`}>{label}</span>
}

export default Badge
