import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import DataLoader from './DataLoader.jsx'

// Внешний компонент сам решает, как показать каждое состояние
const renderMovies = (data, loading, error, reload) => {
  if (loading) return <p>Загрузка</p>
  if (error) return <p role="alert">{error}</p>
  return (
    <>
      <ul>
        {data.map((title) => (
          <li key={title}>{title}</li>
        ))}
      </ul>
      <button onClick={reload}>Обновить</button>
    </>
  )
}

describe('DataLoader', () => {
  it('сначала loading, затем данные', async () => {
    let resolve
    const loadData = () => new Promise((r) => (resolve = r))
    render(<DataLoader loadData={loadData}>{renderMovies}</DataLoader>)

    expect(screen.getByText('Загрузка')).toBeInTheDocument()

    await act(async () => resolve(['Дюна']))

    expect(screen.getByText('Дюна')).toBeInTheDocument()
    expect(screen.queryByText('Загрузка')).not.toBeInTheDocument()
  })

  it('ошибка загрузки попадает в render prop', async () => {
    const loadData = () => Promise.reject(new Error('Нет сети'))
    render(<DataLoader loadData={loadData}>{renderMovies}</DataLoader>)

    expect(await screen.findByRole('alert')).toHaveTextContent('Нет сети')
  })

  it('reload загружает данные заново и передаёт AbortSignal', async () => {
    const user = userEvent.setup()
    const loadData = vi.fn().mockResolvedValueOnce(['Дюна']).mockResolvedValueOnce(['Интерстеллар'])
    render(<DataLoader loadData={loadData}>{renderMovies}</DataLoader>)
    await screen.findByText('Дюна')

    await user.click(screen.getByRole('button', { name: 'Обновить' }))

    expect(await screen.findByText('Интерстеллар')).toBeInTheDocument()
    expect(loadData).toHaveBeenCalledTimes(2)
    expect(loadData.mock.calls[0][0]).toBeInstanceOf(AbortSignal)
  })
})
