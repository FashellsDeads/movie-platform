import { useCallback, useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Button from '../components/Button/Button.jsx'
import Footer from '../components/Footer/Footer.jsx'
import Header from '../components/Header/Header.jsx'
import Modal from '../components/Modal/Modal.jsx'
import ScrollProgress from '../components/ScrollProgress/ScrollProgress.jsx'
import Toast from '../components/Toast/Toast.jsx'
import { useFavorites } from '../context/favorites/useFavorites.js'
import { useTheme } from '../context/theme/useTheme.js'
import { SITE_NAME, footerLinks, navItems, premiumBenefits, socialLinks } from '../data/site.js'

const copyrightText = `© ${new Date().getFullYear()} ${SITE_NAME}. Все права защищены.`

/**
 * @typedef {Object} LayoutContext
 * @property {(text: string) => void} showToast — показать уведомление внизу экрана
 * @property {() => void} openPremium — открыть окно подписки
 */

/**
 * ДЗ №6 · #7 — общий каркас всех страниц: шапка и подвал одни на весь сайт,
 * а между ними через <Outlet /> подставляется страница текущего маршрута.
 */
function MainLayout() {
  const { theme } = useTheme()
  const { favoriteIds } = useFavorites()
  const { pathname } = useLocation()

  const [isPremiumOpen, setIsPremiumOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const toastIdRef = useRef(0)

  // ДЗ №4 · #10 — при переходе на другую страницу начинаем её с самого верха
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  const openPremium = useCallback(() => setIsPremiumOpen(true), [])
  const closePremium = useCallback(() => setIsPremiumOpen(false), [])
  const hideToast = useCallback(() => setToast(null), [])

  const showToast = useCallback((text) => {
    toastIdRef.current += 1
    setToast({ id: toastIdRef.current, text })
  }, [])

  return (
    <div className={`app theme-${theme}`}>
      <ScrollProgress />
      <Header navItems={navItems} favoritesCount={favoriteIds.length} onPremiumClick={openPremium} />

      <main>
        {/* страницы получают общие действия каркаса через useOutletContext() */}
        <Outlet context={{ showToast, openPremium }} />
      </main>

      <Footer copyrightText={copyrightText} socialLinks={socialLinks} links={footerLinks} />

      <Modal isOpen={isPremiumOpen} title={`${SITE_NAME} Premium`} onClose={closePremium}>
        <div className="premium">
          <p className="premium__price">
            2 490 ₸ <span>/ месяц</span>
          </p>
          <ul className="premium__list">
            {premiumBenefits.map((benefit) => (
              <li key={benefit}>{benefit}</li>
            ))}
          </ul>
          <div className="premium__actions">
            <Button text="Оформить подписку" variant="primary" onClick={closePremium} />
            <Button text="Позже" variant="outline" onClick={closePremium} />
          </div>
        </div>
      </Modal>

      <Toast toast={toast} onClose={hideToast} />
    </div>
  )
}

export default MainLayout
