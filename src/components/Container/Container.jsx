import './Container.css'

/**
 * @typedef {Object} ContainerProps
 * @property {import('react').ReactNode} children — содержимое секции
 * @property {number} [maxWidth=1200] — максимальная ширина в пикселях
 */

/**
 * Обёртка, центрирующая содержимое секции и ограничивающая его ширину.
 * @param {ContainerProps} props
 */
function Container({ children, maxWidth = 1200 }) {
  return (
    <div className="container" style={{ maxWidth }}>
      {children}
    </div>
  )
}

export default Container
