import { Link } from 'react-router-dom'
import { useTheme } from '../../context/theme/useTheme.js'
import Container from '../Container/Container.jsx'
import logoLight from '../../assets/logo-light.svg'
import logoDark from '../../assets/logo.svg'
import Logo from '../Logo/Logo.jsx'
import './Footer.css'

/**
 * @typedef {Object} SocialLink
 * @property {string} platform — название соцсети
 * @property {string} url — ссылка на страницу
 * @property {string} icon — данные SVG-пути иконки (атрибут d)
 */

/**
 * @typedef {Object} FooterProps
 * @property {string} copyrightText — год и авторские права
 * @property {SocialLink[]} socialLinks — ссылки на соцсети
 * @property {import('../Navigation/Navigation.jsx').NavItem[]} links — внутренние разделы сайта
 */

/**
 * Подвал сайта. Логотип и оформление зависят от темы из ThemeContext.
 * @param {FooterProps} props
 */
function Footer({ copyrightText, socialLinks, links }) {
  const { theme, isDarkMode } = useTheme()
  const logoSrc = isDarkMode ? logoDark : logoLight

  return (
    <footer className={`footer footer--${theme}`}>
      <Container maxWidth={1320}>
        <div className="footer__top">
          <div className="footer__brand">
            <Logo src={logoSrc} altText="CineVibe" width={126} height={30} />
            <p className="footer__tagline">Фильмы, которые хочется обсуждать.</p>
          </div>

          {/* ДЗ №6 · #3 — внутренние ссылки через Link: переход без перезагрузки страницы */}
          <nav aria-label="Разделы сайта">
            <ul className="footer__links">
              {links.map((item) => (
                <li key={item.id}>
                  <Link className="footer__link" to={item.link}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <ul className="footer__socials">
            {socialLinks.map(({ platform, url, icon }) => (
              <li key={platform}>
                <a
                  className="footer__social-link"
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={platform}
                  title={platform}
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                    <path d={icon} />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <p className="footer__copyright">{copyrightText}</p>
      </Container>
    </footer>
  )
}

export default Footer
