import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Layout from './Layout.jsx'

describe('Layout', () => {
  it('раскладывает header, sidebar, children и footer по своим местам', () => {
    render(
      <Layout header={<p>Шапка</p>} sidebar={<p>Фильтры</p>} footer={<p>Подвал</p>}>
        <p>Основное содержимое</p>
      </Layout>,
    )

    expect(screen.getByRole('banner')).toHaveTextContent('Шапка')
    expect(screen.getByRole('complementary')).toHaveTextContent('Фильтры')
    expect(screen.getByRole('contentinfo')).toHaveTextContent('Подвал')
    expect(screen.getByText('Основное содержимое')).toBeInTheDocument()
  })

  it('без sidebar боковой колонки нет', () => {
    render(<Layout header={<p>Шапка</p>}>Текст</Layout>)

    expect(screen.queryByRole('complementary')).not.toBeInTheDocument()
    expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument()
  })
})
