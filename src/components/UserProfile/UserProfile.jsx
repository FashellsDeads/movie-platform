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
 */

/**
 * Мини-профиль зрителя в шапке сайта.
 * @param {UserProfileProps} props
 */
function UserProfile({ user }) {
  const { name, avatarUrl, role, email } = user

  return (
    <div className="user-profile" title={email}>
      <img className="user-profile__avatar" src={avatarUrl} alt={`Аватар: ${name}`} width={40} height={40} />
      <div className="user-profile__info">
        <span className="user-profile__name">{name}</span>
        <span className="user-profile__role">{role}</span>
        <span className="user-profile__email">{email}</span>
      </div>
    </div>
  )
}

export default UserProfile
