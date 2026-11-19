import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import Accordion from '../../components/common/Accordion/Accordion.jsx'

function Faq({ multiple = false }) {
  return (
    <Accordion multiple={multiple}>
      <Accordion.Item>
        <Accordion.Title>What is React?</Accordion.Title>
        <Accordion.Content>React is a JavaScript library...</Accordion.Content>
      </Accordion.Item>

      <Accordion.Item>
        <Accordion.Title>What are components?</Accordion.Title>
        <Accordion.Content>Components are reusable UI elements...</Accordion.Content>
      </Accordion.Item>
    </Accordion>
  )
}

const first = () => screen.getByRole('button', { name: 'What is React?' })
const second = () => screen.getByRole('button', { name: 'What are components?' })

describe('Accordion', () => {
  it('обычный режим: открытие второго элемента закрывает первый', async () => {
    const user = userEvent.setup()
    render(<Faq />)

    await user.click(first())
    expect(screen.getByText('React is a JavaScript library...')).toBeInTheDocument()

    await user.click(second())
    expect(screen.getByText('Components are reusable UI elements...')).toBeInTheDocument()
    expect(screen.queryByText('React is a JavaScript library...')).not.toBeInTheDocument()
    expect(first()).toHaveAttribute('aria-expanded', 'false')
  })

  it('режим multiple: открыты оба элемента сразу', async () => {
    const user = userEvent.setup()
    render(<Faq multiple />)

    await user.click(first())
    await user.click(second())

    expect(screen.getByText('React is a JavaScript library...')).toBeInTheDocument()
    expect(screen.getByText('Components are reusable UI elements...')).toBeInTheDocument()
  })

  it('переход из multiple в обычный режим оставляет открытым один элемент', async () => {
    const user = userEvent.setup()
    const { rerender } = render(<Faq multiple />)
    await user.click(first())
    await user.click(second())

    rerender(<Faq />)

    expect(screen.getAllByRole('region')).toHaveLength(1)
    expect(screen.getByText('Components are reusable UI elements...')).toBeInTheDocument()
  })

  it('повторный клик закрывает элемент', async () => {
    const user = userEvent.setup()
    render(<Faq />)

    await user.click(first())
    await user.click(first())

    expect(screen.queryByText('React is a JavaScript library...')).not.toBeInTheDocument()
  })
})
