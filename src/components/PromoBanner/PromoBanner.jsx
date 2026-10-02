import { useEffect, useState } from 'react'
import Button from '../Button/Button.jsx'
import './PromoBanner.css'

const formatTime = (totalSeconds) => {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0')
  const seconds = String(totalSeconds % 60).padStart(2, '0')
  return `${minutes}:${seconds}`
}

/**
 * @typedef {Object} PromoBannerProps
 * @property {string} title — заголовок акции
 * @property {string} text — условия акции
 * @property {string} buttonText — текст кнопки
 * @property {number} durationSeconds — сколько секунд действует акция
 * @property {() => void} onAction — клик по кнопке акции
 * @property {() => void} onClose — скрыть баннер
 */

/**
 * Баннер спецпредложения с таймером обратного отсчёта.
 * @param {PromoBannerProps} props
 */
function PromoBanner({ title, text, buttonText, durationSeconds, onAction, onClose }) {
  const [secondsLeft, setSecondsLeft] = useState(durationSeconds)
  const isExpired = secondsLeft === 0

  // ДЗ №4 · #6 — таймер: тикает раз в секунду, интервал очищается
  // при размонтировании баннера и после окончания акции
  useEffect(() => {
    if (isExpired) return

    const intervalId = setInterval(() => {
      setSecondsLeft((prev) => Math.max(prev - 1, 0))
    }, 1000)

    return () => clearInterval(intervalId)
  }, [isExpired])

  return (
    <aside className="promo" aria-label="Спецпредложение">
      <div className="promo__content">
        <p className="promo__title">{title}</p>
        <p className="promo__text">{isExpired ? 'Акция завершена — следите за новыми предложениями.' : text}</p>
      </div>
      <div className="promo__timer" role="timer" aria-live="off">
        <span className="promo__timer-label">{isExpired ? 'Время вышло' : 'Скидка сгорит через'}</span>
        <span className="promo__timer-value">{formatTime(secondsLeft)}</span>
      </div>
      <Button text={buttonText} variant="primary" isDisabled={isExpired} onClick={onAction} />
      <button type="button" className="promo__close" aria-label="Скрыть предложение" onClick={onClose}>
        ×
      </button>
    </aside>
  )
}

export default PromoBanner
