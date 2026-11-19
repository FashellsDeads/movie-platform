import './Card.css'

/**
 * @typedef {Object} CardProps
 * @property {import('react').ReactNode} children — любое содержимое карточки
 * @property {string} [title] — необязательный заголовок над содержимым
 * @property {'small' | 'medium' | 'large'} [size='medium'] — внутренние отступы и размер заголовка
 * @property {import('react').ElementType} [as='article'] — какой тег будет корнем
 * @property {string} [className] — дополнительный класс снаружи
 */

/**
 * ДЗ №12 — универсальная карточка. Она не знает, что лежит внутри:
 * содержимое приходит через children, остальные props уходят в корневой элемент.
 * @param {CardProps & import('react').HTMLAttributes<HTMLElement>} props
 */
function Card({ children, title, size = 'medium', as: Tag = 'article', className, ...rest }) {
  const classes = ['ui-card', `ui-card--${size}`, className].filter(Boolean).join(' ')

  return (
    <Tag {...rest} className={classes}>
      {title && <h3 className="ui-card__title">{title}</h3>}
      {children}
    </Tag>
  )
}

export default Card
