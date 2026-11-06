import { useNavigate, useParams } from 'react-router-dom'
import { getUserPostsUrl, getUserUrl } from '../api/usersApi.js'
import Button from '../components/Button/Button.jsx'
import Container from '../components/Container/Container.jsx'
import ErrorState from '../components/ErrorState/ErrorState.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { useFetch } from '../hooks/useFetch.js'
import './UsersPage.css'

/**
 * Страница «/users/:id» (доп. задания ДЗ №10): id берётся из адреса, а данные пользователя
 * и его посты загружает один и тот же useFetch — меняется только URL.
 */
function UserDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: user, loading, error, refetch } = useFetch(getUserUrl(id))
  const posts = useFetch(getUserPostsUrl(id))

  useDocumentTitle(user?.name ?? 'Пользователь')

  return (
    <section className="page">
      <Container>
        <div className="page__back">
          <Button text="← Назад" variant="secondary" onClick={() => navigate('/users')} />
        </div>

        {loading && (
          <p className="users-status" role="status">
            Загрузка...
          </p>
        )}
        {error && (
          <ErrorState
            title="Не удалось загрузить пользователя"
            message={error}
            retryText="Повторить запрос"
            onRetry={refetch}
          />
        )}

        {user && (
          <>
            <article className="user-details">
              <h2 className="user-details__name">{user.name}</h2>
              <p className="user-details__username">@{user.username}</p>
              <dl className="user-details__info">
                <div>
                  <dt>Email</dt>
                  <dd>
                    <a href={`mailto:${user.email}`}>{user.email}</a>
                  </dd>
                </div>
                <div>
                  <dt>Телефон</dt>
                  <dd>{user.phone}</dd>
                </div>
                <div>
                  <dt>Сайт</dt>
                  <dd>{user.website}</dd>
                </div>
                <div>
                  <dt>Компания</dt>
                  <dd>{user.company.name}</dd>
                </div>
                <div>
                  <dt>Город</dt>
                  <dd>{user.address.city}</dd>
                </div>
              </dl>
            </article>

            <h3 className="user-posts__title">Посты</h3>
            {posts.loading && (
              <p className="users-status" role="status">
                Загрузка постов...
              </p>
            )}
            {posts.error && (
              <ErrorState
                title="Не удалось загрузить посты"
                message={posts.error}
                retryText="Повторить запрос"
                onRetry={posts.refetch}
              />
            )}
            {posts.data?.length === 0 && (
              <div className="empty-state">
                <p className="empty-state__title">Постов пока нет</p>
              </div>
            )}
            {posts.data?.length > 0 && (
              <ul className="user-posts__list">
                {posts.data.map((post) => (
                  <li key={post.id}>
                    <article className="user-posts__item">
                      <h4>{post.title}</h4>
                      <p>{post.body}</p>
                    </article>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </Container>
    </section>
  )
}

export default UserDetailsPage
