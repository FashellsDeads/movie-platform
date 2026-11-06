import { useCallback, useEffect, useState } from 'react'

/**
 * Понятное пользователю сообщение для ответа сервера с ошибкой.
 * @param {number} status — HTTP-статус
 */
function getStatusMessage(status) {
  if (status === 404) return 'Такие данные не найдены (ошибка 404).'
  if (status >= 500) return `Сервер временно не работает (ошибка ${status}). Попробуйте ещё раз чуть позже.`
  return `Сервер отклонил запрос (ошибка ${status}).`
}

/**
 * ДЗ №10 — GET-запрос к API: вся логика загрузки, ошибок и повтора живёт здесь,
 * а компонент только показывает результат. Работает с любым адресом.
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
        const response = await fetch(url, { signal: controller.signal })
        // fetch не считает ответы 404 и 500 ошибкой — проверяем статус сами
        if (!response.ok) throw new Error(getStatusMessage(response.status))
        setData(await response.json())
        setLoading(false)
      } catch (err) {
        // Запрос отменён: компонент закрыт или уже идёт новый запрос — показывать нечего
        if (err.name === 'AbortError') return
        // TypeError — сервер недоступен, SyntaxError — в ответе не JSON
        if (err instanceof TypeError) setError('Не удалось связаться с сервером. Проверьте интернет и попробуйте снова.')
        else if (err instanceof SyntaxError) setError('Сервер прислал данные, которые не удалось прочитать.')
        else setError(err.message)
        setLoading(false)
      }
    }

    load()
    return () => controller.abort()
  }, [url, attempt])

  const refetch = useCallback(() => setAttempt((prev) => prev + 1), [])

  return { data, loading, error, refetch }
}
