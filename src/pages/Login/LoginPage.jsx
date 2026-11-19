import { Link, Navigate, useLocation } from 'react-router-dom'
import AuthCard from '../../components/forms/AuthCard/AuthCard.jsx'
import LoginForm from '../../components/forms/LoginForm/LoginForm.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js'
import { DEMO_ACCOUNT } from '../../services/api.js'

const DEFAULT_REDIRECT = '/profile'

/**
 * Страница входа «/login». Куда вернуть после входа, приходит в location.state.from —
 * его кладут ProtectedRoute, корзина и форма отзыва.
 */
function LoginPage() {
  useDocumentTitle('Вход')
  const { login, isAuthenticated } = useAuth()
  const location = useLocation()

  const from = location.state?.from
  const redirectTo = from ? `${from.pathname}${from.search ?? ''}` : DEFAULT_REDIRECT

  // После входа (и для уже вошедшего) форма не нужна; replace — «Назад» не вернёт на вход
  if (isAuthenticated) return <Navigate to={redirectTo} replace />

  const handleLogin = ({ email, password, remember, city }) =>
    login({ email, password }, { remember: Boolean(remember), city: city || undefined })

  return (
    <AuthCard
      title="Вход в CineVibe"
      subtitle="Войдите, чтобы оформлять заказы и оставлять отзывы."
      footer={
        <>
          <p>
            Демо-аккаунт: <strong>{DEMO_ACCOUNT.email}</strong> / <strong>{DEMO_ACCOUNT.password}</strong>
          </p>
          <p>
            Нет аккаунта?{' '}
            <Link className="text-link" to="/register" state={location.state}>
              Зарегистрироваться
            </Link>
          </p>
        </>
      }
    >
      <LoginForm onSubmit={handleLogin} />
    </AuthCard>
  )
}

export default LoginPage
