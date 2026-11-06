import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import TasksPage from '../../pages/TasksPage.jsx'
import TaskItem from './TaskItem.jsx'

const task = { id: 7, title: 'Посмотреть «Дюну»', isCompleted: false }

async function addTask(user, title) {
  await user.type(screen.getByPlaceholderText('Новая задача…'), title)
  await user.click(screen.getByRole('button', { name: 'Добавить' }))
}

describe('TaskItem', () => {
  it('показывает название задачи', () => {
    render(<TaskItem task={task} onToggle={vi.fn()} onDelete={vi.fn()} />)

    expect(screen.getByText('Посмотреть «Дюну»')).toBeInTheDocument()
  })

  it('задача исчезает из списка после нажатия «Удалить»', async () => {
    const user = userEvent.setup()
    render(<TasksPage />)
    await addTask(user, 'Лишняя задача')

    await user.click(screen.getByRole('button', { name: /удалить/i }))

    expect(screen.queryByText('Лишняя задача')).not.toBeInTheDocument()
    expect(screen.getByText('Задач пока нет')).toBeInTheDocument()
  })

  it('«Удалить» убирает только свою задачу', async () => {
    const user = userEvent.setup()
    render(<TasksPage />)
    await addTask(user, 'Первая')
    await addTask(user, 'Вторая')

    await user.click(screen.getByRole('button', { name: 'Удалить задачу Первая' }))

    expect(screen.queryByText('Первая')).not.toBeInTheDocument()
    expect(screen.getByText('Вторая')).toBeInTheDocument()
  })

  it('чекбокс отмечает задачу выполненной и снимает отметку', async () => {
    const user = userEvent.setup()
    render(<TasksPage />)
    await addTask(user, 'Сделать лабу')
    const checkbox = screen.getByRole('checkbox', { name: 'Сделать лабу' })

    expect(checkbox).not.toBeChecked()

    await user.click(checkbox)
    expect(checkbox).toBeChecked()

    await user.click(checkbox)
    expect(checkbox).not.toBeChecked()
  })

  it('клик по названию тоже отмечает задачу', async () => {
    const user = userEvent.setup()
    render(<TasksPage />)
    await addTask(user, 'Сдать отчёт')

    await user.click(screen.getByText('Сдать отчёт'))

    expect(screen.getByRole('checkbox', { name: 'Сдать отчёт' })).toBeChecked()
  })
})
