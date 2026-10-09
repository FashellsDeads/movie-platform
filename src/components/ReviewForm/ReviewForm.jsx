import { useState } from 'react'
import { useAuth } from '../../context/auth/useAuth.js'
import Button from '../Button/Button.jsx'
import './ReviewForm.css'

const MAX_LENGTH = 300

/**
 * @typedef {Object} NewReview
 * @property {string} authorName
 * @property {string} authorRole
 * @property {string} avatar
 * @property {string} text
 */

/**
 * @typedef {Object} ReviewFormProps
 * @property {(review: NewReview) => void} onSubmit — опубликовать отзыв
 */

/**
 * Форма отзыва — защищённая секция: гость видит только предложение войти.
 * @param {ReviewFormProps} props
 */
function ReviewForm({ onSubmit }) {
  const { user, isAuthenticated, isAuthChecking, openLogin } = useAuth()
  const [text, setText] = useState('')

  if (isAuthChecking) return null

  if (!isAuthenticated) {
    return (
      <div className="review-form review-form--locked">
        <p className="review-form__locked-text">Отзывы могут оставлять только зрители, которые вошли в аккаунт.</p>
        <Button text="Войти, чтобы оставить отзыв" variant="primary" onClick={openLogin} />
      </div>
    )
  }

  const trimmedText = text.trim()

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!trimmedText) return
    onSubmit({ authorName: user.name, authorRole: user.role, avatar: user.avatarUrl, text: trimmedText })
    setText('')
  }

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <img className="review-form__avatar" src={user.avatarUrl} alt="" width={44} height={44} />
      <div className="review-form__body">
        <textarea
          className="review-form__input"
          value={text}
          maxLength={MAX_LENGTH}
          rows={3}
          placeholder={`${user.name}, как вам CineVibe?`}
          aria-label="Текст отзыва"
          onChange={(event) => setText(event.target.value)}
        />
        <div className="review-form__footer">
          <span className="review-form__counter">
            {text.length}/{MAX_LENGTH}
          </span>
          <button type="submit" className="button button--primary" disabled={!trimmedText}>
            Опубликовать
          </button>
        </div>
      </div>
    </form>
  )
}

export default ReviewForm
