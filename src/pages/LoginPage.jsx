import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import Container from '../components/Container/Container.jsx'
import { useAuth } from '../context/auth/useAuth.js'
import { currentUser } from '../data/site.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { createAvatar, getInitials } from '../utils/placeholders.js'
import './LoginPage.css'

const AVATAR_COLOR = '#e11d48'
const EMAIL_PATTERN = /^\S+@\S+\.\S+$/
const DEFAULT_REDIRECT = '/profile'

/**
 * Страница входа «/login».
 * Куда вернуть после входа, приходит в location.state.from — его кладут ProtectedRoute,
 * шапка, форма отзыва и корзина. ДЗ №6 · #6 — переход выполняет useNavigate.
 */
function LoginPage() {
  useDocumentTitle('Вход')
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from
  const redirectTo = from ? `${from.pathname}${from.search ?? ''}` : DEFAULT_REDIRECT

  // поля заранее заполнены демо-данными, чтобы войти одним нажатием
  const [name, setName] = useState(currentUser.name)
  const [email, setEmail] = useState(currentUser.email)
  const [error, setError] = useState('')

  // уже вошедшему пользователю форма не нужна
  if (isAuthenticated) return <Navigate to={redirectTo} replace />

  const handleSubmit = (event) => {
    event.preventDefault()
    const trimmedName = name.trim()
    const trimmedEmail = email.trim()

    if (trimmedName.length < 2) {
      setError('Введите имя — хотя бы две буквы.')
      return
    }
    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setError('Проверьте email: в нём должны быть «@» и домен.')
      return
    }

    login({
      name: trimmedName,
      email: trimmedEmail,
      role: currentUser.role,
      avatarUrl: createAvatar(getInitials(trimmedName), AVATAR_COLOR),
    })
    // replace: кнопка «Назад» после входа не должна возвращать на форму входа
    navigate(redirectTo, { replace: true })
  }

  return (
    <section className="page">
      <Container maxWidth={520}>
        <div className="login-card">
          <h1 className="login-card__title">Вход в CineVibe</h1>
          <p className="login-card__subtitle">
            {from ? 'Войдите, чтобы продолжить — потом вернём вас обратно.' : 'Войдите, чтобы оформлять билеты и оставлять отзывы.'}
          </p>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <label className="login-form__field">
              <span className="login-form__label">Имя</span>
              <input
                className="login-form__input"
                type="text"
                value={name}
                autoComplete="name"
                onChange={(event) => setName(event.target.value)}
              />
            </label>
            <label className="login-form__field">
              <span className="login-form__label">Email</span>
              <input
                className="login-form__input"
                type="email"
                value={email}
                autoComplete="email"
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>

            {error && (
              <p className="login-form__error" role="alert">
                {error}
              </p>
            )}

            <button type="submit" className="button button--primary login-form__submit">
              Войти
            </button>
            <p className="login-form__note">Демо-вход: пароль не нужен, сессия хранится только в этом браузере.</p>
          </form>
        </div>
      </Container>
    </section>
  )
}

export default LoginPage
