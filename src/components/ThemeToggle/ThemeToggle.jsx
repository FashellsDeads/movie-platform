import './ThemeToggle.css'

/**
 * @typedef {Object} ThemeToggleProps
 * @property {boolean} isDarkMode — включена ли тёмная тема
 * @property {() => void} onToggle — переключить тему
 */

/**
 * Кнопка переключения тёмной и светлой темы.
 * @param {ThemeToggleProps} props
 */
function ThemeToggle({ isDarkMode, onToggle }) {
  const label = isDarkMode ? 'Включить светлую тему' : 'Включить тёмную тему'

  return (
    <button type="button" className="theme-toggle" aria-label={label} title={label} onClick={onToggle}>
      <span aria-hidden="true">{isDarkMode ? '☀' : '☾'}</span>
    </button>
  )
}

export default ThemeToggle
