import Button from '../Button/Button.jsx'
import Container from '../Container/Container.jsx'
import Logo from '../Logo/Logo.jsx'
import Navigation from '../Navigation/Navigation.jsx'
import ThemeToggle from '../ThemeToggle/ThemeToggle.jsx'
import UserProfile from '../UserProfile/UserProfile.jsx'
import './Header.css'

/**
 * @typedef {Object} HeaderProps
 * @property {import('../Navigation/Navigation.jsx').NavItem[]} navItems — пункты меню
 * @property {import('../UserProfile/UserProfile.jsx').User} user — текущий пользователь
 * @property {string} logoSrc — логотип под текущую тему
 * @property {boolean} isDarkMode — включена ли тёмная тема
 * @property {() => void} onToggleTheme — переключить тему
 * @property {number} favoritesCount — сколько фильмов в избранном
 * @property {() => void} onPremiumClick — открыть окно подписки
 */

/**
 * Шапка сайта: логотип, меню, избранное, тема, подписка и профиль.
 * @param {HeaderProps} props
 */
function Header({ navItems, user, logoSrc, isDarkMode, onToggleTheme, favoritesCount, onPremiumClick }) {
  return (
    <header className="header">
      <Container maxWidth={1320}>
        <div className="header__inner">
          <Logo src={logoSrc} altText="CineVibe" width={150} height={36} />
          <Navigation navItems={navItems} />
          <div className="header__actions">
            <span className="header__favorites" title="Фильмов в избранном">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path d="M12 20.5s-7.5-4.6-9.3-9.4C1.5 7.9 3.6 4.5 7 4.5c2 0 3.5 1.1 5 3 1.5-1.9 3-3 5-3 3.4 0 5.5 3.4 4.3 6.6-1.8 4.8-9.3 9.4-9.3 9.4z" />
              </svg>
              <span className="visually-hidden">В избранном:</span>
              {favoritesCount}
            </span>
            <ThemeToggle isDarkMode={isDarkMode} onToggle={onToggleTheme} />
            <Button text="Premium" variant="secondary" onClick={onPremiumClick} />
            <UserProfile user={user} />
          </div>
        </div>
      </Container>
    </header>
  )
}

export default Header
