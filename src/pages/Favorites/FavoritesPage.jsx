import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import EmptyState from '../../components/common/EmptyState/EmptyState.jsx'
import ErrorMessage from '../../components/common/ErrorMessage/ErrorMessage.jsx'
import Loader from '../../components/common/Loader/Loader.jsx'
import SectionHeader from '../../components/common/SectionHeader/SectionHeader.jsx'
import Container from '../../components/layout/Container/Container.jsx'
import ProductList from '../../components/product/ProductList/ProductList.jsx'
import { useFavorites } from '../../context/FavoritesContext.jsx'
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js'
import { useFetch } from '../../hooks/useFetch.js'
import { productsUrl } from '../../services/api.js'
import { pluralize } from '../../utils/helpers.js'

/**
 * Страница «/favorites». FavoritesContext хранит только id отмеченных товаров,
 * а сами товары берутся из каталога — данные не дублируются в двух местах.
 */
function FavoritesPage() {
  useDocumentTitle('Избранное')
  const { favoriteIds } = useFavorites()
  const { data: products, loading, error, refetch } = useFetch(productsUrl())

  // useMemo: список пересобирается только при смене каталога или отметок
  const favorites = useMemo(() => {
    const byId = new Map((products ?? []).map((product) => [product.id, product]))
    // Порядок — как в избранном: последний добавленный в конце
    return favoriteIds.map((id) => byId.get(id)).filter(Boolean)
  }, [products, favoriteIds])

  let content
  if (loading) content = <Loader />
  else if (error) content = <ErrorMessage message={error} onRetry={refetch} />
  else if (favorites.length === 0) {
    content = (
      <EmptyState message="В избранном пока ничего нет" hint="Нажмите ♡ на карточке фильма или товара кинобара.">
        <Link className="link-button link-button--primary" to="/products">
          Перейти в каталог
        </Link>
      </EmptyState>
    )
  } else content = <ProductList products={favorites} />

  const count = favorites.length
  return (
    <section className="page">
      <Container>
        <SectionHeader
          title="Избранное"
          subtitle={count > 0 ? `${count} ${pluralize(count, ['товар', 'товара', 'товаров'])} — к ним хочется вернуться.` : ''}
          align="left"
          level={1}
        />
        {content}
      </Container>
    </section>
  )
}

export default FavoritesPage
