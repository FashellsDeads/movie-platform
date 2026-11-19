import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Card from '../../components/common/Card/Card.jsx'

describe('Card', () => {
  it('не знает про содержимое: показывает любые children', () => {
    render(
      <Card>
        <h2>Product</h2>
        <p>Description</p>
      </Card>,
    )

    expect(screen.getByRole('heading', { name: 'Product' })).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
  })

  it('title и size задаются через props', () => {
    render(
      <Card title="Product" size="large">
        x
      </Card>,
    )

    expect(screen.getByRole('heading', { name: 'Product' })).toBeInTheDocument()
    expect(screen.getByRole('article')).toHaveClass('ui-card', 'ui-card--large')
  })
})
