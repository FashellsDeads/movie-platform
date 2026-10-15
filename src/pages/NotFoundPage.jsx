import { Link, useLocation } from 'react-router-dom'
import Container from '../components/Container/Container.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'

/**
 * Маршрут «*» — любой адрес, которого нет в приложении.
 */
function NotFoundPage() {
  useDocumentTitle('Страница не найдена')
  const { pathname } = useLocation()

  return (
    <section className="page">
      <Container maxWidth={720}>
        <div className="empty-state">
          <p className="empty-state__code" aria-hidden="true">
            404
          </p>
          <h1 className="empty-state__title">Такой страницы нет</h1>
          <p className="empty-state__text">
            Адреса <code>{pathname}</code> не существует — возможно, ссылка устарела или в ней опечатка.
          </p>
          <div className="empty-state__actions">
            <Link className="link-button link-button--primary" to="/">
              На главную
            </Link>
            <Link className="link-button link-button--outline" to="/movies">
              В каталог фильмов
            </Link>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default NotFoundPage
