import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import FormProvider from '../../components/forms/FormProvider/FormProvider.jsx'
import { useForm } from '../../components/forms/FormProvider/useForm.js'
import DynamicField from '../../components/forms/DynamicField/DynamicField.jsx'

const make = (type, extra = {}) => ({ id: type, name: type, label: `Поле ${type}`, type, required: false, ...extra })

function renderField(field) {
  render(
    <FormProvider initialFields={[field]}>
      <DynamicField field={field} />
      <Values />
    </FormProvider>,
  )
}

function Values() {
  const { values } = useForm()
  return <output data-testid="values">{JSON.stringify(values)}</output>
}

describe('DynamicField — сам выбирает элемент по типу поля', () => {
  it.each(['text', 'email'])('%s → текстовое поле нужного типа', (type) => {
    renderField(make(type))

    expect(screen.getByRole('textbox', { name: `Поле ${type}` })).toHaveAttribute('type', type)
  })

  it('number → поле с цифровой клавиатурой, введённый текст не теряется', async () => {
    const user = userEvent.setup()
    renderField(make('number'))
    const input = screen.getByRole('textbox', { name: 'Поле number' })

    expect(input).toHaveAttribute('inputmode', 'decimal')
    // type="number" отдал бы пустую строку вместо «2x», и проверка «Введите число» не сработала бы
    await user.type(input, '2x')
    expect(screen.getByTestId('values')).toHaveTextContent('"number":"2x"')
  })

  it('password → поле пароля', () => {
    renderField(make('password'))

    expect(screen.getByLabelText('Поле password')).toHaveAttribute('type', 'password')
  })

  it('select → выпадающий список с вариантами', async () => {
    const user = userEvent.setup()
    renderField(make('select', { options: ['Алматы', 'Астана'] }))

    await user.selectOptions(screen.getByRole('combobox', { name: 'Поле select' }), 'Астана')

    expect(screen.getByTestId('values')).toHaveTextContent('"select":"Астана"')
  })

  it('checkbox → значение true/false', async () => {
    const user = userEvent.setup()
    renderField(make('checkbox'))

    await user.click(screen.getByRole('checkbox', { name: 'Поле checkbox' }))

    expect(screen.getByTestId('values')).toHaveTextContent('"checkbox":true')
  })

  it('radio → группа вариантов с подписью', async () => {
    const user = userEvent.setup()
    renderField(
      make('radio', {
        options: [
          { value: 'male', label: 'Мужской' },
          { value: 'female', label: 'Женский' },
        ],
      }),
    )

    expect(screen.getByRole('group', { name: 'Поле radio' })).toBeInTheDocument()
    await user.click(screen.getByRole('radio', { name: 'Женский' }))
    expect(screen.getByTestId('values')).toHaveTextContent('"radio":"female"')
  })

  it('обязательное поле помечено звёздочкой', () => {
    renderField(make('text', { required: true }))

    expect(screen.getByText('*')).toBeInTheDocument()
  })
})
