import { useEffect, useState } from 'react'
import './ScrollProgress.css'

/**
 * Полоса прогресса прокрутки страницы вверху экрана.
 */
function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  // ДЗ №4 · #14 — пересчитываем процент прокрутки при скролле и изменении размера окна
  useEffect(() => {
    const handleScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      setProgress(scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  return (
    <div
      className="scroll-progress"
      role="progressbar"
      aria-label="Прогресс прокрутки страницы"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
    >
      <div className="scroll-progress__bar" style={{ transform: `scaleX(${progress})` }} />
    </div>
  )
}

export default ScrollProgress
