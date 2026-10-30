import ProductItem, { MemoProductItem } from '../ProductItem/ProductItem.jsx'
import './ProductList.css'

/**
 * @typedef {Object} ProductListProps
 * @property {import('../../data/barProducts.js').Product[]} products — уже отфильтрованные и отсортированные товары
 * @property {Record<number, { quantity: number }>} cart — заказ: id товара → позиция
 * @property {(product: import('../../data/barProducts.js').Product) => void} onAddToCart
 * @property {boolean} isOptimized — рисовать карточки через React.memo или без него
 * @property {() => void} onReset — сбросить фильтры, если ничего не нашлось
 */

/**
 * Список товаров через map(). Сам список не обёрнут в memo: он перерисовывается вместе
 * с родителем, но в оптимизированном режиме его карточки (MemoProductItem) — нет.
 * @param {ProductListProps} props
 */
function ProductList({ products, cart, onAddToCart, isOptimized, onReset }) {
  console.log('ProductList render')

  if (products.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-state__title">Ничего не нашлось</p>
        <p className="empty-state__text">Попробуйте другое название или категорию.</p>
        <button type="button" className="link-button link-button--outline" onClick={onReset}>
          Сбросить фильтры
        </button>
      </div>
    )
  }

  // выбираем компонент, а не создаём новый: так переключатель режимов сравнивает одну и ту же карточку
  const Item = isOptimized ? MemoProductItem : ProductItem

  return (
    <ul className="product-list">
      {products.map((product) => (
        <li key={product.id}>
          <Item product={product} quantity={cart[product.id]?.quantity ?? 0} onAddToCart={onAddToCart} />
        </li>
      ))}
    </ul>
  )
}

export default ProductList
