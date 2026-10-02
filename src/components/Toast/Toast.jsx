import { useEffect } from 'react'
import './Toast.css'

const HIDE_DELAY_MS = 3000

/**
 * @typedef {Object} ToastData
 * @property {number} id — уникальный id, чтобы одинаковый текст перезапускал таймер
 * @property {string} text — текст уведомления
 */

/**
 * @typedef {Object} ToastProps
 * @property {ToastData | null} toast — текущее уведомление
 * @property {() => void} onClose — скрыть уведомление
 */

/**
 * Всплывающее уведомление внизу экрана.
 * @param {ToastProps} props
 */
function Toast({ toast, onClose }) {
  // ДЗ №4 · #12 — автоскрытие через 3 секунды; новое уведомление сбрасывает таймер
  useEffect(() => {
    if (!toast) return

    const timerId = setTimeout(onClose, HIDE_DELAY_MS)
    return () => clearTimeout(timerId)
  }, [toast, onClose])

  if (!toast) return null

  return (
    <div className="toast" role="status" key={toast.id}>
      <span className="toast__icon" aria-hidden="true">
        ♥
      </span>
      {toast.text}
    </div>
  )
}

export default Toast
