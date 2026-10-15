import { useOutletContext } from 'react-router-dom'

/**
 * Действия общего каркаса (MainLayout), доступные любой странице внутри него:
 * уведомления и окно подписки. Передаются через <Outlet context={…} />.
 * @returns {import('../layouts/MainLayout.jsx').LayoutContext}
 */
export function useLayout() {
  return useOutletContext()
}
