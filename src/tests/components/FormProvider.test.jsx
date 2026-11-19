import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import DynamicField from '../../components/forms/DynamicField/DynamicField.jsx'
import FormProvider from '../../components/forms/FormProvider/FormProvider.jsx'
import { useForm } from '../../components/forms/FormProvider/useForm.js'

const nameField = { id: 'name', name: 'name', label: 'Имя', type: 'text', required: true }

// Потребитель контекста: показывает состояние и даёт кнопки действий
function Inspector() {
  const { fields, values, errors, updateValue, resetForm, validate } = useForm()
  return (
    <>
      {fields.map((field) => (
        <DynamicField key={field.id} field={field} />
      ))}
      <output data-testid="values">{JSON.stringify(values)}</output>
      <output data-testid="errors">{JSON.stringify(errors)}</output>
      <p>Полей: {fields.length}</p>
      <button onClick={() => updateValue('name', 'Ерлан')}>Заполнить имя</button>
      <button onClick={() => validate()}>Проверить</button>
      <button onClick={resetForm}>Сбросить</button>
    </>
  )
}

// Поле «Имя» плюс доп. правило, которого нет в описании полей
function ExtraInspector() {
  const { fields, validate } = useForm()
  return (
    <>
      {fields.map((field) => (
        <DynamicField key={field.id} field={field} />
      ))}
      <button onClick={() => validate({ name: 'Пароли не совпадают' })}>Проверить пароль</button>
    </>
  )
}

describe('FormProvider', () => {
  it('ввод в DynamicField меняет values в контексте', async () => {
    const user = userEvent.setup()
    render(
      <FormProvider initialFields={[nameField]}>
        <Inspector />
      </FormProvider>,
    )

    await user.type(screen.getByLabelText(/Имя/), 'Адильжан')

    expect(screen.getByTestId('values')).toHaveTextContent('{"name":"Адильжан"}')
  })

  it('validate пишет ошибки, ввод убирает ошибку поля', async () => {
    const user = userEvent.setup()
    render(
      <FormProvider initialFields={[nameField]}>
        <Inspector />
      </FormProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'Проверить' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Обязательное поле')

    await user.type(screen.getByLabelText(/Имя/), 'А')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('resetForm возвращает начальные значения и убирает ошибки', async () => {
    const user = userEvent.setup()
    render(
      <FormProvider initialFields={[nameField]}>
        <Inspector />
      </FormProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'Проверить' }))
    await user.click(screen.getByRole('button', { name: 'Заполнить имя' }))
    expect(screen.getByTestId('values')).toHaveTextContent('{"name":"Ерлан"}')

    await user.click(screen.getByRole('button', { name: 'Сбросить' }))

    expect(screen.getByTestId('values')).toHaveTextContent('{"name":""}')
    expect(screen.getByTestId('errors')).toHaveTextContent('{}')
  })
  it('validate: пустые строки в дополнительных проверках не считаются ошибками', async () => {
    const user = userEvent.setup()
    let result
    function ExtraCheck() {
      const { validate } = useForm()
      return <button onClick={() => (result = validate({ name: '' }))}>Проверить с доп. правилом</button>
    }
    render(
      <FormProvider initialFields={[nameField]} initialValues={{ name: 'Адильжан' }}>
        <ExtraCheck />
      </FormProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'Проверить с доп. правилом' }))

    expect(result).toBe(true)
  })

  it('validate: непустая дополнительная ошибка побеждает', async () => {
    const user = userEvent.setup()
    render(
      <FormProvider initialFields={[nameField]} initialValues={{ name: 'Адильжан' }}>
        <ExtraInspector />
      </FormProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'Проверить пароль' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Пароли не совпадают')
  })

  it('useForm вне FormProvider сообщает об ошибке', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<Inspector />)).toThrow('useForm используется вне <FormProvider>')
    consoleError.mockRestore()
  })
})
