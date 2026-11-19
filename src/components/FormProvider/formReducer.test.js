import { describe, expect, it } from 'vitest'
import { FORM_ACTIONS, createFormState, createHistory, formReducer, withHistory } from './formReducer.js'

const nameField = { id: 'name', name: 'name', label: 'Имя', type: 'text', required: true }
const agreeField = { id: 'agree', name: 'agree', label: 'Согласен', type: 'checkbox', required: true }
const cityField = { id: 'city', name: 'city', label: 'Город', type: 'select', required: false, options: ['Алматы'] }

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

  it('ADD_FIELD добавляет поле и пустое значение', () => {
    const state = formReducer(initial, { type: FORM_ACTIONS.ADD_FIELD, field: cityField })

    expect(state.fields).toHaveLength(2)
    expect(state.values.city).toBe('')
  })

  it('REMOVE_FIELD убирает поле, его значение и ошибку', () => {
    const withError = { ...initial, errors: { name: 'Обязательное поле' } }
    const state = formReducer(withError, { type: FORM_ACTIONS.REMOVE_FIELD, id: 'name' })

    expect(state).toEqual({ fields: [], values: {}, errors: {} })
  })

  it('UPDATE_FIELD меняет описание поля', () => {
    const state = formReducer(initial, { type: FORM_ACTIONS.UPDATE_FIELD, id: 'name', changes: { label: 'ФИО' } })

    expect(state.fields[0].label).toBe('ФИО')
  })

  it('UPDATE_FIELD со сменой типа сбрасывает значение поля', () => {
    const filled = { ...initial, values: { name: 'abc' } }
    const state = formReducer(filled, { type: FORM_ACTIONS.UPDATE_FIELD, id: 'name', changes: { type: 'checkbox' } })

    expect(state.values.name).toBe(false)
  })

  it('UPDATE_FIELD убирает старую ошибку поля — правила поля изменились', () => {
    const withError = { ...initial, errors: { name: 'Обязательное поле' } }
    const state = formReducer(withError, { type: FORM_ACTIONS.UPDATE_FIELD, id: 'name', changes: { required: false } })

    expect(state.errors).toEqual({})
  })

  it('UPDATE_FIELD: если выбранного варианта больше нет в списке, значение сбрасывается', () => {
    const chosen = { ...createFormState([cityField]), values: { city: 'Алматы' } }

    const removed = formReducer(chosen, { type: FORM_ACTIONS.UPDATE_FIELD, id: 'city', changes: { options: ['Астана'] } })
    expect(removed.values.city).toBe('')

    const kept = formReducer(chosen, { type: FORM_ACTIONS.UPDATE_FIELD, id: 'city', changes: { options: [' Алматы', 'Астана'] } })
    expect(kept.values.city).toBe('Алматы')
  })

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

describe('withHistory — Undo / Redo', () => {
  const reducer = withHistory(formReducer)
  const labels = (history) => history.present.fields.map((field) => field.label)

  it('сценарий из задания: add → change → delete → undo → undo → redo', () => {
    let history = createHistory(createFormState([nameField]))

    history = reducer(history, { type: FORM_ACTIONS.ADD_FIELD, field: cityField })
    expect(labels(history)).toEqual(['Имя', 'Город'])

    history = reducer(history, { type: FORM_ACTIONS.UPDATE_FIELD, id: 'city', changes: { label: 'Город проживания' } })
    expect(labels(history)).toEqual(['Имя', 'Город проживания'])

    history = reducer(history, { type: FORM_ACTIONS.REMOVE_FIELD, id: 'name' })
    expect(labels(history)).toEqual(['Город проживания'])

    history = reducer(history, { type: FORM_ACTIONS.UNDO })
    expect(labels(history)).toEqual(['Имя', 'Город проживания'])

    history = reducer(history, { type: FORM_ACTIONS.UNDO })
    expect(labels(history)).toEqual(['Имя', 'Город'])

    history = reducer(history, { type: FORM_ACTIONS.REDO })
    expect(labels(history)).toEqual(['Имя', 'Город проживания'])
  })

  it('ввод значений не попадает в историю', () => {
    let history = createHistory(createFormState([nameField]))
    history = reducer(history, { type: FORM_ACTIONS.UPDATE_VALUE, name: 'name', value: 'А' })

    expect(history.past).toHaveLength(0)
    expect(history.present.values.name).toBe('А')
  })

  it('после RESET_FORM отменять нечего', () => {
    const start = createFormState([nameField])
    let history = createHistory(start)
    history = reducer(history, { type: FORM_ACTIONS.ADD_FIELD, field: cityField })
    history = reducer(history, { type: FORM_ACTIONS.RESET_FORM, initialState: start })

    expect(history).toEqual({ past: [], present: start, future: [] })
    expect(reducer(history, { type: FORM_ACTIONS.UNDO })).toBe(history)
  })

  it('новое изменение после Undo очищает future', () => {
    let history = createHistory(createFormState([nameField]))
    history = reducer(history, { type: FORM_ACTIONS.ADD_FIELD, field: cityField })
    history = reducer(history, { type: FORM_ACTIONS.UNDO })
    expect(history.future).toHaveLength(1)

    history = reducer(history, { type: FORM_ACTIONS.UPDATE_FIELD, id: 'name', changes: { label: 'ФИО' } })

    expect(history.future).toHaveLength(0)
    expect(reducer(history, { type: FORM_ACTIONS.REDO })).toBe(history)
  })

  it('Undo откатывает структуру, но не стирает значения, введённые в оставшиеся поля', () => {
    let history = createHistory(createFormState([nameField]))
    history = reducer(history, { type: FORM_ACTIONS.ADD_FIELD, field: cityField })
    history = reducer(history, { type: FORM_ACTIONS.UPDATE_VALUE, name: 'name', value: 'Адильжан' })

    history = reducer(history, { type: FORM_ACTIONS.UNDO })

    expect(labels(history)).toEqual(['Имя'])
    expect(history.present.values).toEqual({ name: 'Адильжан' })
  })

  it('Redo тоже сохраняет значения, введённые после Undo', () => {
    let history = createHistory(createFormState([nameField]))
    history = reducer(history, { type: FORM_ACTIONS.UPDATE_FIELD, id: 'name', changes: { label: 'ФИО' } })
    history = reducer(history, { type: FORM_ACTIONS.UNDO })
    history = reducer(history, { type: FORM_ACTIONS.UPDATE_VALUE, name: 'name', value: 'Ерлан' })

    history = reducer(history, { type: FORM_ACTIONS.REDO })

    expect(labels(history)).toEqual(['ФИО'])
    expect(history.present.values).toEqual({ name: 'Ерлан' })
  })

  it('ввод названия по буквам — один шаг Undo, а не по букве', () => {
    let history = createHistory(createFormState([nameField]))
    for (const label of ['Ф', 'ФИ', 'ФИО']) {
      history = reducer(history, { type: FORM_ACTIONS.UPDATE_FIELD, id: 'name', changes: { label } })
    }
    expect(history.past).toHaveLength(1)

    history = reducer(history, { type: FORM_ACTIONS.UNDO })
    expect(labels(history)).toEqual(['Имя'])
  })

  it('правка другого поля или другого свойства — новый шаг', () => {
    let history = createHistory(createFormState([nameField, cityField]))
    history = reducer(history, { type: FORM_ACTIONS.UPDATE_FIELD, id: 'name', changes: { label: 'ФИО' } })
    history = reducer(history, { type: FORM_ACTIONS.UPDATE_FIELD, id: 'city', changes: { label: 'Город проживания' } })
    history = reducer(history, { type: FORM_ACTIONS.UPDATE_FIELD, id: 'city', changes: { required: true } })

    expect(history.past).toHaveLength(3)
  })

  it('действие, которое ничего не изменило, не создаёт шаг истории', () => {
    const history = createHistory(createFormState([nameField]))
    const next = reducer(history, { type: FORM_ACTIONS.REMOVE_FIELD, id: 'missing' })

    expect(next.past).toHaveLength(0)
  })
})
