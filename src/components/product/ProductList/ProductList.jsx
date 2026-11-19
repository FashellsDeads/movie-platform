import { useCallback } from 'react'
import { getMaxQuantity } from '../../../context/cartReducer.js'
import { useCart } from '../../../context/CartContext.jsx'
import { useFavorites } from '../../../context/FavoritesContext.jsx'
import { useLayout } from '../../../hooks/useLayout.js'
import { useToggleFavorite } from '../../../hooks/useToggleFavorite.js'
import { cartToastText } from '../../../utils/helpers.js'
import ProductCard from '../ProductCard/ProductCard.jsx'

/**
 * Сетка карточек товаров. Избранное и корзину берёт из контекстов.
 * @param {{ products: import('../ProductCard/ProductCard.jsx').Product[] }} props
 */
function ProductList({ products }) {
  const { isFavorite } = useFavorites()
  const { addToCart } = useCart()
  const { showToast } = useLayout()
  const toggleFavorite = useToggleFavorite()

  // useCallback: колбэк уходит в memo-карточки; новая функция на каждом рендере
  // заставила бы перерисовываться все карточки сразу и memo потерял бы смысл
  const handleAddToCart = useCallback(
    (product) => {
      const added = addToCart(product)
      showToast(cartToastText(product.title, 1, added, getMaxQuantity(product.type)))
    },
    [addToCart, showToast],
  )

  return (
    <div className="product-grid" data-testid="product-list">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isFavorite={isFavorite(product.id)}
          onToggleFavorite={toggleFavorite}
          onAddToCart={handleAddToCart}
        />
      ))}
    </div>
  )
}

export default ProductList
