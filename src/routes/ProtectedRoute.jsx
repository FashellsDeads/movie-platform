import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/auth/useAuth.js'
import './ProtectedRoute.css'

/**
 * ДЗ №6 · #8 — защищённый маршрут. Гостя отправляет на /login и запоминает,
 * откуда он пришёл, чтобы после входа вернуть его обратно.
 * Используется как родительский маршрут: <Route element={<ProtectedRoute />}>…</Route>
 */
function ProtectedRoute() {
  const { isAuthenticated, isAuthChecking } = useAuth()
  const location = useLocation()

  // пока проверяется сохранённая сессия, ещё неизвестно, пускать ли пользователя
  if (isAuthChecking) {
    return (
      <div className="protected-route__checking" role="status">
        Проверяем вход…
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}

export default ProtectedRoute
