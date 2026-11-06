import { useEffect, useState } from 'react'

/**
 * ДЗ №10 — значение с задержкой: обновляется, только когда value не менялось delay мс.
 * Каждая новая буква отменяет прошлый таймер и запускает новый.
 * @template T
 * @param {T} value — исходное значение
 * @param {number} delay — задержка в миллисекундах
 * @returns {T}
 */
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timerId = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timerId)
  }, [value, delay])

  return debouncedValue
}
