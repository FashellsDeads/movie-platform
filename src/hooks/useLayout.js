import { useOutletContext } from 'react-router-dom'

/**
 * Действия общего каркаса (MainLayout), доступные любой странице внутри него:
 * уведомления (showToast). Передаются через <Outlet context={…} />.
 * @returns {import('../components/layout/MainLayout/MainLayout.jsx').LayoutContext}
 */
export function useLayout() {
  return useOutletContext()
}
