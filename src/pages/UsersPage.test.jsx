import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { errorResponse, jsonResponse, mockUsers, stubFetch } from '../test/mockUsers.js'
import UsersPage from './UsersPage.jsx'

// Задержка поиска 500 мс: ждём результат чуть дольше, чем ждут по умолчанию
const AFTER_DEBOUNCE = { timeout: 2000 }

function renderPage() {
  render(
    <MemoryRouter>
      <UsersPage />
    </MemoryRouter>,
  )
}

describe('UsersPage', () => {
  let fetchMock

  beforeEach(() => {
    fetchMock = stubFetch()
  })

  it('Loading: показывает «Загрузка...», пока нет ответа', async () => {
    let respond
    fetchMock.mockReturnValue(new Promise((resolve) => (respond = resolve)))
    renderPage()

    expect(screen.getByText('Загрузка...')).toBeInTheDocument()
    expect(screen.queryByText('Leanne Graham')).not.toBeInTheDocument()

    respond(jsonResponse(mockUsers))

    expect(await screen.findByText('Leanne Graham')).toBeInTheDocument()
    expect(screen.queryByText('Загрузка...')).not.toBeInTheDocument()
  })

  it('Success: показывает пользователей со всеми данными карточки', async () => {
    fetchMock.mockResolvedValue(jsonResponse(mockUsers))
    renderPage()

    expect(await screen.findByRole('heading', { name: 'Ervin Howell' })).toBeInTheDocument()
    expect(screen.getByText('Leanne Graham')).toBeInTheDocument()
    expect(screen.getByText('Clementine Bauch')).toBeInTheDocument()
    expect(screen.getByText('@Antonette')).toBeInTheDocument()
    expect(screen.getByText('ervin@melissa.tv')).toBeInTheDocument()
    expect(screen.getByText('010-692-6593')).toBeInTheDocument()
    expect(screen.getAllByText('Deckow-Crist').length).toBeGreaterThan(0)
  })

  it('Error: показывает сообщение, если нет связи с сервером', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'))
    renderPage()

    expect(await screen.findByRole('alert')).toHaveTextContent('Не удалось связаться с сервером')
    expect(screen.queryByText('Загрузка...')).not.toBeInTheDocument()
  })

  it('Error: показывает сообщение, если сервер ответил ошибкой', async () => {
    fetchMock.mockResolvedValue(errorResponse(500))
    renderPage()

    expect(await screen.findByRole('alert')).toHaveTextContent('ошибка 500')
  })

  it('поиск: остаётся только подходящий пользователь, без нового запроса', async () => {
    const user = userEvent.setup()
    fetchMock.mockResolvedValue(jsonResponse(mockUsers))
    renderPage()
    await screen.findByText('Leanne Graham')

    await user.type(screen.getByPlaceholderText('Поиск по имени…'), 'ervin')

    await waitFor(() => expect(screen.queryByText('Leanne Graham')).not.toBeInTheDocument(), AFTER_DEBOUNCE)
    expect(screen.getByText('Ervin Howell')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('поиск срабатывает не сразу, а после паузы в 500 мс', async () => {
    const user = userEvent.setup()
    fetchMock.mockResolvedValue(jsonResponse(mockUsers))
    renderPage()
    await screen.findByText('Leanne Graham')

    await user.type(screen.getByPlaceholderText('Поиск по имени…'), 'ervin')

    // Текст уже в поле, но список пока прежний
    expect(screen.getByText('Leanne Graham')).toBeInTheDocument()
  })

  it('«Пользователи не найдены» и «Очистить поиск» возвращает всех', async () => {
    const user = userEvent.setup()
    fetchMock.mockResolvedValue(jsonResponse(mockUsers))
    renderPage()
    await screen.findByText('Leanne Graham')
    const input = screen.getByPlaceholderText('Поиск по имени…')

    await user.type(input, 'нет такого')
    expect(await screen.findByText('Пользователи не найдены', {}, AFTER_DEBOUNCE)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Очистить поиск' }))

    expect(input).toHaveValue('')
    expect(screen.getByText('Leanne Graham')).toBeInTheDocument()
    expect(screen.getByText('Ervin Howell')).toBeInTheDocument()
  })

  it('фильтр по компании через select', async () => {
    const user = userEvent.setup()
    fetchMock.mockResolvedValue(jsonResponse(mockUsers))
    renderPage()
    await screen.findByText('Leanne Graham')

    await user.selectOptions(screen.getByRole('combobox', { name: 'Компания' }), 'Deckow-Crist')

    expect(screen.getByText('Ervin Howell')).toBeInTheDocument()
    expect(screen.queryByText('Leanne Graham')).not.toBeInTheDocument()
  })

  it('«Повторить запрос» после ошибки загружает пользователей', async () => {
    const user = userEvent.setup()
    fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch'))
    fetchMock.mockResolvedValueOnce(jsonResponse(mockUsers))
    renderPage()
    await screen.findByRole('alert')

    await user.click(screen.getByRole('button', { name: 'Повторить запрос' }))

    expect(await screen.findByText('Leanne Graham')).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('«Повторить запрос» при успешной загрузке тоже делает новый запрос', async () => {
    const user = userEvent.setup()
    let respond
    fetchMock.mockResolvedValueOnce(jsonResponse(mockUsers))
    fetchMock.mockReturnValueOnce(new Promise((resolve) => (respond = resolve)))
    renderPage()
    await screen.findByText('Leanne Graham')

    await user.click(screen.getByRole('button', { name: 'Повторить запрос' }))

    expect(screen.getByText('Загрузка...')).toBeInTheDocument()
    expect(screen.queryByText('Leanne Graham')).not.toBeInTheDocument()

    respond(jsonResponse(mockUsers))

    expect(await screen.findByText('Leanne Graham')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})
