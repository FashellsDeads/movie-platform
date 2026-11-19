import { Link, Navigate, useLocation } from 'react-router-dom'
import AuthCard from '../../components/forms/AuthCard/AuthCard.jsx'
import RegisterForm from '../../components/forms/RegisterForm/RegisterForm.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js'
import { useLayout } from '../../hooks/useLayout.js'

/**
 * Страница «/register». После регистрации зритель сразу входит в аккаунт.
 */
function RegisterPage() {
  useDocumentTitle('Регистрация')
  const { register, isAuthenticated } = useAuth()
  const { showToast } = useLayout()
  const location = useLocation()

  const from = location.state?.from
  if (isAuthenticated) return <Navigate to={from ? `${from.pathname}${from.search ?? ''}` : '/profile'} replace />

  const handleRegister = async (values) => {
    await register(values)
    showToast(`Добро пожаловать в CineVibe, ${values.name.trim()}!`)
  }

  return (
    <AuthCard
      title="Регистрация в CineVibe"
      subtitle="Создайте аккаунт, чтобы оформлять билеты и заказы из кинобара."
      footer={
        <p>
          Уже есть аккаунт?{' '}
          <Link className="text-link" to="/login" state={location.state}>
            Войти
          </Link>
        </p>
      }
    >
      <RegisterForm onSubmit={handleRegister} />
    </AuthCard>
  )
}

export default RegisterPage
