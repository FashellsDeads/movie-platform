import { Link } from 'react-router-dom'
import Container from '../components/Container/Container.jsx'
import RegisterForm from '../components/RegisterForm/RegisterForm.jsx'
import { useAuth } from '../context/auth/useAuth.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { useLayout } from '../hooks/useLayout.js'
import { createAvatar, getInitials } from '../utils/placeholders.js'
import './RegisterPage.css'

const NEW_USER_ROLE = 'Новый зритель'
const AVATAR_COLOR = '#7c3aed'

/**
 * Страница «/register» (ДЗ №8). Сама форма и её состояние — в RegisterForm,
 * страница только решает, что делать с зарегистрированным пользователем: сразу входит в аккаунт.
 */
function RegisterPage() {
  useDocumentTitle('Регистрация')
  const { login } = useAuth()
  const { showToast } = useLayout()

  const handleRegister = (user) => {
    login({
      name: user.name,
      email: user.email,
      role: NEW_USER_ROLE,
      avatarUrl: createAvatar(getInitials(user.name), AVATAR_COLOR),
    })
    showToast(`Добро пожаловать в CineVibe, ${user.name}!`)
  }

  return (
    <section className="page">
      <Container maxWidth={760}>
        <div className="register-card">
          <h1 className="register-card__title">Регистрация в CineVibe</h1>
          <p className="register-card__subtitle">
            Создайте аккаунт, чтобы оформлять билеты в зал, оставлять отзывы и получать подборки по любимым жанрам.
          </p>

          <RegisterForm onRegister={handleRegister} />

          <p className="register-card__footer">
            Уже есть аккаунт?{' '}
            <Link className="text-link" to="/login">
              Войти
            </Link>
          </p>
        </div>
      </Container>
    </section>
  )
}

export default RegisterPage
