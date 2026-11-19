import { Navigate, Outlet, useLocation, useOutletContext } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

/**
 * Защищённый маршрут. Гостя отправляет на /login и запоминает,
 * откуда он пришёл, чтобы после входа вернуть его обратно.
 * Используется как родительский маршрут: <Route element={<ProtectedRoute />}>…</Route>
 */
function ProtectedRoute() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  // Защищённый маршрут — промежуточный: передаём контекст каркаса (showToast) вложенным страницам
  const layout = useOutletContext()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet context={layout} />
}

export default ProtectedRoute
