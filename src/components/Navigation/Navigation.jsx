import { NavLink } from 'react-router-dom'
import './Navigation.css'

/**
 * @typedef {Object} NavItem
 * @property {string} id — уникальный ключ
 * @property {string} label — текст ссылки
 * @property {string} link — адрес маршрута
 */

/**
 * @typedef {Object} NavigationProps
 * @property {NavItem[]} navItems — пункты меню
 * @property {() => void} [onItemClick] — клик по пункту (например, чтобы закрыть мобильное меню)
 */

/**
 * Главное меню сайта. ДЗ №6 · #3 — NavLink подсвечивает пункт текущей страницы.
 * @param {NavigationProps} props
 */
function Navigation({ navItems, onItemClick }) {
  return (
    <nav className="navigation" aria-label="Основное меню">
      <ul className="navigation__list">
        {navItems.map((item) => (
          <li key={item.id}>
            <NavLink
              to={item.link}
              // end: «Главная» активна только на "/", а не на каждой странице
              end={item.link === '/'}
              className={({ isActive }) => (isActive ? 'navigation__link navigation__link--active' : 'navigation__link')}
              onClick={onItemClick}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Navigation
