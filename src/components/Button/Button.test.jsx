import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import Button from './Button.jsx'

describe('Button', () => {
  it('рендерит children', () => {
    render(<Button>Купить</Button>)

    expect(screen.getByRole('button', { name: 'Купить' })).toBeInTheDocument()
  })

  it('вариант danger даёт класс button--danger', () => {
    render(<Button variant="danger">Удалить</Button>)

    expect(screen.getByRole('button', { name: 'Удалить' })).toHaveClass('button', 'button--danger')
  })

  it('disabled не вызывает onClick', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Button disabled onClick={onClick}>
        X
      </Button>,
    )

    const button = screen.getByRole('button', { name: 'X' })
    await user.click(button)

    expect(button).toBeDisabled()
    expect(onClick).not.toHaveBeenCalled()
  })

  it('пробрасывает aria-label', () => {
    render(<Button aria-label="Закрыть окно">×</Button>)

    expect(screen.getByRole('button', { name: 'Закрыть окно' })).toBeInTheDocument()
  })
})
