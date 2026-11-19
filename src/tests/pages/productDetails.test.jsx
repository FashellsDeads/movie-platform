import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderApp } from '../helpers/renderApp.jsx'

const cartLink = () => document.querySelector('.header a[href="/cart"]')

describe('Страница товара /products/:id', () => {
  it('клик по товару в каталоге открывает его страницу, «Назад» возвращает в каталог', async () => {
    const { user } = renderApp('/products')

    await user.click(await screen.findByRole('link', { name: 'Дюна: Часть вторая' }))

    expect(await screen.findByRole('heading', { level: 1, name: 'Дюна: Часть вторая' })).toBeInTheDocument()
    expect(document.title).toBe('Дюна: Часть вторая | CineVibe')

    await user.click(screen.getByRole('button', { name: /Назад/ }))

    expect(await screen.findByRole('heading', { level: 1, name: 'Каталог' })).toBeInTheDocument()
  })

  it('у фильма вкладки: описание, сеансы, отзывы', async () => {
    const { user } = renderApp('/products/1')
    await screen.findByRole('heading', { level: 1, name: 'Дюна: Часть вторая' })

    expect(screen.getByRole('tabpanel')).toHaveTextContent('Пол Атрейдес')

    await user.click(screen.getByRole('tab', { name: 'Сеансы' }))
    expect(screen.getByRole('tabpanel')).toHaveTextContent('19:30')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('CineVibe Hall')

    await user.click(screen.getByRole('tab', { name: /Отзывы/ }))
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Ерлан Сапаров')
  })

  it('выбранное количество билетов попадает в корзину', async () => {
    const { user } = renderApp('/products/2')
    await screen.findByRole('heading', { level: 1, name: 'Интерстеллар' })

    await user.click(screen.getByRole('button', { name: 'Увеличить количество' }))
    await user.click(screen.getByRole('button', { name: 'В корзину' }))

    expect(cartLink()).toHaveTextContent('2')
  })

  it('товар кинобара — без вкладок, добавляется в ту же корзину', async () => {
    const { user } = renderApp('/products/101')
    await screen.findByRole('heading', { level: 1, name: 'Попкорн солёный S' })

    expect(screen.queryByRole('tablist')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'В корзину' }))

    expect(cartLink()).toHaveTextContent('1')
  })

  it('фильм, который ещё не в прокате, купить нельзя', async () => {
    renderApp('/products/9')
    await screen.findByRole('heading', { level: 1, name: 'Проект «Конец света»' })

    expect(screen.getByText(/Продажа билетов откроется/)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'В корзину' })).not.toBeInTheDocument()
  })

  it.each(['/products/999', '/products/abc'])('%s → «Товар не найден» и ссылка в каталог', async (path) => {
    renderApp(path)

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('Товар не найден')
    expect(within(alert).getByRole('link', { name: 'Открыть каталог' })).toHaveAttribute('href', '/products')
    expect(within(alert).queryByRole('button', { name: 'Повторить' })).not.toBeInTheDocument()
  })

  it('отзыв вошедшего зрителя сохраняется у фильма', async () => {
    sessionStorage.setItem(
      'cinevibe:session',
      JSON.stringify({ user: { name: 'Жумагали Адильжан', email: 'adilzhan@cinevibe.kz', city: 'Алматы' } }),
    )
    const { user } = renderApp('/products/3')
    await screen.findByRole('heading', { level: 1, name: 'Оппенгеймер' })
    await user.click(screen.getByRole('tab', { name: /Отзывы/ }))

    await user.type(screen.getByRole('textbox'), 'Смотрел в VIP-зале — мощно!')
    await user.click(screen.getByRole('button', { name: /Опубликовать/ }))

    expect(screen.getByRole('tabpanel')).toHaveTextContent('Смотрел в VIP-зале — мощно!')
    expect(localStorage.getItem('cinevibe:reviews')).toContain('Смотрел в VIP-зале')
  })
})
