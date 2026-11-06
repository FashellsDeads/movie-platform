import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import TasksPage from '../../pages/TasksPage.jsx'

const titles = ['Купить билеты', 'Выбрать места', 'Взять попкорн']
const filterButton = (name) => screen.getByRole('button', { name })

// Показанные на странице задачи: у каждой есть свой чекбокс
const visibleTasks = () => screen.getAllByRole('checkbox').map((box) => box.closest('label').textContent)

describe('TaskFilter', () => {
  let user

  // Три задачи, «Выбрать места» выполнена
  beforeEach(async () => {
    user = userEvent.setup()
    render(<TasksPage />)
    for (const title of titles) {
      await user.type(screen.getByPlaceholderText('Новая задача…'), title)
      await user.click(screen.getByRole('button', { name: 'Добавить' }))
    }
    await user.click(screen.getByRole('checkbox', { name: 'Выбрать места' }))
  })

  it('All показывает все задачи', async () => {
    await user.click(filterButton('Completed'))
    await user.click(filterButton('All'))

    expect(visibleTasks()).toEqual(titles)
    expect(filterButton('All')).toHaveAttribute('aria-pressed', 'true')
  })

  it('Active показывает только невыполненные', async () => {
    await user.click(filterButton('Active'))

    expect(visibleTasks()).toEqual(['Купить билеты', 'Взять попкорн'])
    expect(screen.queryByText('Выбрать места')).not.toBeInTheDocument()
  })

  it('Completed показывает только выполненные', async () => {
    await user.click(filterButton('Completed'))

    expect(visibleTasks()).toEqual(['Выбрать места'])
  })

  it('задача уходит из Active, как только её отметили', async () => {
    await user.click(filterButton('Active'))
    await user.click(screen.getByRole('checkbox', { name: 'Купить билеты' }))

    expect(visibleTasks()).toEqual(['Взять попкорн'])
  })

  it('пустой фильтр при непустом списке говорит об этом отдельно', async () => {
    await user.click(filterButton('Active'))
    await user.click(screen.getByRole('checkbox', { name: 'Купить билеты' }))
    await user.click(screen.getByRole('checkbox', { name: 'Взять попкорн' }))

    expect(screen.getByText('В этом фильтре задач нет')).toBeInTheDocument()
    expect(screen.queryByText('Задач пока нет')).not.toBeInTheDocument()
  })
})
