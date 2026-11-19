import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../App.jsx'

function renderPatterns() {
  render(
    <MemoryRouter initialEntries={['/patterns']}>
      <App />
    </MemoryRouter>,
  )
}

describe('PatternsPage /patterns', () => {
  beforeEach(() => {
    // В jsdom нет matchMedia (тема системы) и настоящей прокрутки страницы
    vi.stubGlobal('matchMedia', () => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }))
    vi.stubGlobal('scrollTo', vi.fn())
  })

  it('открывается по адресу и ставит заголовок вкладки', async () => {
    renderPatterns()

    expect(await screen.findByRole('heading', { level: 1, name: 'UI-паттерны' })).toBeInTheDocument()
    expect(document.title).toBe('UI-паттерны | CineVibe')
  })

  it('Modal: «Удалить билет» открывает окно, «Отмена» закрывает', async () => {
    const user = userEvent.setup()
    renderPatterns()

    await user.click(await screen.findByRole('button', { name: 'Удалить билет' }))
    expect(screen.getByRole('dialog')).toHaveTextContent('Удалить билет из корзины?')

    await user.click(screen.getByRole('button', { name: 'Отмена' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('ссылка на страницу есть в подвале, в разделе для разработчиков', async () => {
    renderPatterns()

    const devNav = await screen.findByRole('navigation', { name: 'Для разработчиков' })
    expect(devNav).toContainElement(screen.getByRole('link', { name: 'UI-паттерны' }))
  })
})
