import Card from '../../common/Card/Card.jsx'
import Container from '../../layout/Container/Container.jsx'
import './AuthCard.css'

/**
 * Общий вид страниц входа и регистрации: карточка с заголовком, формой и подписью снизу.
 * @param {{ title: string, subtitle: string, footer: import('react').ReactNode, children: import('react').ReactNode }} props
 */
function AuthCard({ title, subtitle, footer, children }) {
  return (
    <section className="page">
      <Container maxWidth={560}>
        <Card as="div" size="large" className="auth-card">
          <h1 className="auth-card__title">{title}</h1>
          <p className="auth-card__subtitle">{subtitle}</p>
          {children}
          <div className="auth-card__footer">{footer}</div>
        </Card>
      </Container>
    </section>
  )
}

export default AuthCard
