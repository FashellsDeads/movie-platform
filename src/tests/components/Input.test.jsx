import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import Input from '../../components/common/Input/Input.jsx'

describe('Input', () => {
  it('controlled: показывает value родителя и сообщает новое значение строкой', async () => {
    const user = userEvent.setup()
    const onChangeSpy = vi.fn()

    function Parent() {
      const [name, setName] = useState('')
      const handleChange = (value) => {
        onChangeSpy(value)
        setName(value)
      }
      return (
        <>
          <Input label="Имя" value={name} onChange={handleChange} />
          <p>Привет, {name}</p>
        </>
      )
    }

    render(<Parent />)
    await user.type(screen.getByLabelText('Имя'), 'Адильжан')

    expect(onChangeSpy).toHaveBeenLastCalledWith('Адильжан')
    expect(screen.getByLabelText('Имя')).toHaveValue('Адильжан')
    expect(screen.getByText('Привет, Адильжан')).toBeInTheDocument()
  })

  it('controlled: без setState поле не меняется — значение задаёт родитель', async () => {
    const user = userEvent.setup()
    render(<Input label="Город" value="Алматы" onChange={() => {}} />)

    await user.type(screen.getByLabelText('Город'), 'x')

    expect(screen.getByLabelText('Город')).toHaveValue('Алматы')
  })

  it('uncontrolled: начинает с defaultValue и меняется без родителя', async () => {
    const user = userEvent.setup()
    render(<Input label="Имя" defaultValue="John" />)
    const input = screen.getByLabelText('Имя')

    expect(input).toHaveValue('John')
    await user.clear(input)
    await user.type(input, 'Айгерим')
    expect(input).toHaveValue('Айгерим')
  })

  it('ошибка показывается и помечает поле', () => {
    render(<Input label="Email" value="" onChange={() => {}} error="Введите корректный email" />)

    expect(screen.getByRole('alert')).toHaveTextContent('Введите корректный email')
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true')
  })
})
