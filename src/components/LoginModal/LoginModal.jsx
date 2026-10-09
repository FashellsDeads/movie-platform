import { useState } from 'react'
import { useAuth } from '../../context/auth/useAuth.js'
import { currentUser } from '../../data/site.js'
import { createAvatar, getInitials } from '../../utils/placeholders.js'
import Modal from '../Modal/Modal.jsx'
import './LoginModal.css'

const AVATAR_COLOR = '#e11d48'
const EMAIL_PATTERN = /^\S+@\S+\.\S+$/

/**
 * Форма входа. Живёт только пока окно открыто, поэтому ошибки сбрасываются при закрытии.
 * Поля заранее заполнены демо-данными, чтобы войти одним нажатием.
 */
function LoginForm() {
  const { login } = useAuth()
  const [name, setName] = useState(currentUser.name)
  const [email, setEmail] = useState(currentUser.email)
  const [error, setError] = useState('')

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
  }

  return (
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
  )
}

/**
 * Окно входа. Открывается из шапки, формы отзыва и корзины через AuthContext.
 */
function LoginModal() {
  const { isLoginOpen, closeLogin } = useAuth()

  return (
    <Modal isOpen={isLoginOpen} title="Вход в CineVibe" onClose={closeLogin}>
      <LoginForm />
    </Modal>
  )
}

export default LoginModal
