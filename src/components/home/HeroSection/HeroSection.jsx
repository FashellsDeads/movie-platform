import Container from '../../layout/Container/Container.jsx'
import './HeroSection.css'

/**
 * @typedef {Object} HeroSectionProps
 * @property {string} eyebrow — строка над заголовком
 * @property {string} heading — главный заголовок
 * @property {string} subheading — подзаголовок
 * @property {import('react').ReactNode} children — кнопки и ссылки (композиция через children)
 */

/**
 * Главный экран магазина.
 * @param {HeroSectionProps} props
 */
function HeroSection({ eyebrow, heading, subheading, children }) {
  return (
    <section className="hero">
      <Container>
        <div className="hero__content">
          <span className="hero__eyebrow">{eyebrow}</span>
          <h1 className="hero__heading">{heading}</h1>
          <p className="hero__subheading">{subheading}</p>
          <div className="hero__actions">{children}</div>
        </div>
      </Container>
    </section>
  )
}

export default HeroSection
