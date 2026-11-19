import { useEffect, useRef, useState } from 'react'
import { fetchMovies } from '../api/cinemaApi.js'
import Accordion from '../components/Accordion/Accordion.jsx'
import Button from '../components/Button/Button.jsx'
import Card from '../components/Card/Card.jsx'
import Container from '../components/Container/Container.jsx'
import DataLoader from '../components/DataLoader/DataLoader.jsx'
import Layout from '../components/Layout/Layout.jsx'
import Modal from '../components/Modal/Modal.jsx'
import Tabs from '../components/Tabs/Tabs.jsx'
import Toggle from '../components/Toggle/Toggle.jsx'
import withLoading from '../components/withLoading/withLoading.jsx'
import { ALL_CATEGORY } from '../data/movies.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import './PatternsPage.css'

const sections = [
  { id: 'card', label: 'Card' },
  { id: 'button', label: 'Button' },
  { id: 'modal', label: 'Modal' },
  { id: 'layout', label: 'Layout' },
  { id: 'tabs', label: 'Tabs' },
  { id: 'toggle', label: 'Toggle' },
  { id: 'accordion', label: 'Accordion' },
  { id: 'data-loader', label: 'DataLoader' },
  { id: 'with-loading', label: 'withLoading' },
]

const faq = [
  {
    question: 'Можно ли вернуть билет?',
    answer: 'Да, до начала сеанса — в кассе или в личном кабинете. Деньги вернутся на карту в течение 3 дней.',
  },
  {
    question: 'Есть ли парковка?',
    answer: 'Бесплатная парковка у ТРЦ на пр. Абая, 52 — первые 3 часа по билету в кино.',
  },
  {
    question: 'С какого возраста пускают детей?',
    answer: 'На фильмы 0+ и 6+ — с любого возраста со взрослым, на 16+ и 18+ — только по документу.',
  },
]

// Функция загрузки объявлена вне компонента: ссылка на неё не меняется,
// поэтому DataLoader не перезапускает загрузку при каждом рендере страницы.
const loadTopMovies = (signal) =>
  fetchMovies({ category: ALL_CATEGORY, query: '', sortBy: 'rating-desc', page: 1, perPage: 4 }, signal).then(
    (result) => result.items,
  )

/**
 * Простой список фильмов — ничего не знает о загрузке.
 * @param {{ title: string, movies: Array<{ id: number, title: string, year: number }> }} props
 */
function MovieList({ title, movies }) {
  return (
    <div>
      <h3 className="patterns__list-title">{title}</h3>
      <ul className="patterns__list">
        {movies.map((movie) => (
          <li key={movie.id}>
            {movie.title} <span className="patterns__muted">({movie.year})</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// HOC применяется один раз на уровне модуля, а не внутри рендера —
// иначе React каждый раз видел бы «новый» компонент и пересоздавал его.
const MovieListWithLoading = withLoading(MovieList)

const premiereMovies = [
  { id: 1, title: 'Дюна: Часть вторая', year: 2024 },
  { id: 2, title: 'Интерстеллар', year: 2014 },
  { id: 3, title: 'Начало', year: 2010 },
]

/**
 * Страница «/patterns» (ДЗ №12) — все паттерны из задания на данных кинотеатра.
 * Сама страница собрана на Layout: в header — заголовок, в sidebar — оглавление.
 */
function PatternsPage() {
  useDocumentTitle('UI-паттерны')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalResult, setModalResult] = useState('')
  const [isFaqMultiple, setIsFaqMultiple] = useState(false)
  const [isListLoading, setIsListLoading] = useState(false)
  const loadingTimerRef = useRef(null)

  // таймер «загрузки» не должен сработать после ухода со страницы
  useEffect(() => () => clearTimeout(loadingTimerRef.current), [])

  const closeModal = () => setIsModalOpen(false)

  const confirmDelete = () => {
    setModalResult('Билет удалён из корзины')
    closeModal()
  }

  const simulateLoading = () => {
    setIsListLoading(true)
    clearTimeout(loadingTimerRef.current)
    loadingTimerRef.current = setTimeout(() => setIsListLoading(false), 1000)
  }

  const header = (
    <div className="patterns__intro">
      <h1 className="patterns__title">UI-паттерны</h1>
      <p className="patterns__subtitle">
        Переиспользуемые компоненты CineVibe: композиция через children, Compound Components, Render Props и HOC.
      </p>
    </div>
  )

  const sidebar = (
    <nav className="patterns__toc" aria-label="Оглавление">
      <ul>
        {sections.map((section) => (
          <li key={section.id}>
            <a href={`#${section.id}`}>{section.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  )

  const footer = <p className="patterns__muted">Каждый компонент не знает, на какой странице он используется.</p>

  return (
    <section className="page patterns">
      <Container maxWidth={1200}>
        <Layout header={header} sidebar={sidebar} footer={footer}>
          <section id="card" className="patterns__section">
            <h2>Card — содержимое через children</h2>
            <div className="patterns__cards">
              <Card title="Дюна: Часть вторая" size="small">
                <p>Фантастика · 2 ч 46 мин · 2 500 ₸</p>
              </Card>
              <Card title="Зал CineVibe Hall">
                <ul className="patterns__list">
                  <li>180 кресел-реклайнеров</li>
                  <li>Dolby Atmos</li>
                </ul>
              </Card>
              <Card title="Кинобар" size="large">
                <p>Попкорн, напитки и комбо — прямо к сеансу.</p>
                <Button variant="secondary">Открыть меню</Button>
              </Card>
            </div>
          </section>

          <section id="button" className="patterns__section">
            <h2>Button — варианты</h2>
            <div className="patterns__row">
              <Button>Купить билет</Button>
              <Button variant="secondary">В избранное</Button>
              <Button variant="danger">Удалить</Button>
              <Button variant="outline">Подробнее</Button>
              <Button disabled>Мест нет</Button>
            </div>
          </section>

          <section id="modal" className="patterns__section">
            <h2>Modal — любое содержимое</h2>
            <div className="patterns__row">
              <Button variant="danger" onClick={() => setIsModalOpen(true)}>
                Удалить билет
              </Button>
              {modalResult && <p role="status">{modalResult}</p>}
            </div>
            <Modal isOpen={isModalOpen} onClose={closeModal}>
              <h2 className="patterns__modal-title">Удалить билет из корзины?</h2>
              <p>Билет на «Дюну» в 19:30 вернётся в продажу.</p>
              <div className="patterns__row">
                <Button variant="secondary" onClick={closeModal}>
                  Отмена
                </Button>
                <Button variant="danger" onClick={confirmDelete}>
                  Удалить
                </Button>
              </div>
            </Modal>
          </section>

          <section id="layout" className="patterns__section">
            <h2>Layout — header, sidebar, children, footer</h2>
            <p className="patterns__muted">Эта страница сама собрана на Layout. Тот же компонент в миниатюре:</p>
            <div className="patterns__mini-layout">
              <Layout
                header={<div className="patterns__slot">header</div>}
                sidebar={<div className="patterns__slot">sidebar</div>}
                footer={<div className="patterns__slot">footer</div>}
              >
                <div className="patterns__slot patterns__slot--main">children</div>
              </Layout>
            </div>
          </section>

          <section id="tabs" className="patterns__section">
            <h2>Tabs — Compound Component</h2>
            <Card>
              <Tabs>
                <Tabs.List>
                  <Tabs.Tab>Описание</Tabs.Tab>
                  <Tabs.Tab>Сеансы</Tabs.Tab>
                  <Tabs.Tab>Отзывы</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel>
                  «Интерстеллар» — исследователи отправляются сквозь червоточину в поисках нового дома для человечества.
                </Tabs.Panel>
                <Tabs.Panel>Сегодня: 11:00, 15:30, 19:30, 22:10 — зал CineVibe Hall.</Tabs.Panel>
                <Tabs.Panel>Айгерим: «Пересматриваю каждый год, на большом экране — совсем другое кино».</Tabs.Panel>
              </Tabs>
            </Card>
          </section>

          <section id="toggle" className="patterns__section">
            <h2>Toggle — показать и скрыть</h2>
            <Card>
              <Toggle>
                <Toggle.Button>Подробнее о зале</Toggle.Button>
                <Toggle.Content>
                  Экран 18 метров, лазерная проекция 4K и звук Dolby Atmos. Между рядами — 1,2 метра.
                </Toggle.Content>
              </Toggle>
            </Card>
          </section>

          <section id="accordion" className="patterns__section">
            <h2>Accordion — частые вопросы</h2>
            <label className="patterns__checkbox">
              <input
                type="checkbox"
                checked={isFaqMultiple}
                onChange={(event) => setIsFaqMultiple(event.target.checked)}
              />
              Открывать несколько ответов
            </label>
            <Accordion multiple={isFaqMultiple}>
              {faq.map((item) => (
                <Accordion.Item key={item.question}>
                  <Accordion.Title>{item.question}</Accordion.Title>
                  <Accordion.Content>{item.answer}</Accordion.Content>
                </Accordion.Item>
              ))}
            </Accordion>
          </section>

          <section id="data-loader" className="patterns__section">
            <h2>DataLoader — Render Props</h2>
            <Card>
              <DataLoader loadData={loadTopMovies}>
                {(movies, loading, error, reload) => {
                  if (loading) return <p role="status">Загружаем афишу…</p>
                  if (error) {
                    return (
                      <div role="alert">
                        <p>{error}</p>
                        <Button onClick={reload}>Повторить</Button>
                      </div>
                    )
                  }
                  return (
                    <>
                      <MovieList title="Лучшие по оценкам зрителей" movies={movies} />
                      <Button variant="secondary" onClick={reload}>
                        Перезагрузить
                      </Button>
                    </>
                  )
                }}
              </DataLoader>
            </Card>
          </section>

          <section id="with-loading" className="patterns__section">
            <h2>withLoading — Higher-Order Component</h2>
            <Card>
              <MovieListWithLoading isLoading={isListLoading} title="Премьеры недели" movies={premiereMovies} />
              <Button variant="secondary" disabled={isListLoading} onClick={simulateLoading}>
                Загрузить заново
              </Button>
            </Card>
          </section>
        </Layout>
      </Container>
    </section>
  )
}

export default PatternsPage
