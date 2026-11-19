import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import withLoading from './withLoading.jsx'

function MovieList({ title, movies }) {
  return (
    <section>
      <h2>{title}</h2>
      <ul>
        {movies.map((movie) => (
          <li key={movie}>{movie}</li>
        ))}
      </ul>
    </section>
  )
}

describe('withLoading', () => {
  it('пока isLoading, показывает «Loading...»', () => {
    const MovieListWithLoading = withLoading(MovieList)
    render(<MovieListWithLoading isLoading title="Афиша" movies={['Дюна']} />)

    expect(screen.getByRole('status')).toHaveTextContent('Loading...')
    expect(screen.queryByText('Афиша')).not.toBeInTheDocument()
  })

  it('после загрузки исходный компонент получает все свои props', () => {
    const MovieListWithLoading = withLoading(MovieList)
    render(<MovieListWithLoading isLoading={false} title="Афиша" movies={['Дюна', 'Интерстеллар']} />)

    expect(screen.getByRole('heading', { name: 'Афиша' })).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('isLoading не уходит в исходный компонент', () => {
    const Inner = vi.fn(() => null)
    const Wrapped = withLoading(Inner)
    render(<Wrapped isLoading={false} title="Афиша" />)

    expect(Inner.mock.calls[0][0]).toEqual({ title: 'Афиша' })
  })

  it('displayName подсказывает, кого обернули', () => {
    expect(withLoading(MovieList).displayName).toBe('withLoading(MovieList)')
  })
})
