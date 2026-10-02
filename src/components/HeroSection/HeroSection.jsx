import Button from '../Button/Button.jsx'
import Container from '../Container/Container.jsx'
import './HeroSection.css'

/**
 * @typedef {Object} HeroSectionProps
 * @property {string} heading — главный заголовок
 * @property {string} subheading — подзаголовок
 * @property {string} buttonText — текст кнопки призыва к действию
 * @property {() => void} onButtonClick — обработчик кнопки
 */

/**
 * Главный экран с промо фильма.
 * @param {HeroSectionProps} props
 */
function HeroSection({ heading, subheading, buttonText, onButtonClick }) {
  return (
    <section id="home" className="hero">
      <Container>
        <div className="hero__content">
          <span className="hero__eyebrow">Онлайн-кинотеатр · 4K · без рекламы</span>
          <h1 className="hero__heading">{heading}</h1>
          <p className="hero__subheading">{subheading}</p>
          <Button text={buttonText} variant="primary" onClick={onButtonClick} />
        </div>
      </Container>
    </section>
  )
}

export default HeroSection
