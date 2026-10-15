import { Component } from 'react'
import { Link } from 'react-router-dom'
import Button from '../Button/Button.jsx'
import Container from '../Container/Container.jsx'

/**
 * @typedef {Object} ErrorBoundaryProps
 * @property {import('react').ReactNode} children — что защищаем
 * @property {string} resetKey — при его смене (переход на другой адрес) ошибка сбрасывается
 */

/**
 * Перехватывает ошибки при отрисовке дочерних компонентов (например, из-за испорченных
 * данных в localStorage) и показывает запасной экран вместо белой страницы.
 * Error Boundary в React можно написать только классом: у функциональных компонентов
 * нет аналога getDerivedStateFromError / componentDidCatch.
 * В MainLayout resetKey — текущий адрес: со страницы ошибки можно уйти по меню, не перезагружая сайт.
 * @extends {Component<ErrorBoundaryProps, { hasError: boolean, resetKey: string }>}
 */
class ErrorBoundary extends Component {
  state = { hasError: false, resetKey: this.props.resetKey }

  // ошибка в дочернем дереве → показываем запасной экран
  static getDerivedStateFromError() {
    return { hasError: true }
  }

  // адрес сменился → пробуем отрисовать новую страницу заново
  static getDerivedStateFromProps(props, state) {
    return props.resetKey === state.resetKey ? null : { hasError: false, resetKey: props.resetKey }
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <section className="page">
        <Container maxWidth={720}>
          <div className="empty-state empty-state--error" role="alert">
            <p className="empty-state__title">Что-то пошло не так</p>
            <p className="empty-state__text">
              Страница не смогла отобразиться. Попробуйте обновить её — или вернитесь на главную.
            </p>
            <div className="empty-state__actions">
              <Button text="Обновить страницу" variant="primary" onClick={() => window.location.reload()} />
              <Link className="link-button link-button--outline" to="/">
                На главную
              </Link>
            </div>
          </div>
        </Container>
      </section>
    )
  }
}

export default ErrorBoundary
