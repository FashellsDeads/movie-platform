import { useCallback, useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import ErrorBoundary from '../../common/ErrorBoundary/ErrorBoundary.jsx'
import Toast from '../../common/Toast/Toast.jsx'
import { useFavorites } from '../../../context/FavoritesContext.jsx'
import { useTheme } from '../../../context/ThemeContext.jsx'
import { SITE_NAME, cinemaInfo, footerLinks, navItems, socialLinks } from '../../../data/site.js'
import Footer from '../Footer/Footer.jsx'
import Header from '../Header/Header.jsx'
import Layout from '../Layout/Layout.jsx'
import ScrollProgress from '../ScrollProgress/ScrollProgress.jsx'
import './MainLayout.css'

const copyrightText = `© ${new Date().getFullYear()} ${SITE_NAME}. Все права защищены.`

/**
 * @typedef {Object} LayoutContext
 * @property {(text: string) => void} showToast — показать уведомление внизу экрана
 */

/**
 * Общий каркас магазина на компоненте Layout: шапка и подвал одни на весь сайт,
 * а в основную область через <Outlet /> подставляется страница текущего маршрута.
 */
function MainLayout() {
  const { theme } = useTheme()
  const { favoriteIds } = useFavorites()
  const { pathname } = useLocation()

  const [toast, setToast] = useState(null)
  const toastIdRef = useRef(0)

  // При переходе на другую страницу начинаем её с самого верха
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  // onClose — зависимость таймера автоскрытия в Toast: новая функция на каждом рендере перезапускала бы таймер
  const hideToast = useCallback(() => setToast(null), [])

  // Стабильная функция: её берут страницы и memo-компоненты через useLayout()
  const showToast = useCallback((text) => {
    toastIdRef.current += 1
    setToast({ id: toastIdRef.current, text })
  }, [])

  return (
    <div className={`app theme-${theme}`}>
      <ScrollProgress />
      <Layout
        className="app-layout"
        header={<Header navItems={navItems} favoritesCount={favoriteIds.length} />}
        footer={<Footer copyrightText={copyrightText} socialLinks={socialLinks} links={footerLinks} contacts={cinemaInfo} />}
      >
        <main>
          {/* Страницы получают общие действия каркаса через useOutletContext() */}
          <ErrorBoundary resetKey={pathname}>
            <Outlet context={{ showToast }} />
          </ErrorBoundary>
        </main>
      </Layout>

      <Toast toast={toast} onClose={hideToast} />
    </div>
  )
}

export default MainLayout
