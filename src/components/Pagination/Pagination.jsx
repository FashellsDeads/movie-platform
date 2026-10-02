import './Pagination.css'

/**
 * @typedef {Object} PaginationProps
 * @property {number} currentPage — текущая страница (с 1)
 * @property {number} totalPages — всего страниц
 * @property {(page: number) => void} onPageChange — переход на страницу
 */

/**
 * Переключатель страниц каталога.
 * @param {PaginationProps} props
 */
function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <nav className="pagination" aria-label="Страницы каталога">
      <button
        type="button"
        className="pagination__button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
      >
        ← Назад
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          className={`pagination__button pagination__page${page === currentPage ? ' pagination__page--active' : ''}`}
          aria-current={page === currentPage ? 'page' : undefined}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        className="pagination__button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
      >
        Вперёд →
      </button>
    </nav>
  )
}

export default Pagination
