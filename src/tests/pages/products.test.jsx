import { act, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { catalog, errorResponse, jsonResponse } from '../helpers/apiMock.js'
import { renderApp } from '../helpers/renderApp.jsx'

const PRODUCTS_URL = '/api/products.json'
const cards = () => within(screen.getByTestId('product-list')).getAllByRole('article')
const cardTitles = () => cards().map((card) => within(card).getByRole('heading').textContent)

describe('Каталог /products', () => {
  it('сначала индикатор загрузки (withLoading), затем все товары каталога', async () => {
    let respond
    renderApp('/products', { api: { [PRODUCTS_URL]: () => new Promise((resolve) => (respond = resolve)) } })

    expect(await screen.findByRole('status')).toHaveTextContent('Загружаем каталог…')

    await act(async () => respond(jsonResponse(catalog)))

    expect(cards()).toHaveLength(catalog.length)
    expect(screen.getByText(`Найдено: ${catalog.length}`)).toBeInTheDocument()
  })

  it('поиск с задержкой (debounce) находит товар по названию', async () => {
    const { user } = renderApp('/products')
    await screen.findByTestId('product-list')

    await user.type(screen.getByRole('searchbox'), 'дюна')

    expect(await screen.findByText('Найдено: 1')).toBeInTheDocument()
    expect(cardTitles()).toEqual(['Дюна: Часть вторая'])
  })

  it('ничего не найдено → EmptyState, «Изменить запрос» очищает поиск и ставит в него фокус', async () => {
    const { user } = renderApp('/products')
    await screen.findByTestId('product-list')

    await user.type(screen.getByRole('searchbox'), 'шашлык')
    expect(await screen.findByText('Товары не найдены')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Изменить запрос' }))

    expect(screen.getByRole('searchbox')).toHaveValue('')
    expect(screen.getByRole('searchbox')).toHaveFocus()
    expect(await screen.findByText(`Найдено: ${catalog.length}`)).toBeInTheDocument()
  })

  it('раздел «Кинобар» и сортировка по цене: сначала самое дешёвое', async () => {
    const { user } = renderApp('/products')
    await screen.findByTestId('product-list')

    await user.click(screen.getByRole('button', { name: 'Кинобар' }))
    await user.selectOptions(screen.getByLabelText('Сортировка'), 'price-asc')

    const barItems = catalog.filter((product) => product.type === 'bar')
    expect(cards()).toHaveLength(barItems.length)
    expect(cardTitles()[0]).toBe('Вода без газа 0,5 л')
  })

  it('категория зависит от раздела: в «Билетах» — жанры', async () => {
    const { user } = renderApp('/products')
    await screen.findByTestId('product-list')

    await user.click(screen.getByRole('button', { name: 'Билеты' }))
    await user.selectOptions(screen.getByLabelText('Категория'), 'Анимация')

    expect(cardTitles().sort()).toEqual(['Головоломка 2', 'Унесённые призраками'])
  })

  it('параметры фильтров живут в адресе: ссылкой можно поделиться', async () => {
    renderApp('/products?type=bar&q=попкорн')

    await screen.findByTestId('product-list')

    expect(screen.getByRole('searchbox')).toHaveValue('попкорн')
    // 5 видов попкорна и 2 комбо, в названии которых он есть
    expect(cards()).toHaveLength(7)
    expect(cardTitles().every((title) => title.toLowerCase().includes('попкорн'))).toBe(true)
    expect(screen.getByRole('button', { name: 'Кинобар' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('ошибка сервера → понятное сообщение, «Повторить» загружает снова', async () => {
    let attempt = 0
    const { user } = renderApp('/products', {
      api: { [PRODUCTS_URL]: async () => (++attempt === 1 ? errorResponse(500) : jsonResponse(catalog)) },
    })

    expect(await screen.findByRole('alert')).toHaveTextContent('ошибка 500')

    await user.click(screen.getByRole('button', { name: 'Повторить' }))

    expect(await screen.findByTestId('product-list')).toBeInTheDocument()
    expect(cards()).toHaveLength(catalog.length)
  })

  it('сердечко на карточке добавляет товар в избранное — счётчик в шапке', async () => {
    const { user } = renderApp('/products')
    await screen.findByTestId('product-list')
    const favoritesLink = () => document.querySelector('.header__favorites')

    await user.click(within(cards()[0]).getByRole('button', { name: 'Добавить в избранное' }))

    expect(within(cards()[0]).getByRole('button', { name: 'Убрать из избранного' })).toHaveAttribute('aria-pressed', 'true')
    expect(favoritesLink()).toHaveTextContent('1')
  })
})
