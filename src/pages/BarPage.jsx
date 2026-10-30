import { Profiler, useCallback, useMemo, useState } from 'react'
import Container from '../components/Container/Container.jsx'
import Counter from '../components/Counter/Counter.jsx'
import ProductList from '../components/ProductList/ProductList.jsx'
import ProductStats from '../components/ProductStats/ProductStats.jsx'
import SearchBar from '../components/SearchBar/SearchBar.jsx'
import SectionHeader from '../components/SectionHeader/SectionHeader.jsx'
import SortDropdown from '../components/SortDropdown/SortDropdown.jsx'
import { ALL_BAR_CATEGORIES, barCategories, barProducts, barSortOptions } from '../data/barProducts.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { formatNumber, pluralize } from '../utils/format.js'
import { calculateBestDeal, filterProducts, generateProducts } from '../utils/products.js'
import './BarPage.css'

const BIG_LIST_SIZE = 1000
const categoryOptions = barCategories.map((category) => ({ value: category, label: category }))

// React Profiler (встроен в React): сколько миллисекунд занял рендер списка
const logListRender = (id, phase, actualDuration) => {
  console.log(`[Profiler] ${id} (${phase}): ${actualDuration.toFixed(1)} мс`)
}

/**
 * Страница «/bar» — кинобар. ДЗ №9: каталог товаров, на котором видно, что делают
 * React.memo, useMemo и useCallback. Переключатель «Оптимизация» включает и выключает
 * все три приёма сразу — сравнивайте сообщения в консоли до и после.
 */
function BarPage() {
  useDocumentTitle('Кинобар')
  console.log('BarPage render')

  const [isOptimized, setIsOptimized] = useState(true)
  const [isBigList, setIsBigList] = useState(false)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState(ALL_BAR_CATEGORIES)
  const [sortBy, setSortBy] = useState(barSortOptions[0].value)
  const [guests, setGuests] = useState(2)
  const [cart, setCart] = useState({})

  // Доп. задание: 1000 товаров. useMemo — чтобы массив не создавался заново на каждый рендер
  const products = useMemo(() => (isBigList ? generateProducts(BIG_LIST_SIZE) : barProducts), [isBigList])

  // --- useMemo: отфильтрованный список ---
  // Пересчитывается, только когда меняются товары, поиск, категория или сортировка.
  // Нажатие на счётчик гостей его не трогает — и ссылка на массив остаётся прежней.
  const memoizedProducts = useMemo(
    () => (isOptimized ? filterProducts(products, { query, category, sortBy }) : null),
    [isOptimized, products, query, category, sortBy],
  )
  // без оптимизации — новый массив на каждый рендер страницы
  const filteredProducts = isOptimized ? memoizedProducts : filterProducts(products, { query, category, sortBy })

  // --- useMemo: тяжёлое вычисление ---
  const memoizedBestDeal = useMemo(
    () => (isOptimized ? calculateBestDeal(filteredProducts) : null),
    [isOptimized, filteredProducts],
  )
  const bestDeal = isOptimized ? memoizedBestDeal : calculateBestDeal(filteredProducts)

  // --- useCallback: функция добавления в корзину ---
  // Одна и та же функция между рендерами: функциональное обновление (prev) не требует зависимостей.
  const memoizedAddToCart = useCallback((product) => {
    setCart((prev) => ({
      ...prev,
      [product.id]: {
        name: product.name,
        price: product.price,
        quantity: (prev[product.id]?.quantity ?? 0) + 1,
      },
    }))
  }, [])
  // без оптимизации — новая функция на каждый рендер, и React.memo у карточек бы не помог
  const addToCart = isOptimized ? memoizedAddToCart : (product) => memoizedAddToCart(product)

  const cartItems = Object.values(cart)
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const resetFilters = () => {
    setQuery('')
    setCategory(ALL_BAR_CATEGORIES)
  }

  return (
    <section className="page">
      <Container>
        <SectionHeader
          title="Кинобар"
          subtitle="Попкорн, напитки и мерч — заберите заказ на стойке перед сеансом."
          align="left"
        />

        <div className="bar-lab" role="group" aria-label="Режим проверки ДЗ №9">
          <p className="bar-lab__title">Проверка оптимизации (ДЗ №9)</p>
          <label className="bar-lab__switch">
            <input type="checkbox" checked={isOptimized} onChange={(event) => setIsOptimized(event.target.checked)} />
            React.memo + useMemo + useCallback
          </label>
          <label className="bar-lab__switch">
            <input type="checkbox" checked={isBigList} onChange={(event) => setIsBigList(event.target.checked)} />
            {BIG_LIST_SIZE} товаров
          </label>
          <p className="bar-lab__hint">
            Откройте консоль (F12) и нажмите «+» у счётчика гостей: с оптимизацией карточки не перерисовываются.
          </p>
        </div>

        <div className="bar-toolbar">
          <SearchBar value={query} onChange={setQuery} placeholder="Поиск по меню…" label="Поиск по меню кинобара" />
          <SortDropdown options={categoryOptions} value={category} onChange={setCategory} label="Категория" />
          <SortDropdown options={barSortOptions} value={sortBy} onChange={setSortBy} />
        </div>

        <div className="bar-summary">
          <ProductStats products={filteredProducts} />

          <div className="bar-panel">
            <Counter
              label="Сколько вас в кино?"
              value={guests}
              onDecrement={() => setGuests((prev) => prev - 1)}
              onIncrement={() => setGuests((prev) => prev + 1)}
            />
            <p className="bar-panel__text">
              На {guests} {pluralize(guests, ['гостя', 'гостей', 'гостей'])} хватит {Math.ceil(guests / 2)}{' '}
              {pluralize(Math.ceil(guests / 2), ['большого попкорна', 'больших попкорнов', 'больших попкорнов'])}.
            </p>
            {bestDeal && (
              <p className="bar-panel__text">
                Выгоднее всего сейчас: <strong>{bestDeal.name}</strong> — {formatNumber(bestDeal.price)} ₸, ★{' '}
                {bestDeal.rating.toFixed(1)}
              </p>
            )}
          </div>

          <div className="bar-panel bar-panel--cart" aria-live="polite">
            <p className="bar-panel__title">Ваш заказ</p>
            {cartCount > 0 ? (
              <>
                <p className="bar-panel__total">
                  {cartCount} {pluralize(cartCount, ['позиция', 'позиции', 'позиций'])} · {formatNumber(cartTotal)} ₸
                </p>
                <button type="button" className="text-link bar-panel__clear" onClick={() => setCart({})}>
                  Очистить заказ
                </button>
              </>
            ) : (
              <p className="bar-panel__text">Пока пусто — добавьте что-нибудь из меню.</p>
            )}
          </div>
        </div>

        <Profiler id="ProductList" onRender={logListRender}>
          <ProductList
            products={filteredProducts}
            cart={cart}
            onAddToCart={addToCart}
            isOptimized={isOptimized}
            onReset={resetFilters}
          />
        </Profiler>
      </Container>
    </section>
  )
}

export default BarPage
