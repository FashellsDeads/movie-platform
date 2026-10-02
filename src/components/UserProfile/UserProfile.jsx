import { useEffect, useRef, useState } from 'react'
import './UserProfile.css'

/**
 * @typedef {Object} User
 * @property {string} name — имя пользователя
 * @property {string} avatarUrl — аватар
 * @property {string} role — тип подписки / роль
 * @property {string} email — электронная почта
 */

/**
 * @typedef {Object} UserProfileProps
 * @property {User} user — текущий пользователь
 * @property {() => void} onManageSubscription — открыть управление подпиской
 */

/**
 * Профиль зрителя в шапке сайта с выпадающим меню.
 * @param {UserProfileProps} props
 */
function UserProfile({ user, onManageSubscription }) {
  const { name, avatarUrl, role, email } = user
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const profileRef = useRef(null)

  // ДЗ №4 · #8 — закрываем меню при клике в любом месте вне профиля
  useEffect(() => {
    if (!isMenuOpen) return

    const handleClickOutside = (event) => {
      if (!profileRef.current?.contains(event.target)) setIsMenuOpen(false)
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isMenuOpen])

  const handleManageSubscription = () => {
    setIsMenuOpen(false)
    onManageSubscription()
  }

  return (
    <div className="user-profile" ref={profileRef}>
      <button
        type="button"
        className="user-profile__trigger"
        aria-haspopup="true"
        aria-expanded={isMenuOpen}
        onClick={() => setIsMenuOpen((prev) => !prev)}
      >
        <img className="user-profile__avatar" src={avatarUrl} alt={`Аватар: ${name}`} width={40} height={40} />
        <span className="user-profile__info">
          <span className="user-profile__name">{name}</span>
          <span className="user-profile__role">{role}</span>
        </span>
        <span className="user-profile__chevron" aria-hidden="true">
          ▾
        </span>
      </button>

      {isMenuOpen && (
        <div className="user-profile__menu">
          <img className="user-profile__menu-avatar" src={avatarUrl} alt="" width={56} height={56} />
          <p className="user-profile__menu-name">{name}</p>
          <p className="user-profile__menu-email">{email}</p>
          <span className="user-profile__menu-role">{role}</span>
          <button type="button" className="user-profile__menu-action" onClick={handleManageSubscription}>
            Управление подпиской
          </button>
        </div>
      )}
    </div>
  )
}

export default UserProfile
