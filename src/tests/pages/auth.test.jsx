import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderApp } from '../helpers/renderApp.jsx'

// «Сервер» входа отвечает с задержкой 400 мс
const SLOW = { timeout: 3000 }

const field = (name) => screen.getByLabelText(name)
const submit = (form, name) => within(screen.getByRole('form', { name: form })).getByRole('button', { name })
const siteHeader = () => document.querySelector('.header')

async function fillRegistration(user, overrides = {}) {
  const values = {
    name: 'Айгерим Нурланова',
    email: 'aigerim@mail.kz',
    password: 'secret12',
    confirm: 'secret12',
    ...overrides,
  }
  await user.type(field(/^Имя/), values.name)
  await user.type(field(/^Email/), values.email)
  await user.type(field(/^Пароль/), values.password)
  await user.type(field(/^Повторите пароль/), values.confirm)
  await user.selectOptions(field(/^Город/), 'Астана')
  await user.click(screen.getByRole('radio', { name: 'Женский' }))
  await user.click(screen.getByRole('checkbox', { name: /Согласен с правилами/ }))
}

describe('Регистрация', () => {
  it('пустая форма показывает ошибки под полями', async () => {
    const { user } = renderApp('/register')

    await user.click(await screen.findByRole('button', { name: 'Зарегистрироваться' }))

    expect(screen.getAllByText('Обязательное поле').length).toBeGreaterThanOrEqual(5)
  })

  it('пароль короче 6 символов и несовпадающий повтор — понятные ошибки', async () => {
    const { user } = renderApp('/register')
    await screen.findByRole('form', { name: 'Регистрация' })
    await fillRegistration(user, { password: '123', confirm: '1234' })

    await user.click(submit('Регистрация', 'Зарегистрироваться'))

    expect(screen.getByText('Пароль — минимум 6 символов')).toBeInTheDocument()
    expect(screen.getByText('Пароли не совпадают')).toBeInTheDocument()
  })

  it('«Сбросить» очищает форму', async () => {
    const { user } = renderApp('/register')
    await screen.findByRole('form', { name: 'Регистрация' })
    await fillRegistration(user)

    await user.click(submit('Регистрация', 'Сбросить'))

    expect(field(/^Имя/)).toHaveValue('')
    expect(field(/^Город/)).toHaveValue('')
    expect(screen.getByRole('checkbox', { name: /Согласен с правилами/ })).not.toBeChecked()
  })

  it('после регистрации пользователь вошёл: профиль и имя в шапке', async () => {
    const { user } = renderApp('/register')
    await screen.findByRole('form', { name: 'Регистрация' })
    await fillRegistration(user)

    await user.click(submit('Регистрация', 'Зарегистрироваться'))

    expect(await screen.findByRole('heading', { level: 1, name: 'Айгерим Нурланова' }, SLOW)).toBeInTheDocument()
    expect(within(siteHeader()).getByText('Айгерим Нурланова')).toBeInTheDocument()
  })
})

describe('Вход', () => {
  it('пустые поля — «Обязательное поле»', async () => {
    const { user } = renderApp('/login')

    await user.click(within(await screen.findByRole('form', { name: 'Вход' })).getByRole('button', { name: 'Войти' }))

    expect(screen.getAllByText('Обязательное поле')).toHaveLength(2)
  })

  it('неверный пароль — «Неверный email или пароль»', async () => {
    const { user } = renderApp('/login')
    await user.type(await screen.findByLabelText(/^Email/), 'adilzhan@cinevibe.kz')
    await user.type(field(/^Пароль/), 'wrong-pass')

    await user.click(submit('Вход', 'Войти'))

    expect(await screen.findByText('Неверный email или пароль', {}, SLOW)).toBeInTheDocument()
  })

  it('демо-аккаунт входит и попадает в профиль', async () => {
    const { user } = renderApp('/login')
    await user.type(await screen.findByLabelText(/^Email/), 'adilzhan@cinevibe.kz')
    await user.type(field(/^Пароль/), 'cinevibe')

    await user.click(submit('Вход', 'Войти'))

    expect(await screen.findByRole('heading', { level: 1, name: 'Жумагали Адильжан' }, SLOW)).toBeInTheDocument()
  })

  it('без «Запомнить меня» сессия живёт только во вкладке (sessionStorage)', async () => {
    const { user } = renderApp('/login')
    await user.type(await screen.findByLabelText(/^Email/), 'adilzhan@cinevibe.kz')
    await user.type(field(/^Пароль/), 'cinevibe')
    await user.click(submit('Вход', 'Войти'))
    await screen.findByRole('heading', { level: 1, name: 'Жумагали Адильжан' }, SLOW)

    expect(sessionStorage.getItem('cinevibe:session')).toContain('adilzhan@cinevibe.kz')
    expect(localStorage.getItem('cinevibe:session')).toBeNull()
  })

  it('с «Запомнить меня» сессия сохраняется в localStorage', async () => {
    const { user } = renderApp('/login')
    await user.type(await screen.findByLabelText(/^Email/), 'adilzhan@cinevibe.kz')
    await user.type(field(/^Пароль/), 'cinevibe')
    await user.click(screen.getByRole('checkbox', { name: 'Запомнить меня' }))
    await user.click(submit('Вход', 'Войти'))
    await screen.findByRole('heading', { level: 1, name: 'Жумагали Адильжан' }, SLOW)

    expect(localStorage.getItem('cinevibe:session')).toContain('adilzhan@cinevibe.kz')
  })
})

describe('Защищённый профиль', () => {
  it('гость на /profile/orders попадает на вход, а после входа возвращается к заказам', async () => {
    const { user } = renderApp('/profile/orders')

    expect(await screen.findByRole('heading', { level: 1, name: 'Вход в CineVibe' })).toBeInTheDocument()
    await user.type(field(/^Email/), 'adilzhan@cinevibe.kz')
    await user.type(field(/^Пароль/), 'cinevibe')
    await user.click(submit('Вход', 'Войти'))

    expect(await screen.findByText('Заказов пока нет', {}, SLOW)).toBeInTheDocument()
    expect(document.title).toBe('Мои заказы | CineVibe')
  })

  it('«Выйти» завершает сессию: ведёт на главную, в шапке снова «Войти»', async () => {
    sessionStorage.setItem(
      'cinevibe:session',
      JSON.stringify({ user: { name: 'Жумагали Адильжан', email: 'adilzhan@cinevibe.kz', city: 'Алматы' } }),
    )
    const { user } = renderApp('/profile/settings')

    await user.click(await screen.findByRole('button', { name: 'Выйти' }))

    expect(await within(siteHeader()).findByRole('button', { name: 'Войти' })).toBeInTheDocument()
    expect(sessionStorage.getItem('cinevibe:session')).toBeNull()
    expect(screen.queryByRole('heading', { level: 1, name: 'Жумагали Адильжан' })).not.toBeInTheDocument()
  })
})

describe('Настройки профиля', () => {
  it('имя меняется через неуправляемое поле и сразу видно в шапке и кабинете', async () => {
    sessionStorage.setItem(
      'cinevibe:session',
      JSON.stringify({ user: { name: 'Жумагали Адильжан', email: 'adilzhan@cinevibe.kz', city: 'Алматы' } }),
    )
    const { user } = renderApp('/profile/settings')
    const nameInput = await screen.findByLabelText('Имя в профиле')
    expect(nameInput).toHaveValue('Жумагали Адильжан')

    await user.clear(nameInput)
    await user.type(nameInput, 'Адильжан Ж.')
    await user.click(screen.getByRole('button', { name: 'Сохранить' }))

    expect(screen.getByRole('heading', { level: 1, name: 'Адильжан Ж.' })).toBeInTheDocument()
    expect(within(siteHeader()).getByText('Адильжан Ж.')).toBeInTheDocument()
    expect(sessionStorage.getItem('cinevibe:session')).toContain('Адильжан Ж.')
  })

  it('пустое имя не сохраняется', async () => {
    sessionStorage.setItem(
      'cinevibe:session',
      JSON.stringify({ user: { name: 'Жумагали Адильжан', email: 'adilzhan@cinevibe.kz', city: 'Алматы' } }),
    )
    const { user } = renderApp('/profile/settings')
    await user.clear(await screen.findByLabelText('Имя в профиле'))

    await user.click(screen.getByRole('button', { name: 'Сохранить' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Введите имя')
    expect(screen.getByRole('heading', { level: 1, name: 'Жумагали Адильжан' })).toBeInTheDocument()
  })
})
