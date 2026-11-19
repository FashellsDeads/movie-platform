import './Loader.css'

/**
 * Состояние «загрузка» для любой страницы с данными.
 * @param {{ label?: string }} props
 */
function Loader({ label = 'Загрузка…' }) {
  return (
    <div className="loader" role="status">
      <span className="loader__spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}

export default Loader
