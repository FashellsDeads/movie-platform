import Button from '../../components/Button/Button.jsx'
import ThemeToggle from '../../components/ThemeToggle/ThemeToggle.jsx'
import { useTheme } from '../../context/theme/useTheme.js'
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js'
import { useLogout } from '../../hooks/useLogout.js'

/**
 * «/profile/settings» — тема оформления и выход из аккаунта.
 */
function ProfileSettings() {
  useDocumentTitle('Настройки')
  const { isDarkMode, toggleTheme } = useTheme()
  const handleLogout = useLogout()

  return (
    <div className="settings">
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
          <p className="settings__text">Билеты в корзине и избранное останутся в этом браузере.</p>
        </div>
        <Button text="Выйти" variant="outline" onClick={handleLogout} />
      </div>
    </div>
  )
}

export default ProfileSettings
