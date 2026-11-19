import { useMemo } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import Button from '../../components/common/Button/Button.jsx'
import ErrorMessage from '../../components/common/ErrorMessage/ErrorMessage.jsx'
import Loader from '../../components/common/Loader/Loader.jsx'
import SectionHeader from '../../components/common/SectionHeader/SectionHeader.jsx'
import Container from '../../components/layout/Container/Container.jsx'
import ProductDetails from '../../components/product/ProductDetails/ProductDetails.jsx'
import ProductList from '../../components/product/ProductList/ProductList.jsx'
import { getMaxQuantity } from '../../context/cartReducer.js'
import { useCart } from '../../context/CartContext.jsx'
import { useFavorites } from '../../context/FavoritesContext.jsx'
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js'
import { useFetch } from '../../hooks/useFetch.js'
import { useLayout } from '../../hooks/useLayout.js'
import { useProductReviews } from '../../hooks/useProductReviews.js'
import { useToggleFavorite } from '../../hooks/useToggleFavorite.js'
import { getStatusMessage, productUrl, productsUrl } from '../../services/api.js'
import { cartToastText, sortProducts } from '../../utils/helpers.js'

const SIMILAR_COUNT = 4

/**
 * Страница товара «/products/:id»: id берётся из адреса через useParams,
 * товар загружается отдельным запросом, «Назад» — через useNavigate.
 */
function ProductDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { data: product, loading, error, refetch } = useFetch(productUrl(id))
  const { data: catalog } = useFetch(productsUrl())
  const [userReviews, addReview] = useProductReviews(product?.id)
  const { addToCart } = useCart()
  const { isFavorite } = useFavorites()
  const toggleFavorite = useToggleFavorite()
  const { showToast } = useLayout()

  const isNotFound = error === getStatusMessage(404)
  useDocumentTitle(product?.title ?? (loading ? 'Загрузка' : 'Товар не найден'))

  // «Похожие» — из той же категории; пересчёт только при смене каталога или товара
  const similar = useMemo(() => {
    if (!product || !catalog) return []
    const sameCategory = catalog.filter((item) => item.category === product.category && item.id !== product.id)
    return sortProducts(sameCategory, 'rating').slice(0, SIMILAR_COUNT)
  }, [catalog, product])

  // Шаг назад по истории; если страницу открыли по прямой ссылке, истории нет — ведём в каталог
  const goBack = () => (location.key === 'default' ? navigate('/products') : navigate(-1))

  let content
  if (loading) {
    content = <Loader label="Загружаем товар…" />
  } else if (isNotFound) {
    content = (
      <ErrorMessage title="Товар не найден" message={`Товара с номером «${id}» нет в каталоге. Возможно, ссылка устарела.`}>
        <Link className="link-button link-button--primary" to="/products">
          Открыть каталог
        </Link>
      </ErrorMessage>
    )
  } else if (error) {
    content = <ErrorMessage title="Не удалось загрузить товар" message={error} onRetry={refetch} />
  } else {
    const handleAddToCart = (quantity) => {
      const added = addToCart(product, quantity)
      showToast(cartToastText(product.title, quantity, added, getMaxQuantity(product.type)))
    }

    content = (
      <ProductDetails
        product={product}
        reviews={[...userReviews, ...(product.reviews ?? [])]}
        maxQuantity={getMaxQuantity(product.type)}
        isFavorite={isFavorite(product.id)}
        onToggleFavorite={(next) => toggleFavorite(product, next)}
        onAddToCart={handleAddToCart}
        onAddReview={(review) => {
          addReview(review)
          showToast('Спасибо! Отзыв опубликован')
        }}
      />
    )
  }

  return (
    <section className="page">
      <Container>
        <div className="page__back">
          <Button variant="outline" onClick={goBack}>
            ← Назад
          </Button>
        </div>
        {content}
      </Container>

      {similar.length > 0 && (
        <Container>
          <div className="section">
            <SectionHeader title="Похожие" subtitle={`Ещё из категории «${product.category}».`} align="left" />
            <ProductList products={similar} />
          </div>
        </Container>
      )}
    </section>
  )
}

export default ProductDetailsPage
