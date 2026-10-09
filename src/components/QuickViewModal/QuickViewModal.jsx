import { useCart } from '../../context/cart/useCart.js'
import { toTicket } from '../../utils/movies.js'
import Badge from '../Badge/Badge.jsx'
import Button from '../Button/Button.jsx'
import Modal from '../Modal/Modal.jsx'
import QuantitySelector from '../QuantitySelector/QuantitySelector.jsx'
import RatingStars from '../RatingStars/RatingStars.jsx'
import './QuickViewModal.css'

/**
 * @typedef {Object} QuickViewModalProps
 * @property {boolean} isOpen — показано ли окно
 * @property {Object | null} movie — фильм для просмотра
 * @property {() => void} onClose — закрыть окно
 */

/**
 * Окно быстрого просмотра фильма: трейлер, описание, билеты на показ.
 * Билеты добавляются в корзину через CartContext.
 * @param {QuickViewModalProps} props
 */
function QuickViewModal({ isOpen, movie, onClose }) {
  const { addToCart } = useCart()

  const handleAddTickets = (quantity) => {
    addToCart(toTicket(movie), quantity)
    onClose()
  }

  return (
    <Modal isOpen={isOpen && movie !== null} title={movie?.title ?? ''} onClose={onClose}>
      {movie && (
        <div className="quick-view">
          <div className="quick-view__player" style={{ backgroundImage: `url("${movie.imageUrl}")` }}>
            <span className="quick-view__play" aria-hidden="true">
              ▶
            </span>
          </div>

          <div className="quick-view__meta">
            <Badge label={movie.status.label} colorScheme={movie.status.colorScheme} />
            <span>
              {movie.year} · {movie.genre} · {movie.duration}
            </span>
          </div>
          <RatingStars score={movie.score} reviewsCount={movie.reviewsCount} />
          <p className="quick-view__description">{movie.description}</p>

          <QuantitySelector
            unitPrice={movie.ticketPrice}
            label={movie.isAvailable ? 'Билеты в зал CineVibe Hall' : 'Билеты на премьеру'}
            confirmText="В мои билеты"
            onConfirm={handleAddTickets}
          />

          <div className="quick-view__actions">
            {movie.isAvailable && <Button text="Начать просмотр" variant="primary" onClick={onClose} />}
            <Button text="Закрыть" variant="outline" onClick={onClose} />
          </div>
        </div>
      )}
    </Modal>
  )
}

export default QuickViewModal
