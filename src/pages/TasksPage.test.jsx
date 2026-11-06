import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import App from '../App.jsx'
import TasksPage from './TasksPage.jsx'

describe('Task Manager', () => {
  it('показывает «Задач пока нет», когда список пустой', () => {
    render(<TasksPage />)

    expect(screen.getByText('Задач пока нет')).toBeInTheDocument()
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
  })

  it('полный сценарий: добавление → выполнение → фильтрация → удаление', async () => {
    const user = userEvent.setup()
    render(<TasksPage />)

    // Добавляет задачу и видит её в списке
    await user.type(screen.getByPlaceholderText('Новая задача…'), 'Learn React Testing')
    await user.click(screen.getByRole('button', { name: 'Добавить' }))
    expect(screen.getByText('Learn React Testing')).toBeInTheDocument()

    // Отмечает выполненной и переходит в Completed
    await user.click(screen.getByRole('checkbox', { name: 'Learn React Testing' }))
    await user.click(screen.getByRole('button', { name: 'Completed' }))
    expect(screen.getByText('Learn React Testing')).toBeInTheDocument()

    // Удаляет — задача исчезла
    await user.click(screen.getByRole('button', { name: /удалить/i }))
    expect(screen.queryByText('Learn React Testing')).not.toBeInTheDocument()

    // В All список снова пуст
    await user.click(screen.getByRole('button', { name: 'All' }))
    expect(screen.getByText('Задач пока нет')).toBeInTheDocument()
  })

  it('открывается на сайте по адресу /tasks', async () => {
    // В jsdom нет matchMedia (тема системы в ThemeProvider) и настоящей прокрутки страницы
    vi.stubGlobal('matchMedia', () => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }))
    vi.stubGlobal('scrollTo', vi.fn())

    render(
      <MemoryRouter initialEntries={['/tasks']}>
        <App />
      </MemoryRouter>,
    )

    expect(await screen.findByRole('heading', { name: 'Задачи' })).toBeInTheDocument()
    expect(document.title).toBe('Задачи | CineVibe')
  })
})
