import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import TasksPage from '../../pages/TasksPage.jsx'
import TaskForm from './TaskForm.jsx'

const getInput = () => screen.getByPlaceholderText('Новая задача…')
const getAddButton = () => screen.getByRole('button', { name: 'Добавить' })

describe('TaskForm', () => {
  it('показывает поле ввода', () => {
    render(<TaskForm onAdd={vi.fn()} />)

    expect(getInput()).toBeInTheDocument()
  })

  it('показывает кнопку «Добавить»', () => {
    render(<TaskForm onAdd={vi.fn()} />)

    expect(getAddButton()).toBeInTheDocument()
  })

  it('новая задача появляется в списке после ввода и клика', async () => {
    const user = userEvent.setup()
    render(<TasksPage />)

    await user.type(getInput(), 'Купить попкорн')
    await user.click(getAddButton())

    expect(screen.getByText('Купить попкорн')).toBeInTheDocument()
    expect(screen.queryByText('Задач пока нет')).not.toBeInTheDocument()
  })

  it('добавляет задачу клавишей Enter', async () => {
    const user = userEvent.setup()
    render(<TasksPage />)

    await user.type(getInput(), 'Выбрать фильм{Enter}')

    expect(screen.getByText('Выбрать фильм')).toBeInTheDocument()
  })

  it('не добавляет пустую задачу и показывает ошибку', async () => {
    const user = userEvent.setup()
    render(<TasksPage />)

    await user.click(getAddButton())

    expect(screen.getByRole('alert')).toHaveTextContent('Введите название задачи')
    expect(screen.getByText('Задач пока нет')).toBeInTheDocument()
  })

  it('не добавляет задачу только из пробелов', async () => {
    const user = userEvent.setup()
    render(<TasksPage />)

    await user.type(getInput(), '   ')
    await user.click(getAddButton())

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText('Задач пока нет')).toBeInTheDocument()
  })

  it('убирает ошибку, когда пользователь снова начинает ввод', async () => {
    const user = userEvent.setup()
    render(<TaskForm onAdd={vi.fn()} />)

    await user.click(getAddButton())
    await user.type(getInput(), 'К')

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('очищает поле после успешного добавления', async () => {
    const user = userEvent.setup()
    render(<TasksPage />)

    await user.type(getInput(), 'Купить билеты')
    await user.click(getAddButton())

    expect(getInput()).toHaveValue('')
  })
})
