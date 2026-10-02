import Button from '../Button/Button.jsx'
import Container from '../Container/Container.jsx'
import Logo from '../Logo/Logo.jsx'
import Navigation from '../Navigation/Navigation.jsx'
import UserProfile from '../UserProfile/UserProfile.jsx'
import './Header.css'

/**
 * @typedef {Object} HeaderProps
 * @property {import('../Navigation/Navigation.jsx').NavItem[]} navItems — пункты меню
 * @property {import('../UserProfile/UserProfile.jsx').User} user — текущий пользователь
 * @property {() => void} onPremiumClick — открыть окно подписки
 */

/**
 * Шапка сайта: логотип, меню, кнопка подписки и профиль.
 * @param {HeaderProps} props
 */
function Header({ navItems, user, onPremiumClick }) {
  return (
    <header className="header">
      <Container maxWidth={1320}>
        <div className="header__inner">
          <Logo src="/logo.svg" altText="CineVibe" width={150} height={36} />
          <Navigation navItems={navItems} />
          <div className="header__actions">
            <Button text="Premium" variant="secondary" onClick={onPremiumClick} />
            <UserProfile user={user} />
          </div>
        </div>
      </Container>
    </header>
  )
}

export default Header
