import { Link } from 'react-router-dom'
import './Logo.css'

/**
 * @typedef {Object} LogoProps
 * @property {string} src — путь к изображению логотипа
 * @property {string} altText — альтернативный текст
 * @property {number} width — ширина в пикселях
 * @property {number} height — высота в пикселях
 */

/**
 * Логотип онлайн-кинотеатра — ссылка на главную страницу (Link без перезагрузки).
 * @param {LogoProps} props
 */
function Logo({ src, altText, width, height }) {
  return (
    <Link className="logo" to="/" aria-label={`${altText} — на главную`}>
      <img src={src} alt="" width={width} height={height} />
    </Link>
  )
}

export default Logo
