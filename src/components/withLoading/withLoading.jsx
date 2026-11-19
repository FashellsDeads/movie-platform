import './withLoading.css'

/**
 * ДЗ №12 — Higher-Order Component: принимает компонент и возвращает новый,
 * который пока идёт загрузка показывает «Loading...», а потом — исходный компонент
 * со всеми его props (кроме служебного isLoading).
 * @template P
 * @param {import('react').ComponentType<P>} Component
 * @returns {import('react').ComponentType<P & { isLoading: boolean }>}
 */
function withLoading(Component) {
  // HOC по определению создаёт компонент внутри функции — правило Fast Refresh здесь неприменимо
  // oxlint-disable-next-line react/only-export-components
  function WithLoading({ isLoading, ...props }) {
    if (isLoading) {
      return (
        <p className="with-loading" role="status">
          Loading...
        </p>
      )
    }

    return <Component {...props} />
  }

  WithLoading.displayName = `withLoading(${Component.displayName || Component.name || 'Component'})`
  return WithLoading
}

export default withLoading
