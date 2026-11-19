import './SectionHeader.css'

/**
 * @typedef {Object} SectionHeaderProps
 * @property {string} title — заголовок секции
 * @property {string} [subtitle] — поясняющий текст под заголовком
 * @property {'left' | 'center'} [align='left'] — выравнивание
 * @property {1 | 2} [level=2] — уровень заголовка: 1 — заголовок всей страницы
 */

/**
 * Заголовок крупного блока страницы.
 * @param {SectionHeaderProps} props
 */
function SectionHeader({ title, subtitle, align = 'left', level = 2 }) {
  const Heading = `h${level}`
  return (
    <div className={`section-header section-header--${align}`}>
      <Heading className="section-header__title">{title}</Heading>
      {subtitle && <p className="section-header__subtitle">{subtitle}</p>}
    </div>
  )
}

export default SectionHeader
