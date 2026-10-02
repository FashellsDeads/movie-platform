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
 */

/**
 * Главное меню сайта.
 * @param {NavigationProps} props
 */
function Navigation({ navItems }) {
  return (
    <nav className="navigation" aria-label="Основное меню">
      <ul className="navigation__list">
        {navItems.map((item) => (
          <li key={item.id}>
            <a className="navigation__link" href={item.link}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Navigation
