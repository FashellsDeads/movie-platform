import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext.jsx'
import { useCart } from '../../../context/CartContext.jsx'
import { useTheme } from '../../../context/ThemeContext.jsx'
import { useLogout } from '../../../hooks/useLogout.js'
import { formatPrice } from '../../../utils/helpers.js'
import Button from '../../common/Button/Button.jsx'
import Container from '../Container/Container.jsx'
import logoLight from '../../../assets/logo-light.svg'
import logoDark from '../../../assets/logo.svg'
import Logo from '../Logo/Logo.jsx'
import Navigation from '../Navigation/Navigation.jsx'
import ThemeToggle from '../../common/ThemeToggle/ThemeToggle.jsx'
import UserMenu from '../UserMenu/UserMenu.jsx'
import './Header.css'

const MOBILE_BREAKPOINT = 768

const isMobileWidth = () => window.innerWidth < MOBILE_BREAKPOINT

/**
 * @typedef {Object} HeaderProps
 * @property {import('../Navigation/Navigation.jsx').NavItem[]} navItems — пункты меню
 * @property {number} favoritesCount — сколько товаров в избранном
 */

/**
 * Шапка магазина: логотип, меню, избранное, корзина, тема и вход.
 * Тема, сессия и корзина берутся из контекстов, переходы — через React Router.
 * На узких экранах меню прячется под бургер.
 * @param {HeaderProps} props
 */
function Header({ navItems, favoritesCount }) {
  const { isDarkMode, toggleTheme } = useTheme()
  const { user, isAuthenticated } = useAuth()
  const { totalCount, totalPrice } = useCart()
  const navigate = useNavigate()
  const location = useLocation()

  const [isMobile, setIsMobile] = useState(isMobileWidth)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Следим за шириной окна и переключаемся на бургер-меню
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

  // Переходы из кода: на вход (с запоминанием текущей страницы) и на главную после выхода
  const goToLogin = () => navigate('/login', { state: { from: location } })

  const handleLogout = useLogout()

  const logoSrc = isDarkMode ? logoDark : logoLight

  const favorites = (
    <Link className="header__favorites" to="/favorites" title="Избранное" onClick={closeMenu}>
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path d="M12 20.5s-7.5-4.6-9.3-9.4C1.5 7.9 3.6 4.5 7 4.5c2 0 3.5 1.1 5 3 1.5-1.9 3-3 5-3 3.4 0 5.5 3.4 4.3 6.6-1.8 4.8-9.3 9.4-9.3 9.4z" />
      </svg>
      <span className="visually-hidden">В избранном:</span>
      {favoritesCount}
    </Link>
  )

  let account
  if (isAuthenticated) {
    account = <UserMenu user={user} onLogout={handleLogout} />
  } else {
    account = <Button variant="outline" onClick={goToLogin}>Войти</Button>
  }

  return (
    <div className="header">
      <Container maxWidth={1560}>
        <div className="header__inner">
          <Logo src={logoSrc} altText="CineVibe" width={isMobile ? 120 : 150} height={isMobile ? 29 : 36} />

          {!isMobile && <Navigation navItems={navItems} />}

          <div className="header__actions">
            {!isMobile && favorites}
            <Link
              className="header__tickets"
              to="/cart"
              aria-label={`Корзина: ${totalCount} шт. на ${formatPrice(totalPrice)}`}
              title="Корзина"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h9.2a1 1 0 0 0 1-.8L20 8H6.2M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm9 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
              </svg>
              <span>{totalCount}</span>
              {totalCount > 0 && <span className="header__tickets-sum">· {formatPrice(totalPrice)}</span>}
            </Link>
            {!isMobile && <ThemeToggle isDarkMode={isDarkMode} onToggle={toggleTheme} />}
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
          </Container>
        </div>
      )}
    </div>
  )
}

export default Header
