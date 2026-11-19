import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderApp } from './helpers/renderApp.jsx'

const logIn = () =>
  sessionStorage.setItem(
    'cinevibe:session',
    JSON.stringify({ user: { name: 'Жумагали Адильжан', email: 'adilzhan@cinevibe.kz', city: 'Алматы' } }),
  )

describe('Маршрутизация', () => {
  it.each([
    ['/', 'Кино на большом экране — билеты и попкорн в одной корзине'],
    ['/products', 'Каталог'],
    ['/products/1', 'Дюна: Часть вторая'],
    ['/favorites', 'Избранное'],
    ['/cart', 'Корзина'],
    ['/about', 'О кинотеатре CineVibe'],
    ['/login', 'Вход в CineVibe'],
    ['/register', 'Регистрация в CineVibe'],
  ])('%s открывается со своим заголовком', async (path, heading) => {
    renderApp(path)

    expect(await screen.findByRole('heading', { level: 1, name: heading })).toBeInTheDocument()
  })

  it.each(['/abc/def', '/404', '/products/1/extra'])('%s — страница 404', async (path) => {
    renderApp(path)

    expect(await screen.findByRole('heading', { level: 1, name: 'Такой страницы нет' })).toBeInTheDocument()
  })

  it.each(['/profile', '/profile/orders', '/profile/settings'])('%s без входа ведёт на вход', async (path) => {
    renderApp(path)

    expect(await screen.findByRole('heading', { level: 1, name: 'Вход в CineVibe' })).toBeInTheDocument()
  })

  it.each([
    ['/profile', 'Обзор', 'в корзине ждут оформления'],
    ['/profile/orders', 'Мои заказы', 'Заказов пока нет'],
    ['/profile/settings', 'Настройки', 'Тема оформления'],
  ])('%s после входа открывается внутри кабинета (Outlet)', async (path, tab, text) => {
    logIn()
    renderApp(path)

    expect(await screen.findByRole('heading', { level: 1, name: 'Жумагали Адильжан' })).toBeInTheDocument()
    const tabs = screen.getByRole('navigation', { name: 'Разделы личного кабинета' })
    expect(within(tabs).getByRole('link', { name: tab })).toHaveClass('profile-tabs__link--active')
    expect(screen.getByText(text)).toBeInTheDocument()
  })

  it.each([
    ['/movies', 'Каталог'],
    ['/catalog', 'Каталог'],
    ['/movie/2', 'Интерстеллар'],
    ['/tickets', 'Корзина'],
  ])('старый адрес %s ведёт на новый', async (path, heading) => {
    renderApp(path)

    expect(await screen.findByRole('heading', { level: 1, name: heading })).toBeInTheDocument()
  })

  it('/bar открывает каталог в разделе «Кинобар»', async () => {
    renderApp('/bar')

    expect(await screen.findByRole('button', { name: 'Кинобар' })).toHaveAttribute('aria-pressed', 'true')
  })
})
