import { startTransition, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/auth/useAuth.js'

/**
 * Выход из аккаунта с переходом на главную.
 *
 * Роутер применяет навигацию как transition, а logout() — обычное (срочное) обновление.
 * Если вызвать их подряд, React сначала отрисует закрытую страницу кабинета уже без
 * пользователя — и ProtectedRoute успеет отправить на /login. Внутри одного
 * startTransition оба обновления применяются за один рендер.
 * replace: после выхода кнопка «Назад» не должна вести в кабинет.
 */
export function useLogout() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  return useCallback(() => {
    startTransition(() => {
      navigate('/', { replace: true })
      logout()
    })
  }, [logout, navigate])
}
