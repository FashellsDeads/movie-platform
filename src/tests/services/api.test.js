import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DEMO_ACCOUNT, getJson, login, productUrl, productsUrl, register } from '../../services/api.js'

const newAccount = {
  name: 'Айгерим Нурланова',
  email: 'aigerim@mail.kz',
  password: 'secret12',
  city: 'Астана',
  gender: 'female',
}

describe('адреса API', () => {
  it('каталог и товар лежат в /api', () => {
    expect(productsUrl()).toBe('/api/products.json')
    expect(productUrl(101)).toBe('/api/products/101.json')
  })
})

describe('getJson', () => {
  const stub = (response) => vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response))

  it('возвращает JSON ответа', async () => {
    stub({ ok: true, status: 200, headers: new Headers({ 'content-type': 'application/json' }), json: async () => [1] })

    await expect(getJson('/api/products.json')).resolves.toEqual([1])
  })

  it('404 → понятное сообщение', async () => {
    stub({ ok: false, status: 404, headers: new Headers(), json: async () => ({}) })

    await expect(getJson('/api/products/999.json')).rejects.toThrow('Такие данные не найдены (ошибка 404).')
  })

  it('вместо JSON пришла HTML-страница (dev-сервер) → тоже «не найдено»', async () => {
    stub({ ok: true, status: 200, headers: new Headers({ 'content-type': 'text/html' }), json: async () => ({}) })

    await expect(getJson('/api/products/abc.json')).rejects.toThrow('Такие данные не найдены (ошибка 404).')
  })

  it('сеть недоступна → просьба проверить интернет', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))

    await expect(getJson('/api/products.json')).rejects.toThrow('Не удалось связаться с сервером')
  })
})

describe('учётные записи', () => {
  beforeEach(() => localStorage.clear())

  it('register сохраняет аккаунт, но не пароль открытым текстом', async () => {
    const user = await register(newAccount)

    expect(user).toEqual({ name: 'Айгерим Нурланова', email: 'aigerim@mail.kz', city: 'Астана' })
    expect(localStorage.getItem('cinevibe:accounts')).not.toContain('secret12')
  })

  it('тот же email в другом регистре и с пробелами — уже зарегистрирован', async () => {
    await register(newAccount)

    await expect(register({ ...newAccount, email: '  Aigerim@MAIL.kz ' })).rejects.toThrow(
      'Такой email уже зарегистрирован',
    )
  })

  it('email демо-аккаунта занят', async () => {
    await expect(register({ ...newAccount, email: DEMO_ACCOUNT.email })).rejects.toThrow(
      'Такой email уже зарегистрирован',
    )
  })

  it('login: правильная пара → пользователь с именем из регистрации', async () => {
    await register(newAccount)

    await expect(login({ email: 'AIGERIM@mail.kz', password: 'secret12' })).resolves.toEqual({
      name: 'Айгерим Нурланова',
      email: 'aigerim@mail.kz',
      city: 'Астана',
    })
  })

  it('login: неверный пароль или неизвестный email', async () => {
    await register(newAccount)

    await expect(login({ email: 'aigerim@mail.kz', password: 'wrong-pass' })).rejects.toThrow('Неверный email или пароль')
    await expect(login({ email: 'nobody@mail.kz', password: 'secret12' })).rejects.toThrow('Неверный email или пароль')
  })

  it('демо-аккаунт входит без регистрации', async () => {
    const user = await login({ email: DEMO_ACCOUNT.email, password: DEMO_ACCOUNT.password })

    expect(user.name).toBe('Жумагали Адильжан')
  })

  it('битые данные аккаунтов в localStorage не мешают регистрации', async () => {
    localStorage.setItem('cinevibe:accounts', '{not json')

    await expect(register(newAccount)).resolves.toMatchObject({ email: 'aigerim@mail.kz' })
  })
})
