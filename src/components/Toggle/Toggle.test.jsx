import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import Toggle from './Toggle.jsx'

describe('Toggle', () => {
  it('кнопка показывает и прячет содержимое', async () => {
    const user = userEvent.setup()
    render(
      <Toggle>
        <Toggle.Button />
        <Toggle.Content>Additional information</Toggle.Content>
      </Toggle>,
    )

    expect(screen.queryByText('Additional information')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Показать' }))
    expect(screen.getByText('Additional information')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Скрыть' })).toHaveAttribute('aria-expanded', 'true')

    await user.click(screen.getByRole('button', { name: 'Скрыть' }))
    expect(screen.queryByText('Additional information')).not.toBeInTheDocument()
  })

  it('текст кнопки можно заменить через children', () => {
    render(
      <Toggle>
        <Toggle.Button>Есть промокод?</Toggle.Button>
        <Toggle.Content>Поле</Toggle.Content>
      </Toggle>,
    )

    expect(screen.getByRole('button', { name: 'Есть промокод?' })).toHaveAttribute('aria-expanded', 'false')
  })
})
