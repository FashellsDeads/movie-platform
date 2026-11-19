import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import EmptyState from '../../components/common/EmptyState/EmptyState.jsx'
import ErrorMessage from '../../components/common/ErrorMessage/ErrorMessage.jsx'
import Loader from '../../components/common/Loader/Loader.jsx'
import Select from '../../components/common/Select/Select.jsx'

describe('Loader', () => {
  it('сообщает о загрузке', () => {
    render(<Loader />)

    expect(screen.getByRole('status')).toHaveTextContent('Загрузка…')
  })

  it('текст можно заменить', () => {
    render(<Loader label="Загружаем афишу…" />)

    expect(screen.getByRole('status')).toHaveTextContent('Загружаем афишу…')
  })
})

describe('EmptyState', () => {
  it('показывает сообщение и необязательные действия', () => {
    render(
      <EmptyState message="Товары не найдены">
        <button>Изменить запрос</button>
      </EmptyState>,
    )

    expect(screen.getByText('Товары не найдены')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Изменить запрос' })).toBeInTheDocument()
  })
})

describe('ErrorMessage', () => {
  it('без onRetry — только текст ошибки', () => {
    render(<ErrorMessage title="Товар не найден" message="Такого товара нет в каталоге." />)

    expect(screen.getByRole('alert')).toHaveTextContent('Товар не найден')
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('с onRetry — кнопка «Повторить»', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()
    render(<ErrorMessage message="Нет сети" onRetry={onRetry} />)

    await user.click(screen.getByRole('button', { name: 'Повторить' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Не удалось загрузить данные')
    expect(onRetry).toHaveBeenCalledTimes(1)
  })
})

describe('Select', () => {
  it('управляемый: показывает value и сообщает выбор строкой', async () => {
    const user = userEvent.setup()
    function City() {
      const [city, setCity] = useState('')
      return (
        <>
          <Select
            label="Город"
            value={city}
            onChange={setCity}
            placeholder="Выберите город"
            options={['Алматы', { value: 'astana', label: 'Астана' }]}
          />
          <p>Выбрано: {city}</p>
        </>
      )
    }
    render(<City />)

    await user.selectOptions(screen.getByLabelText('Город'), 'Астана')

    expect(screen.getByLabelText('Город')).toHaveValue('astana')
    expect(screen.getByText('Выбрано: astana')).toBeInTheDocument()
  })

  it('ошибка под списком', () => {
    render(<Select label="Город" value="" onChange={() => {}} options={['Алматы']} error="Выберите город" />)

    expect(screen.getByRole('alert')).toHaveTextContent('Выберите город')
    expect(screen.getByLabelText('Город')).toHaveAttribute('aria-invalid', 'true')
  })
})
