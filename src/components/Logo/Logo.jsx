import './Logo.css'

/**
 * @typedef {Object} LogoProps
 * @property {string} src — путь к изображению логотипа
 * @property {string} altText — альтернативный текст
 * @property {number} width — ширина в пикселях
 * @property {number} height — высота в пикселях
 */

/**
 * Логотип онлайн-кинотеатра — ссылка на главный экран.
 * @param {LogoProps} props
 */
function Logo({ src, altText, width, height }) {
  return (
    <a className="logo" href="#home" aria-label={`${altText} — на главную`}>
      <img src={src} alt={altText} width={width} height={height} />
    </a>
  )
}

export default Logo
