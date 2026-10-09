import { useEffect, useState } from 'react'
import { useAuth } from '../../context/auth/useAuth.js'
import { useCart } from '../../context/cart/useCart.js'
import { useTheme } from '../../context/theme/useTheme.js'
import { formatNumber } from '../../utils/format.js'
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
 * @property {number} favoritesCount — сколько фильмов в избранном
 * @property {() => void} onPremiumClick — открыть окно подписки
 * @property {() => void} onCartClick — открыть корзину билетов
 */

/**
 * Шапка сайта: логотип, меню, избранное, билеты, тема, подписка и вход.
 * Тема, сессия и корзина берутся из контекстов (ДЗ №5), а не из props.
 * На узких экранах меню прячется под бургер.
 * @param {HeaderProps} props
 */
function Header({ navItems, favoritesCount, onPremiumClick, onCartClick }) {
  const { isDarkMode, toggleTheme } = useTheme()
  const { user, isAuthenticated, isAuthChecking, openLogin, logout } = useAuth()
  const { totalCount, totalPrice } = useCart()

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

  const logoSrc = isDarkMode ? '/logo.svg' : '/logo-light.svg'

  const favorites = (
    <span className="header__favorites" title="Фильмов в избранном">
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path d="M12 20.5s-7.5-4.6-9.3-9.4C1.5 7.9 3.6 4.5 7 4.5c2 0 3.5 1.1 5 3 1.5-1.9 3-3 5-3 3.4 0 5.5 3.4 4.3 6.6-1.8 4.8-9.3 9.4-9.3 9.4z" />
      </svg>
      <span className="visually-hidden">В избранном:</span>
      {favoritesCount}
    </span>
  )

  let account
  if (isAuthChecking) {
    account = <span className="header__account-placeholder" role="status" aria-label="Проверяем вход" />
  } else if (isAuthenticated) {
    account = <UserProfile user={user} onManageSubscription={onPremiumClick} onLogout={logout} />
  } else {
    account = <Button text="Войти" variant="outline" onClick={openLogin} />
  }

  return (
    <header className="header">
      <Container maxWidth={1320}>
        <div className="header__inner">
          <Logo src={logoSrc} altText="CineVibe" width={isMobile ? 120 : 150} height={isMobile ? 29 : 36} />

          {!isMobile && <Navigation navItems={navItems} />}

          <div className="header__actions">
            {!isMobile && favorites}
            <button
              type="button"
              className="header__tickets"
              aria-label={`Мои билеты: ${totalCount}`}
              title="Мои билеты"
              onClick={onCartClick}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4zM14 5v14" />
              </svg>
              <span>{totalCount}</span>
              {totalCount > 0 && <span className="header__tickets-sum">· {formatNumber(totalPrice)} ₸</span>}
            </button>
            {!isMobile && <ThemeToggle isDarkMode={isDarkMode} onToggle={toggleTheme} />}
            {!isMobile && <Button text="Premium" variant="secondary" onClick={onPremiumClick} />}
            {account}
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
            <div className="header__mobile-row">
              {favorites}
              <ThemeToggle isDarkMode={isDarkMode} onToggle={toggleTheme} />
            </div>
            <Button text="Оформить Premium" variant="primary" onClick={handlePremiumClick} />
          </Container>
        </div>
      )}
    </header>
  )
}

export default Header
