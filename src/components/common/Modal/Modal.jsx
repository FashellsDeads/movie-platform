import { useEffect, useId, useRef } from 'react'
import './Modal.css'

/**
 * @typedef {Object} ModalProps
 * @property {boolean} isOpen — показано ли окно
 * @property {string} [title] — заголовок окна; без него содержимое целиком задаётся children
 * @property {() => void} onClose — закрыть окно
 * @property {import('react').ReactNode} [children] — содержимое окна
 */

/**
 * Модальное окно. Пока isOpen === false, ничего не рендерит.
 * @param {ModalProps} props
 */
function Modal({ isOpen, title, onClose, children }) {
  const titleId = useId()
  const dialogRef = useRef(null)

  // Фокус: при открытии — на первую кнопку окна (кроме «×»), при закрытии — обратно туда,
  // откуда окно открыли, чтобы пользователь клавиатуры не терял место на странице
  useEffect(() => {
    if (!isOpen) return
    const previous = document.activeElement
    const focusable = dialogRef.current?.querySelectorAll('button, [href], input, select, textarea') ?? []
    const first = [...focusable].find((element) => !element.classList.contains('modal__close')) ?? focusable[0]
    first?.focus()

    return () => {
      if (previous instanceof HTMLElement && previous.isConnected) previous.focus()
    }
  }, [isOpen])

  // Закрытие по Escape, подписка живёт только пока окно открыто
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="modal" onClick={onClose}>
      <div
        ref={dialogRef}
        className="modal__dialog"
        role="dialog"
        aria-modal="true"
        // Без заголовка окно всё равно должно иметь имя для экранного диктора
        aria-labelledby={title ? titleId : undefined}
        aria-label={title ? undefined : 'Диалог'}
        onClick={(event) => event.stopPropagation()}
      >
        {/* title необязателен: тогда всё содержимое задаётся снаружи через children */}
        <header className={`modal__header${title ? '' : ' modal__header--bare'}`}>
          {title && (
            <h2 id={titleId} className="modal__title">
              {title}
            </h2>
          )}
          <button type="button" className="modal__close" aria-label="Закрыть" onClick={onClose}>
            ×
          </button>
        </header>
        <div className="modal__body">{children}</div>
      </div>
    </div>
  )
}

export default Modal
