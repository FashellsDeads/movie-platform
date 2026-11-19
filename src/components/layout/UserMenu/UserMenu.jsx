import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../common/Button/Button.jsx'
import './UserMenu.css'

/**
 * @typedef {Object} User
 * @property {string} name — имя пользователя
 * @property {string} avatarUrl — аватар
 * @property {string} role — подпись под именем (город зрителя)
 * @property {string} email — электронная почта
 */

/**
 * @typedef {Object} UserMenuProps
 * @property {User} user — текущий пользователь
 * @property {() => void} onLogout — выйти из аккаунта
 */

/**
 * Меню зрителя в шапке: имя, аватар и выпадающий список (кабинет, заказы, выход).
 * @param {UserMenuProps} props
 */
function UserMenu({ user, onLogout }) {
  const { name, avatarUrl, role, email } = user
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const profileRef = useRef(null)

  // Закрываем меню при клике в любом месте вне профиля
  useEffect(() => {
    if (!isMenuOpen) return

    const handleClickOutside = (event) => {
      if (!profileRef.current?.contains(event.target)) setIsMenuOpen(false)
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isMenuOpen])

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <div className="user-menu" ref={profileRef}>
      <button
        type="button"
        className="user-menu__trigger"
        aria-haspopup="true"
        aria-expanded={isMenuOpen}
        onClick={() => setIsMenuOpen((prev) => !prev)}
      >
        <img className="user-menu__avatar" src={avatarUrl} alt={`Аватар: ${name}`} width={40} height={40} />
        <span className="user-menu__info">
          <span className="user-menu__name">{name}</span>
          <span className="user-menu__role">{role}</span>
        </span>
        <span className="user-menu__chevron" aria-hidden="true">
          ▾
        </span>
      </button>

      {isMenuOpen && (
        <div className="user-menu__menu">
          <img className="user-menu__menu-avatar" src={avatarUrl} alt="" width={56} height={56} />
          <p className="user-menu__menu-name">{name}</p>
          <p className="user-menu__menu-email">{email}</p>
          <span className="user-menu__menu-role">{role}</span>
          <Link className="user-menu__menu-action" to="/profile" onClick={closeMenu}>
            Личный кабинет
          </Link>
          <Link className="user-menu__menu-action" to="/profile/orders" onClick={closeMenu}>
            Мои заказы
          </Link>
          <Button variant="danger" onClick={onLogout}>
            Выйти
          </Button>
        </div>
      )}
    </div>
  )
}

export default UserMenu
