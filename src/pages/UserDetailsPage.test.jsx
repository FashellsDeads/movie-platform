import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { errorResponse, jsonResponse, mockUsers, stubFetch } from '../test/mockUsers.js'
import UserDetailsPage from './UserDetailsPage.jsx'

const posts = [{ id: 11, title: 'Первый пост', body: 'Текст первого поста' }]

function renderPage(id) {
  render(
    <MemoryRouter initialEntries={[`/users/${id}`]}>
      <Routes>
        <Route path="users" element={<p>Список пользователей</p>} />
        <Route path="users/:id" element={<UserDetailsPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('UserDetailsPage', () => {
  let fetchMock

  beforeEach(() => {
    fetchMock = stubFetch()
  })

  // Ответ зависит от адреса: так видно, что страница запросила нужные URL
  const respondByUrl = (url) => Promise.resolve(jsonResponse(url.endsWith('/posts') ? posts : mockUsers[1]))

  it('берёт id из адреса и показывает пользователя и его посты', async () => {
    fetchMock.mockImplementation(respondByUrl)
    renderPage(2)

    expect(await screen.findByRole('heading', { name: 'Ervin Howell' })).toBeInTheDocument()
    expect(await screen.findByText('Первый пост')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/users/2', expect.anything())
    expect(fetchMock).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/users/2/posts', expect.anything())
  })

  it('несуществующий пользователь: понятная ошибка вместо страницы', async () => {
    fetchMock.mockResolvedValue(errorResponse(404))
    renderPage(999)

    expect(await screen.findByRole('alert')).toHaveTextContent('ошибка 404')
  })

  it('кнопка «Назад» возвращает к списку', async () => {
    const user = userEvent.setup()
    fetchMock.mockImplementation(respondByUrl)
    renderPage(2)
    await screen.findByRole('heading', { name: 'Ervin Howell' })

    await user.click(screen.getByRole('button', { name: /назад/i }))

    expect(screen.getByText('Список пользователей')).toBeInTheDocument()
  })
})
