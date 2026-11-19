import { useRef, useState } from 'react'
import Button from '../../components/common/Button/Button.jsx'
import Input from '../../components/common/Input/Input.jsx'
import ThemeToggle from '../../components/common/ThemeToggle/ThemeToggle.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useTheme } from '../../context/ThemeContext.jsx'
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js'
import { useLayout } from '../../hooks/useLayout.js'
import { useLogout } from '../../hooks/useLogout.js'

/**
 * «/profile/settings» — имя в профиле, тема оформления и выход.
 */
function ProfileSettings() {
  useDocumentTitle('Настройки')
  const { user, updateName } = useAuth()
  const { isDarkMode, toggleTheme } = useTheme()
  const { showToast } = useLayout()
  const handleLogout = useLogout()

  // Неуправляемое поле: пока пользователь печатает, значение живёт в DOM и не вызывает
  // перерисовок — оно нужно только в момент «Сохранить», поэтому читаем его через ref
  const nameRef = useRef(null)
  const [nameError, setNameError] = useState('')

  const saveName = (event) => {
    event.preventDefault()
    const name = nameRef.current.value.trim()
    if (!name) {
      setNameError('Введите имя')
      return
    }
    setNameError('')
    updateName(name)
    showToast('Имя сохранено')
  }

  return (
    <div className="settings">
      <form className="settings__row" onSubmit={saveName} noValidate>
        <Input
          ref={nameRef}
          label="Имя в профиле"
          defaultValue={user.name}
          autoComplete="name"
          error={nameError}
          className="settings__field"
        />
        <Button type="submit" variant="secondary">
          Сохранить
        </Button>
      </form>

      <div className="settings__row">
        <div>
          <p className="settings__title">Тема оформления</p>
          <p className="settings__text">Сейчас включена {isDarkMode ? 'тёмная' : 'светлая'} тема.</p>
        </div>
        <ThemeToggle isDarkMode={isDarkMode} onToggle={toggleTheme} />
      </div>

      <div className="settings__row">
        <div>
          <p className="settings__title">Выход из аккаунта</p>
          <p className="settings__text">Корзина и избранное останутся в этом браузере.</p>
        </div>
        <Button variant="danger" onClick={handleLogout}>
          Выйти
        </Button>
      </div>
    </div>
  )
}

export default ProfileSettings
