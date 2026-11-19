import { useEffect } from 'react'
import { SITE_NAME } from '../data/site.js'

/**
 * Заголовок вкладки браузера для текущей страницы (#4, с у каждой страницы свой).
 * @param {string | null} title — название страницы; null — только имя сайта
 */
export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — кинотеатр в Алматы`
  }, [title])
}
