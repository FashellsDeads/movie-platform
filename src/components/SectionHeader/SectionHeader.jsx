import './SectionHeader.css'

/**
 * @typedef {Object} SectionHeaderProps
 * @property {string} title — заголовок секции
 * @property {string} [subtitle] — поясняющий текст под заголовком
 * @property {'left' | 'center'} [align='left'] — выравнивание
 */

/**
 * Заголовок крупного блока страницы.
 * @param {SectionHeaderProps} props
 */
function SectionHeader({ title, subtitle, align = 'left' }) {
  return (
    <header className={`section-header section-header--${align}`}>
      <h2 className="section-header__title">{title}</h2>
      {subtitle && <p className="section-header__subtitle">{subtitle}</p>}
    </header>
  )
}

export default SectionHeader
