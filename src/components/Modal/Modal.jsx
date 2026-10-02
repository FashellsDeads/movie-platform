import { useId } from 'react'
import './Modal.css'

/**
 * @typedef {Object} ModalProps
 * @property {boolean} isOpen — показано ли окно
 * @property {string} title — заголовок окна
 * @property {() => void} onClose — закрыть окно
 * @property {import('react').ReactNode} [children] — содержимое окна
 */

/**
 * Модальное окно. Пока isOpen === false, ничего не рендерит.
 * @param {ModalProps} props
 */
function Modal({ isOpen, title, onClose, children }) {
  const titleId = useId()

  if (!isOpen) return null

  return (
    <div className="modal" onClick={onClose}>
      <div
        className="modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="modal__header">
          <h2 id={titleId} className="modal__title">
            {title}
          </h2>
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
