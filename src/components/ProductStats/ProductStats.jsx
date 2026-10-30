import { useMemo } from 'react'
import { formatNumber, pluralize } from '../../utils/format.js'
import './ProductStats.css'

/**
 * @typedef {Object} ProductStatsProps
 * @property {import('../../data/barProducts.js').Product[]} products — найденные товары
 */

/**
 * Сводка по найденным товарам. Средняя цена и средний рейтинг считаются в useMemo:
 * пока массив products тот же (та же ссылка), вычисления не повторяются.
 * @param {ProductStatsProps} props
 */
function ProductStats({ products }) {
  console.log('ProductStats render')

  const averagePrice = useMemo(() => {
    console.log('ProductStats: считаем среднюю цену')
    if (products.length === 0) return 0
    return products.reduce((sum, product) => sum + product.price, 0) / products.length
  }, [products])

  const averageRating = useMemo(() => {
    console.log('ProductStats: считаем средний рейтинг')
    if (products.length === 0) return 0
    return products.reduce((sum, product) => sum + product.rating, 0) / products.length
  }, [products])

  const isEmpty = products.length === 0

  return (
    <dl className="product-stats">
      <div className="product-stats__item">
        <dt>Найдено</dt>
        <dd>
          {products.length} {pluralize(products.length, ['товар', 'товара', 'товаров'])}
        </dd>
      </div>
      <div className="product-stats__item">
        <dt>Средняя цена</dt>
        <dd>{isEmpty ? '—' : `${formatNumber(Math.round(averagePrice))} ₸`}</dd>
      </div>
      <div className="product-stats__item">
        <dt>Средний рейтинг</dt>
        <dd>{isEmpty ? '—' : `★ ${averageRating.toFixed(2)}`}</dd>
      </div>
    </dl>
  )
}

export default ProductStats
