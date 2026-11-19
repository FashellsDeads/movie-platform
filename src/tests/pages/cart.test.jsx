import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderApp } from '../helpers/renderApp.jsx'

const dune = { id: 1, type: 'movie', title: 'Дюна: Часть вторая', price: 2500, imageUrl: 'd.svg', quantity: 2 }
const popcorn = { id: 101, type: 'bar', title: 'Попкорн солёный S', price: 990, imageUrl: 'p.svg', quantity: 1 }

const putInCart = (...items) => localStorage.setItem('cinevibe:tickets', JSON.stringify(items))
const logIn = () =>
  sessionStorage.setItem(
    'cinevibe:session',
    JSON.stringify({ user: { name: 'Жумагали Адильжан', email: 'adilzhan@cinevibe.kz', city: 'Алматы' } }),
  )
const summary = () => screen.getByRole('region', { name: 'Итог заказа' })

describe('Корзина /cart', () => {
  it('добавление из каталога: счётчик в шапке, товар и сумма в корзине', async () => {
    const { user } = renderApp('/products')
    const card = (await screen.findByRole('link', { name: 'Интерстеллар' })).closest('article')

    await user.click(within(card).getByRole('button', { name: /Билет/ }))
    expect(document.querySelector('.header a[href="/cart"]')).toHaveTextContent('1')

    await user.click(document.querySelector('.header a[href="/cart"]'))

    expect(await screen.findByRole('heading', { level: 1, name: 'Корзина' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Интерстеллар' })).toBeInTheDocument()
    expect(summary()).toHaveTextContent('2 500 ₸')
  })

  it('удаление через подтверждение: «Отмена» оставляет товар, «Удалить» убирает', async () => {
    putInCart(dune, popcorn)
    const { user } = renderApp('/cart')

    await user.click(await screen.findByRole('button', { name: 'Удалить «Попкорн солёный S»' }))
    expect(screen.getByRole('dialog')).toHaveTextContent('Удалить «Попкорн солёный S» из корзины?')
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Отмена' }))
    expect(screen.getByRole('link', { name: 'Попкорн солёный S' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Удалить «Попкорн солёный S»' }))
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Удалить' }))

    expect(screen.queryByRole('link', { name: 'Попкорн солёный S' })).not.toBeInTheDocument()
    expect(summary()).toHaveTextContent('5 000 ₸')
  })

  it('последний товар удалён → «Корзина пуста»', async () => {
    putInCart(popcorn)
    const { user } = renderApp('/cart')

    await user.click(await screen.findByRole('button', { name: 'Удалить «Попкорн солёный S»' }))
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Удалить' }))

    expect(screen.getByText('Корзина пуста')).toBeInTheDocument()
  })

  it('изменение количества пересчитывает сумму', async () => {
    putInCart(dune)
    const { user } = renderApp('/cart')

    await user.click(await screen.findByRole('button', { name: 'Больше: Дюна: Часть вторая' }))

    expect(summary()).toHaveTextContent('7 500 ₸')
  })

  it('промокод CINEVIBE10 даёт скидку 10%, неверный — сообщение и фокус в поле', async () => {
    putInCart(dune)
    const { user } = renderApp('/cart')

    await user.click(await screen.findByRole('button', { name: 'Есть промокод?' }))
    const input = screen.getByLabelText('Промокод')
    await user.type(input, 'КИНО')
    await user.click(screen.getByRole('button', { name: 'Применить' }))
    expect(screen.getByText('Промокод не найден')).toBeInTheDocument()
    expect(input).toHaveFocus()

    await user.click(screen.getByRole('button', { name: 'Очистить' }))
    await user.type(input, 'cinevibe10')
    await user.click(screen.getByRole('button', { name: 'Применить' }))

    expect(screen.getByText('Скидка 10% применена')).toBeInTheDocument()
    expect(within(summary()).getByText('К оплате').nextElementSibling).toHaveTextContent('4 500 ₸')
  })

  it('гость видит ссылку на вход вместо оформления', async () => {
    putInCart(dune)
    renderApp('/cart')

    expect(await screen.findByRole('link', { name: 'Войдите, чтобы оформить заказ' })).toHaveAttribute('href', '/login')
  })

  it('оформление: подтверждение в окне, заказ появляется в «Моих заказах»', async () => {
    putInCart(dune, popcorn)
    logIn()
    const { user } = renderApp('/cart')

    await user.click(await screen.findByRole('button', { name: 'Оформить заказ' }))
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Подтвердить' }))

    // Номер заказа есть и в уведомлении, и в списке заказов — проверяем сам список на странице
    expect(await within(document.querySelector('main')).findByText('CV-0001')).toBeInTheDocument()
    expect(document.title).toBe('Мои заказы | CineVibe')
    expect(document.querySelector('.header a[href="/cart"]')).toHaveTextContent('0')
  })
})
