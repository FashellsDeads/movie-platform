import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import App from '../../App.jsx'
import { stubApi } from './apiMock.js'

/**
 * Рендерит весь сайт с нужного адреса — как настоящий пользователь, открывший ссылку.
 * В jsdom нет matchMedia (тема системы) и прокрутки, а сеть заменена на public/api.
 * @param {string} [path='/']
 * @param {{ api?: Parameters<typeof stubApi>[0] }} [options]
 */
export function renderApp(path = '/', { api } = {}) {
  vi.stubGlobal('matchMedia', () => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }))
  vi.stubGlobal('scrollTo', vi.fn())
  const fetchMock = stubApi(api)
  const user = userEvent.setup()

  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )

  return { user, fetchMock }
}
