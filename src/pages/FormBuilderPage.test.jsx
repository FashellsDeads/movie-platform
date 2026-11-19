import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../App.jsx'

function renderPage() {
  render(
    <MemoryRouter initialEntries={['/form-builder']}>
      <App />
    </MemoryRouter>,
  )
  return userEvent.setup()
}

const structure = () => JSON.parse(screen.getByTestId('form-structure').textContent)
const editors = () => screen.getAllByRole('group', { name: /^Поле / })

describe('FormBuilderPage /form-builder', () => {
  beforeEach(() => {
    vi.stubGlobal('matchMedia', () => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }))
    vi.stubGlobal('scrollTo', vi.fn())
  })

  it('открывается по адресу со стартовыми полями анкеты', async () => {
    renderPage()

    expect(await screen.findByRole('heading', { level: 1, name: 'Конструктор форм' })).toBeInTheDocument()
    expect(document.title).toBe('Конструктор форм | CineVibe')
    expect(structure().map((field) => field.label)).toEqual(['Имя', 'Email', 'Количество гостей', 'Город'])
  })

  it('добавить поле, изменить название, тип и обязательность, удалить', async () => {
    const user = renderPage()

    await user.click(await screen.findByRole('button', { name: 'Добавить поле' }))
    const editor = editors().at(-1)
    const label = within(editor).getByLabelText('Название')
    await user.clear(label)
    await user.type(label, 'Телефон')
    await user.selectOptions(within(editor).getByLabelText('Тип'), 'number')
    await user.click(within(editor).getByRole('checkbox', { name: 'Обязательное' }))

    expect(structure().at(-1)).toMatchObject({ label: 'Телефон', type: 'number', required: true })

    await user.click(within(editor).getByRole('button', { name: 'Удалить поле «Телефон»' }))
    expect(structure()).toHaveLength(4)
  })

  it('Preview: ошибки валидации, затем Submit показывает объект значений', async () => {
    const user = renderPage()

    await user.click(await screen.findByRole('button', { name: 'Preview' }))
    await user.click(screen.getByRole('button', { name: 'Submit' }))
    expect(screen.getAllByText('Обязательное поле')).toHaveLength(2)

    await user.type(screen.getByLabelText(/^Имя/), 'Адильжан')
    await user.type(screen.getByLabelText(/^Email/), 'adilzhan')
    await user.type(screen.getByLabelText(/^Количество гостей/), '2x')
    await user.click(screen.getByRole('button', { name: 'Submit' }))
    expect(screen.getByText('Введите корректный email')).toBeInTheDocument()
    expect(screen.getByText('Введите число')).toBeInTheDocument()

    await user.type(screen.getByLabelText(/^Email/), '@cinevibe.kz')
    await user.clear(screen.getByLabelText(/^Количество гостей/))
    await user.type(screen.getByLabelText(/^Количество гостей/), '2')
    await user.selectOptions(screen.getByLabelText(/^Город/), 'Астана')
    await user.click(screen.getByRole('button', { name: 'Submit' }))

    const result = JSON.parse(screen.getByTestId('submit-result').textContent)
    expect(result).toEqual({ Имя: 'Адильжан', Email: 'adilzhan@cinevibe.kz', 'Количество гостей': '2', Город: 'Астана' })
  })

  it('Undo и Redo в интерфейсе', async () => {
    const user = renderPage()

    expect(await screen.findByRole('button', { name: 'Undo' })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: 'Добавить поле' }))
    expect(structure()).toHaveLength(5)

    await user.click(screen.getByRole('button', { name: 'Undo' }))
    expect(structure()).toHaveLength(4)

    await user.click(screen.getByRole('button', { name: 'Redo' }))
    expect(structure()).toHaveLength(5)
  })

  it('внешний reducer «Ограничить 6 полями» меняет поведение формы', async () => {
    const user = renderPage()

    await user.click(await screen.findByRole('checkbox', { name: 'Ограничить 6 полями' }))
    for (let i = 0; i < 3; i += 1) {
      await user.click(screen.getByRole('button', { name: 'Добавить поле' }))
    }

    expect(structure()).toHaveLength(6)
    expect(screen.getByText('Достигнут лимит: 6 полей')).toBeInTheDocument()
  })

  it('Focus search и Get value из секции «Компоненты ввода»', async () => {
    const user = renderPage()

    await user.click(await screen.findByRole('button', { name: 'Focus search' }))
    expect(screen.getByRole('searchbox')).toHaveFocus()

    await user.type(screen.getByLabelText('Промокод'), 'CINEVIBE10')
    await user.click(screen.getByRole('button', { name: 'Get value' }))
    expect(screen.getByText('Значение: CINEVIBE10')).toBeInTheDocument()
  })
})
