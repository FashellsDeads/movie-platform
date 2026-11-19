import './withLoading.css'

/**
 * Higher-Order Component: принимает компонент и возвращает новый,
 * который пока идёт загрузка показывает «Loading...», а потом — исходный компонент
 * со всеми его props (кроме служебного isLoading).
 * @template P
 * @param {import('react').ComponentType<P>} Component
 * @param {import('react').ComponentType} [LoadingFallback] — что показать во время загрузки (по умолчанию «Loading...»)
 * @returns {import('react').ComponentType<P & { isLoading: boolean }>}
 */
function withLoading(Component, LoadingFallback) {
  // HOC по определению создаёт компонент внутри функции — правило Fast Refresh здесь неприменимо
  // oxlint-disable-next-line react/only-export-components
  function WithLoading({ isLoading, ...props }) {
    if (isLoading) {
      if (LoadingFallback) return <LoadingFallback />
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
