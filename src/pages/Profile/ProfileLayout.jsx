import { NavLink, Outlet } from 'react-router-dom'
import Container from '../../components/layout/Container/Container.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useLayout } from '../../hooks/useLayout.js'
import './Profile.css'

const tabs = [
  { to: '/profile', label: 'Обзор', end: true },
  { to: '/profile/orders', label: 'Мои заказы' },
  { to: '/profile/settings', label: 'Настройки' },
]

/**
 * Личный кабинет «/profile» — защищён ProtectedRoute.
 * Вложенные маршруты: вкладки /profile, /profile/orders, /profile/settings
 * подставляются в <Outlet /> под общей шапкой кабинета.
 */
function ProfileLayout() {
  const { user } = useAuth()
  const layout = useLayout()

  return (
    <section className="page">
      <Container maxWidth={960}>
        <header className="profile-header">
          <img className="profile-header__avatar" src={user.avatarUrl} alt="" width={72} height={72} />
          <div>
            <h1 className="profile-header__name">{user.name}</h1>
            <p className="profile-header__email">{user.email}</p>
            <span className="profile-header__role">{user.role}</span>
          </div>
        </header>

        <nav className="profile-tabs" aria-label="Разделы личного кабинета">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) => (isActive ? 'profile-tabs__link profile-tabs__link--active' : 'profile-tabs__link')}
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>

        {/* Контекст Outlet не наследуется вложенными маршрутами — передаём действия каркаса дальше */}
        <Outlet context={layout} />
      </Container>
    </section>
  )
}

export default ProfileLayout
