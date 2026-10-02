import './Navigation.css'

/**
 * @typedef {Object} NavItem
 * @property {string} id — уникальный ключ
 * @property {string} label — текст ссылки
 * @property {string} link — адрес (якорь секции)
 */

/**
 * @typedef {Object} NavigationProps
 * @property {NavItem[]} navItems — пункты меню
 * @property {() => void} [onItemClick] — клик по пункту (например, чтобы закрыть мобильное меню)
 */

/**
 * Главное меню сайта.
 * @param {NavigationProps} props
 */
function Navigation({ navItems, onItemClick }) {
  return (
    <nav className="navigation" aria-label="Основное меню">
      <ul className="navigation__list">
        {navItems.map((item) => (
          <li key={item.id}>
            <a className="navigation__link" href={item.link} onClick={onItemClick}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Navigation
