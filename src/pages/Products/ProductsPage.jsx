import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Button from '../../components/common/Button/Button.jsx'
import EmptyState from '../../components/common/EmptyState/EmptyState.jsx'
import ErrorMessage from '../../components/common/ErrorMessage/ErrorMessage.jsx'
import Loader from '../../components/common/Loader/Loader.jsx'
import withLoading from '../../components/common/withLoading/withLoading.jsx'
import Container from '../../components/layout/Container/Container.jsx'
import Layout from '../../components/layout/Layout/Layout.jsx'
import ProductFilters from '../../components/product/ProductFilters/ProductFilters.jsx'
import ProductList from '../../components/product/ProductList/ProductList.jsx'
import { useDebounce } from '../../hooks/useDebounce.js'
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js'
import { useFetch } from '../../hooks/useFetch.js'
import { productsUrl } from '../../services/api.js'
import { ALL, filterProducts, getCategories, sortProducts } from '../../utils/helpers.js'
import './ProductsPage.css'

const SEARCH_DELAY = 300
const DEFAULT_SORT = 'rating'

const CatalogLoader = () => <Loader label="Загружаем каталог…" />

// HOC применяется один раз на уровне модуля: пока каталог грузится — индикатор загрузки, потом список
const ProductListWithLoading = withLoading(ProductList, CatalogLoader)

/**
 * Каталог «/products»: билеты и кинобар. Данные — настоящий запрос через useFetch,
 * фильтры и сортировка — в адресе (useSearchParams), поиск — с задержкой (useDebounce).
 */
function ProductsPage() {
  useDocumentTitle('Каталог')
  const { data: products, loading, error, refetch } = useFetch(productsUrl())
  const [searchParams, setSearchParams] = useSearchParams()
  const searchRef = useRef(null)

  const type = searchParams.get('type') ?? ALL
  const category = searchParams.get('category') ?? ALL
  const sortBy = searchParams.get('sort') ?? DEFAULT_SORT

  // Поле поиска обновляется сразу, а фильтрация и адрес — после паузы в наборе
  const urlQuery = searchParams.get('q') ?? ''
  const [query, setQuery] = useState(urlQuery)
  const debouncedQuery = useDebounce(query, SEARCH_DELAY)

  // Адрес поменяли снаружи (ссылка «Каталог» в шапке, «Назад» в браузере) — поле поиска следует за ним.
  // Состояние подстраивается прямо во время рендера, как советует документация React, без лишнего эффекта
  // Свои записи в адрес совпадают с debouncedQuery — их не трогаем, иначе буква, набранная
  // в момент обновления адреса, затиралась бы старым значением
  const [syncedUrlQuery, setSyncedUrlQuery] = useState(urlQuery)
  if (urlQuery !== syncedUrlQuery) {
    setSyncedUrlQuery(urlQuery)
    if (urlQuery !== debouncedQuery.trim()) setQuery(urlQuery)
  }

  /** Меняет параметры адреса; значения по умолчанию в адрес не пишутся. */
  const updateParams = useCallback(
    (changes) =>
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          for (const [key, value] of Object.entries(changes)) {
            if (!value || value === ALL || (key === 'sort' && value === DEFAULT_SORT)) next.delete(key)
            else next.set(key, value)
          }
          return next
        },
        { replace: true },
      ),
    [setSearchParams],
  )

  // Запрос попадает в адрес только когда закончилась пауза в наборе. setSearchParams меняет ссылку
  // при каждой навигации, поэтому функцию берём через ref: иначе эффект перезапускался бы
  // после перехода по «Каталог» и возвращал в адрес старый запрос
  const updateParamsRef = useRef(updateParams)
  useEffect(() => {
    updateParamsRef.current = updateParams
  }, [updateParams])

  useEffect(() => {
    updateParamsRef.current({ q: debouncedQuery.trim() })
  }, [debouncedQuery])

  // useMemo: фильтрация и сортировка всего каталога пересчитываются только при смене
  // данных или фильтров, а не на каждый рендер (ввод буквы до паузы, смена темы)
  const visibleProducts = useMemo(
    () => sortProducts(filterProducts(products ?? [], { query: debouncedQuery, type, category }), sortBy),
    [products, debouncedQuery, type, category, sortBy],
  )
  // список категорий раздела — тоже только при смене каталога или раздела
  const categories = useMemo(() => getCategories(products ?? [], type), [products, type])

  const changeQuery = () => {
    setQuery('')
    searchRef.current.focus()
  }

  const resetFilters = () => {
    setQuery('')
    setSearchParams({}, { replace: true })
  }

  const header = (
    <div className="products-page__intro">
      <h1 className="products-page__title">Каталог</h1>
      <p className="products-page__subtitle">Билеты на сеансы в CineVibe и всё из кинобара — в одной корзине.</p>
    </div>
  )

  const sidebar = (
    <ProductFilters
      query={query}
      onQueryChange={setQuery}
      type={type}
      // У раздела свои категории: при смене раздела выбранная категория сбрасывается
      onTypeChange={(nextType) => updateParams({ type: nextType, category: ALL })}
      category={category}
      categories={categories}
      onCategoryChange={(nextCategory) => updateParams({ category: nextCategory })}
      sortBy={sortBy}
      onSortChange={(nextSort) => updateParams({ sort: nextSort })}
      onReset={resetFilters}
      searchRef={searchRef}
    />
  )

  let content
  if (error) {
    content = <ErrorMessage message={error} onRetry={refetch} />
  } else if (!loading && visibleProducts.length === 0) {
    content = (
      <EmptyState message="Товары не найдены" hint="Попробуйте другой запрос, раздел или категорию.">
        <Button onClick={changeQuery}>Изменить запрос</Button>
      </EmptyState>
    )
  } else {
    content = (
      <>
        {!loading && <p className="products-page__count">Найдено: {visibleProducts.length}</p>}
        <ProductListWithLoading isLoading={loading} products={visibleProducts} />
      </>
    )
  }

  return (
    <section className="page">
      <Container maxWidth={1320}>
        <Layout header={header} sidebar={sidebar}>
          {content}
        </Layout>
      </Container>
    </section>
  )
}

export default ProductsPage
