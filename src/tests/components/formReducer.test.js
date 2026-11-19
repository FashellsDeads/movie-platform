import { describe, expect, it } from 'vitest'
import { FORM_ACTIONS, createFormState, formReducer } from '../../components/forms/FormProvider/formReducer.js'

const nameField = { id: 'name', name: 'name', label: 'Имя', type: 'text', required: true }
const agreeField = { id: 'agree', name: 'agree', label: 'Согласен', type: 'checkbox', required: true }

describe('createFormState', () => {
  it('ставит пустые значения: строка для полей, false для checkbox', () => {
    const state = createFormState([nameField, agreeField])

    expect(state).toEqual({ fields: [nameField, agreeField], values: { name: '', agree: false }, errors: {} })
  })

  it('берёт переданные значения', () => {
    expect(createFormState([nameField], { name: 'Адильжан' }).values).toEqual({ name: 'Адильжан' })
  })
})

describe('formReducer', () => {
  const initial = createFormState([nameField])

  it('UPDATE_VALUE меняет значение и убирает ошибку этого поля', () => {
    const withError = { ...initial, errors: { name: 'Обязательное поле' } }
    const state = formReducer(withError, { type: FORM_ACTIONS.UPDATE_VALUE, name: 'name', value: 'Адильжан' })

    expect(state.values.name).toBe('Адильжан')
    expect(state.errors).toEqual({})
  })

  it('SET_ERRORS записывает ошибки', () => {
    const state = formReducer(initial, { type: FORM_ACTIONS.SET_ERRORS, errors: { name: 'Обязательное поле' } })

    expect(state.errors).toEqual({ name: 'Обязательное поле' })
  })

  it('RESET_FORM возвращает переданное начальное состояние', () => {
    const changed = formReducer(initial, { type: FORM_ACTIONS.UPDATE_VALUE, name: 'name', value: 'x' })

    expect(formReducer(changed, { type: FORM_ACTIONS.RESET_FORM, initialState: initial })).toBe(initial)
  })

  it('неизвестное действие возвращает то же состояние', () => {
    expect(formReducer(initial, { type: 'UNKNOWN' })).toBe(initial)
  })
})
