import { Link } from 'react-router-dom'
import './UserCard.css'

/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} name — имя
 * @property {string} username — логин
 * @property {string} email
 * @property {string} phone
 * @property {{ name: string }} company — компания
 */

/**
 * Карточка пользователя. Данные получает только через props и сама ничего не загружает.
 * @param {{ user: User }} props
 */
function UserCard({ user }) {
  return (
    <article className="user-card">
      <h3 className="user-card__name">{user.name}</h3>
      <p className="user-card__username">@{user.username}</p>

      <dl className="user-card__info">
        <div>
          <dt>Email</dt>
          <dd>
            <a href={`mailto:${user.email}`}>{user.email}</a>
          </dd>
        </div>
        <div>
          <dt>Телефон</dt>
          <dd>{user.phone}</dd>
        </div>
        <div>
          <dt>Компания</dt>
          <dd>{user.company.name}</dd>
        </div>
      </dl>

      <Link className="user-card__link link-button link-button--outline" to={`/users/${user.id}`}>
        Подробнее
      </Link>
    </article>
  )
}

export default UserCard
