import { useCallback, useEffect, useState } from 'react'
import { getJson } from '../services/api.js'

/**
 * GET-запрос к API: загрузка, ошибка и повтор живут здесь, а компонент только показывает результат.
 * Сам запрос и понятные тексты ошибок — в services/api.js (getJson).
 * @template T
 * @param {string} url — адрес запроса; при его смене запрос выполняется заново
 * @returns {{ data: T | null, loading: boolean, error: string | null, refetch: () => void }}
 */
export function useFetch(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // Номер попытки: refetch увеличивает его, и useEffect выполняет запрос заново
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      setData(null)
      setError(null)
      setLoading(true)

      try {
        setData(await getJson(url, controller.signal))
        setLoading(false)
      } catch (err) {
        // Запрос отменён: компонент закрыт или уже идёт новый запрос — показывать нечего
        if (err.name === 'AbortError') return
        setError(err.message)
        setLoading(false)
      }
    }

    load()
    return () => controller.abort()
  }, [url, attempt])

  // стабильная функция: её передают в кнопки «Повторить» и в зависимости эффектов
  const refetch = useCallback(() => setAttempt((prev) => prev + 1), [])

  return { data, loading, error, refetch }
}
