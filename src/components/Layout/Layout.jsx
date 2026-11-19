import './Layout.css'

/**
 * @typedef {Object} LayoutProps
 * @property {import('react').ReactNode} [header] — верхняя часть
 * @property {import('react').ReactNode} [sidebar] — боковая колонка
 * @property {import('react').ReactNode} [footer] — нижняя часть
 * @property {import('react').ReactNode} children — основное содержимое
 * @property {string} [className] — дополнительный класс снаружи
 */

/**
 * ДЗ №12 — Layout Pattern: каркас из слотов. Сам ничего не знает о содержимом,
 * просто расставляет переданные элементы. Пустые слоты не рендерятся.
 * @param {LayoutProps} props
 */
function Layout({ header, sidebar, footer, children, className }) {
  const classes = ['layout', sidebar && 'layout--with-sidebar', className].filter(Boolean).join(' ')

  return (
    <div className={classes}>
      {header && <header className="layout__header">{header}</header>}
      {sidebar && <aside className="layout__sidebar">{sidebar}</aside>}
      <div className="layout__main">{children}</div>
      {footer && <footer className="layout__footer">{footer}</footer>}
    </div>
  )
}

export default Layout
