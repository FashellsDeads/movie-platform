import { formatDate } from '../../utils/format.js'
import './TestimonialCard.css'

/**
 * @typedef {Object} TestimonialCardProps
 * @property {string} authorName — имя зрителя
 * @property {string} authorRole — кто он на платформе
 * @property {string} avatar — аватар
 * @property {string} text — текст отзыва
 * @property {string} date — дата в формате ISO (YYYY-MM-DD)
 */

/**
 * Отзыв зрителя о кинотеатре.
 * @param {TestimonialCardProps} props
 */
function TestimonialCard({ authorName, authorRole, avatar, text, date }) {
  return (
    <figure className="testimonial">
      <blockquote className="testimonial__text">«{text}»</blockquote>
      <figcaption className="testimonial__author">
        <img className="testimonial__avatar" src={avatar} alt="" width={44} height={44} />
        <div>
          <p className="testimonial__name">{authorName}</p>
          <p className="testimonial__role">{authorRole}</p>
        </div>
        <time className="testimonial__date" dateTime={date}>
          {formatDate(date)}
        </time>
      </figcaption>
    </figure>
  )
}

export default TestimonialCard
