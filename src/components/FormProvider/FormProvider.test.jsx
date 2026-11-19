import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import DynamicField from '../DynamicField/DynamicField.jsx'
import { FORM_ACTIONS } from './formReducer.js'
import FormProvider from './FormProvider.jsx'
import { useForm } from './useForm.js'

const nameField = { id: 'name', name: 'name', label: 'Имя', type: 'text', required: true }

// Потребитель контекста: показывает состояние и даёт кнопки действий
function Inspector() {
  const { fields, values, errors, addField, resetForm, validate, undo, canUndo } = useForm()
  return (
    <>
      {fields.map((field) => (
        <DynamicField key={field.id} field={field} />
      ))}
      <output data-testid="values">{JSON.stringify(values)}</output>
      <output data-testid="errors">{JSON.stringify(errors)}</output>
      <p>Полей: {fields.length}</p>
      <button onClick={() => addField()}>Добавить поле</button>
      <button onClick={() => validate()}>Проверить</button>
      <button onClick={resetForm}>Сбросить</button>
      <button onClick={undo} disabled={!canUndo}>
        Отменить
      </button>
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

  it('addField добавляет поле с уникальным id, undo убирает его, reset возвращает начало', async () => {
    const user = userEvent.setup()
    render(
      <FormProvider initialFields={[nameField]}>
        <Inspector />
      </FormProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'Добавить поле' }))
    await user.click(screen.getByRole('button', { name: 'Добавить поле' }))
    expect(screen.getByText('Полей: 3')).toBeInTheDocument()
    expect(screen.getAllByLabelText(/^Новое поле/)).toHaveLength(2)

    await user.click(screen.getByRole('button', { name: 'Отменить' }))
    expect(screen.getByText('Полей: 2')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Сбросить' }))
    expect(screen.getByText('Полей: 1')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Отменить' })).toBeDisabled()
  })

  it('внешний reducer переопределяет одно действие (State Reducer Pattern)', async () => {
    const user = userEvent.setup()
    // не больше двух полей — остальное поведение стандартное
    const limitReducer = (state, action, defaultReducer) => {
      if (action.type === FORM_ACTIONS.ADD_FIELD && state.fields.length >= 2) return state
      return defaultReducer(state, action)
    }
    render(
      <FormProvider initialFields={[nameField]} reducer={limitReducer}>
        <Inspector />
      </FormProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'Добавить поле' }))
    await user.click(screen.getByRole('button', { name: 'Добавить поле' }))
    expect(screen.getByText('Полей: 2')).toBeInTheDocument()

    // остальные действия идут через стандартный reducer
    await user.type(screen.getByLabelText(/Имя/), 'Ерлан')
    expect(screen.getByTestId('values')).toHaveTextContent('"name":"Ерлан"')
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

  it('новые поля получают разные подписи', async () => {
    const user = userEvent.setup()
    render(
      <FormProvider initialFields={[]}>
        <Inspector />
      </FormProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'Добавить поле' }))
    await user.click(screen.getByRole('button', { name: 'Добавить поле' }))

    expect(screen.getByLabelText('Новое поле 1')).toBeInTheDocument()
    expect(screen.getByLabelText('Новое поле 2')).toBeInTheDocument()
  })

  it('useForm вне FormProvider сообщает об ошибке', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<Inspector />)).toThrow('useForm используется вне <FormProvider>')
    consoleError.mockRestore()
  })
})
