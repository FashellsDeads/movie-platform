import { Link } from 'react-router-dom'
import './TodaySchedule.css'

/**
 * Все сеансы дня по времени: «11:00 · Дюна · CineVibe Hall». Клик открывает страницу фильма.
 * @param {{ movies: Array<{ id: number, title: string, showtimes?: Array<{ time: string, hall: string }> }> }} props
 */
function TodaySchedule({ movies }) {
  const sessions = movies
    .flatMap((movie) => (movie.showtimes ?? []).map((showtime) => ({ ...showtime, movieId: movie.id, title: movie.title })))
    .sort((a, b) => a.time.localeCompare(b.time))

  return (
    <ul className="today-schedule">
      {sessions.map((session) => (
        <li key={`${session.movieId}-${session.time}`}>
          <Link className="today-schedule__item" to={`/products/${session.movieId}`}>
            <span className="today-schedule__time">{session.time}</span>
            <span className="today-schedule__title">{session.title}</span>
            <span className="today-schedule__hall">{session.hall}</span>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default TodaySchedule
