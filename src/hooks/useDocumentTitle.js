import { useEffect } from 'react'
import { SITE_NAME } from '../data/site.js'

/**
 * Заголовок вкладки браузера для текущей страницы (ДЗ №4 · #4, с ДЗ №6 — у каждой страницы свой).
 * @param {string | null} title — название страницы; null — только имя сайта
 */
export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — онлайн-кинотеатр`
  }, [title])
}
