import { useCallback, useEffect, useMemo, useState } from 'react'

/**
 * @template T
 * @typedef {Object} DataLoaderProps
 * @property {(signal: AbortSignal) => Promise<T>} loadData — функция загрузки; при её смене данные грузятся заново
 * @property {(data: T | null, loading: boolean, error: string | null, reload: () => void) => import('react').ReactNode} children
 *   — render prop: внешний компонент решает, как показать каждое состояние
 */

/**
 * Render Props. DataLoader сам занимается загрузкой, loading и ошибкой,
 * а отображение целиком отдаёт функции-children.
 * @template T
 * @param {DataLoaderProps<T>} props
 */
function DataLoader({ loadData, children }) {
  // Номер попытки: reload увеличивает его, и эффект загружает данные заново
  const [attempt, setAttempt] = useState(0)
  // Текущий запрос — новый объект при смене функции загрузки или попытки
  const request = useMemo(() => ({ loadData, attempt }), [loadData, attempt])
  // Результат помнит, к какому запросу он относится
  const [result, setResult] = useState({ request: null, data: null, error: null })

  useEffect(() => {
    const controller = new AbortController()

    request
      .loadData(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setResult({ request, data, error: null })
      })
      .catch((err) => {
        // Ответ пришёл после размонтирования или новой загрузки — он уже не нужен
        if (controller.signal.aborted || err.name === 'AbortError') return
        setResult({ request, data: null, error: err.message })
      })

    return () => controller.abort()
  }, [request])

  // стабильная функция: render prop может передать её в memo-кнопку или в зависимости эффекта
  const reload = useCallback(() => setAttempt((prev) => prev + 1), [])

  // loading не хранится отдельно: идёт загрузка, пока результат не для текущего запроса
  const loading = result.request !== request
  return children(loading ? null : result.data, loading, loading ? null : result.error, reload)
}

export default DataLoader
