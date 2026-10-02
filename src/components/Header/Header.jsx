import { useEffect, useState } from 'react'
import Button from '../Button/Button.jsx'
import Container from '../Container/Container.jsx'
import Logo from '../Logo/Logo.jsx'
import Navigation from '../Navigation/Navigation.jsx'
import ThemeToggle from '../ThemeToggle/ThemeToggle.jsx'
import UserProfile from '../UserProfile/UserProfile.jsx'
import './Header.css'

const MOBILE_BREAKPOINT = 768

const isMobileWidth = () => window.innerWidth < MOBILE_BREAKPOINT

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
 * На узких экранах меню прячется под бургер.
 * @param {HeaderProps} props
 */
function Header({ navItems, user, logoSrc, isDarkMode, onToggleTheme, favoritesCount, onPremiumClick }) {
  const [isMobile, setIsMobile] = useState(isMobileWidth)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // ДЗ №4 · #7 — следим за шириной окна и переключаемся на бургер-меню
  useEffect(() => {
    const handleResize = () => {
      const mobile = isMobileWidth()
      setIsMobile(mobile)
      if (!mobile) setIsMenuOpen(false)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const closeMenu = () => setIsMenuOpen(false)

  const handlePremiumClick = () => {
    closeMenu()
    onPremiumClick()
  }

  return (
    <header className="header">
      <Container maxWidth={1320}>
        <div className="header__inner">
          <Logo
            src={logoSrc}
            altText="CineVibe"
            width={isMobile ? 120 : 150}
            height={isMobile ? 29 : 36}
          />

          {!isMobile && <Navigation navItems={navItems} />}

          <div className="header__actions">
            <span className="header__favorites" title="Фильмов в избранном">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path d="M12 20.5s-7.5-4.6-9.3-9.4C1.5 7.9 3.6 4.5 7 4.5c2 0 3.5 1.1 5 3 1.5-1.9 3-3 5-3 3.4 0 5.5 3.4 4.3 6.6-1.8 4.8-9.3 9.4-9.3 9.4z" />
              </svg>
              <span className="visually-hidden">В избранном:</span>
              {favoritesCount}
            </span>
            <ThemeToggle isDarkMode={isDarkMode} onToggle={onToggleTheme} />
            {!isMobile && <Button text="Premium" variant="secondary" onClick={onPremiumClick} />}
            <UserProfile user={user} onManageSubscription={onPremiumClick} />
            {isMobile && (
              <button
                type="button"
                className={`header__burger${isMenuOpen ? ' header__burger--open' : ''}`}
                aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
                aria-expanded={isMenuOpen}
                onClick={() => setIsMenuOpen((prev) => !prev)}
              >
                <span />
                <span />
                <span />
              </button>
            )}
          </div>
        </div>
      </Container>

      {isMobile && isMenuOpen && (
        <div className="header__mobile-menu">
          <Container>
            <Navigation navItems={navItems} onItemClick={closeMenu} />
            <Button text="Оформить Premium" variant="primary" onClick={handlePremiumClick} />
          </Container>
        </div>
      )}
    </header>
  )
}

export default Header
