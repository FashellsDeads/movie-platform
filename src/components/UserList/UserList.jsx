import UserCard from '../UserCard/UserCard.jsx'
import './UserList.css'

/**
 * Список пользователей через map(). Если никто не подошёл под фильтры — пустое состояние.
 * @param {{ users: import('../UserCard/UserCard.jsx').User[] }} props
 */
function UserList({ users }) {
  if (users.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-state__title">Пользователи не найдены</p>
        <p className="empty-state__text">Попробуйте другое имя или компанию.</p>
      </div>
    )
  }

  return (
    <ul className="user-list">
      {users.map((user) => (
        <li key={user.id}>
          <UserCard user={user} />
        </li>
      ))}
    </ul>
  )
}

export default UserList
