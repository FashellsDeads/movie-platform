// Сценарии из финальной проверки ДЗ №14: чужие заказы, испорченное хранилище, лимиты корзины,
// поиск, который следит за адресом, окно удаления, контакты в подвале.
import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderApp } from '../helpers/renderApp.jsx'

const logIn = (email = 'adilzhan@cinevibe.kz', name = 'Жумагали Адильжан') =>
  sessionStorage.setItem('cinevibe:session', JSON.stringify({ user: { name, email, city: 'Алматы' } }))

const order = (id, email) => ({
  id,
  date: '2026-11-20',
  email,
  items: [{ id: 1, type: 'movie', title: 'Дюна: Часть вторая', price: 2500, imageUrl: 'd.svg', quantity: 1 }],
  totalCount: 1,
  discountPercent: 0,
  totalPrice: 2500,
})

describe('Заказы видит только их владелец', () => {
  it('«Мои заказы» показывают заказы только вошедшего аккаунта', async () => {
    localStorage.setItem(
      'cinevibe:orders',
      JSON.stringify([order('CV-0002', 'aigerim@mail.kz'), order('CV-0001', 'adilzhan@cinevibe.kz')]),
    )
    logIn()
    renderApp('/profile/orders')

    expect(await screen.findByText('CV-0001')).toBeInTheDocument()
    expect(screen.queryByText('CV-0002')).not.toBeInTheDocument()
    expect(screen.queryByText(/aigerim@mail\.kz/)).not.toBeInTheDocument()
  })

  it('счётчик заказов в обзоре кабинета — только свои', async () => {
    localStorage.setItem(
      'cinevibe:orders',
      JSON.stringify([order('CV-0002', 'aigerim@mail.kz'), order('CV-0001', 'adilzhan@cinevibe.kz')]),
    )
    logIn()
    renderApp('/profile')

    const tile = (await screen.findByText('оформленных заказов')).closest('a')
    expect(tile).toHaveTextContent('1')
  })
})

describe('Испорченное хранилище не ломает сайт', () => {
  it('мусор в сохранённых заказах отбрасывается, страница заказов открывается', async () => {
    localStorage.setItem('cinevibe:orders', JSON.stringify([null, { id: 'x' }, order('CV-0001', 'adilzhan@cinevibe.kz')]))
    logIn()
    renderApp('/profile/orders')

    expect(await screen.findByText('CV-0001')).toBeInTheDocument()
    expect(screen.queryByText('Что-то пошло не так')).not.toBeInTheDocument()
  })

  it('сохранённая корзина с количеством выше лимита обрезается до 10 билетов', async () => {
    localStorage.setItem(
      'cinevibe:tickets',
      JSON.stringify([{ id: 1, type: 'movie', title: 'Дюна: Часть вторая', price: 2500, imageUrl: 'd.svg', quantity: 50 }]),
    )
    renderApp('/cart')

    expect(await screen.findByLabelText('Количество: 10')).toBeInTheDocument()
  })
})

describe('Уведомление о корзине говорит правду', () => {
  it('у лимита — сколько добавлено на самом деле', async () => {
    localStorage.setItem(
      'cinevibe:tickets',
      JSON.stringify([{ id: 2, type: 'movie', title: 'Интерстеллар', price: 2500, imageUrl: 'i.svg', quantity: 9 }]),
    )
    const { user } = renderApp('/products/2')
    await screen.findByRole('heading', { level: 1, name: 'Интерстеллар' })

    await user.click(screen.getByRole('button', { name: 'Увеличить количество' }))
    await user.click(screen.getByRole('button', { name: 'В корзину' }))

    expect(await screen.findByText('«Интерстеллар»: добавлено 1 шт. — больше 10 шт. в одном заказе нельзя')).toBeInTheDocument()
  })

  it('если места уже нет — так и сказано', async () => {
    localStorage.setItem(
      'cinevibe:tickets',
      JSON.stringify([{ id: 2, type: 'movie', title: 'Интерстеллар', price: 2500, imageUrl: 'i.svg', quantity: 10 }]),
    )
    const { user } = renderApp('/products/2')
    await screen.findByRole('heading', { level: 1, name: 'Интерстеллар' })

    await user.click(screen.getByRole('button', { name: 'В корзину' }))

    expect(await screen.findByText('«Интерстеллар»: в корзине уже 10 шт. — это максимум')).toBeInTheDocument()
  })
})

describe('Ничего не выглядит учебным заданием', () => {
  it('каталог грузится с русским индикатором загрузки', async () => {
    renderApp('/products', { api: { '/api/products.json': () => new Promise(() => {}) } })

    expect(await screen.findByRole('status')).toHaveTextContent('Загружаем каталог…')
  })

  it('на странице «О кинотеатре» нет демонстрационного переключателя режимов', async () => {
    renderApp('/about')
    await screen.findByRole('heading', { level: 1, name: 'О кинотеатре CineVibe' })

    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
  })
})

describe('Поиск в каталоге следует за адресом', () => {
  it('клик «Каталог» в шапке сбрасывает поиск', async () => {
    const { user } = renderApp('/products?q=дюна')
    await screen.findByText('Найдено: 1')

    await user.click(within(document.querySelector('.header')).getByRole('link', { name: 'Каталог' }))

    expect(screen.getByRole('searchbox')).toHaveValue('')
    expect(await screen.findByText('Найдено: 33')).toBeInTheDocument()
  })
})

describe('Окно удаления из корзины', () => {
  it('названо вопросом, фокус переходит в окно и возвращается к кнопке после «Отмена»', async () => {
    localStorage.setItem(
      'cinevibe:tickets',
      JSON.stringify([{ id: 2, type: 'movie', title: 'Интерстеллар', price: 2500, imageUrl: 'i.svg', quantity: 1 }]),
    )
    const { user } = renderApp('/cart')
    const removeButton = await screen.findByRole('button', { name: 'Удалить «Интерстеллар»' })

    await user.click(removeButton)

    const dialog = screen.getByRole('dialog', { name: 'Удалить «Интерстеллар» из корзины?' })
    expect(within(dialog).getByRole('button', { name: 'Отмена' })).toHaveFocus()

    await user.click(within(dialog).getByRole('button', { name: 'Отмена' }))
    expect(removeButton).toHaveFocus()
  })
})

describe('Подвал', () => {
  it('содержит контакты кинотеатра', async () => {
    renderApp('/')

    const footer = document.querySelector('.footer')
    expect(within(footer).getByRole('link', { name: '+7 (727) 355-00-55' })).toHaveAttribute('href', 'tel:+77273550055')
    expect(footer).toHaveTextContent('Алматы, пр. Абая, 52')
  })
})
