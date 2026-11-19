import { describe, expect, it } from 'vitest'
import { validateField, validateFields } from '../../utils/formValidation.js'

const field = (type, required = true) => ({ id: type, name: type, label: type, type, required })

describe('validateField', () => {
  it('обязательное пустое поле', () => {
    expect(validateField(field('text'), '')).toBe('Обязательное поле')
    expect(validateField(field('text'), '   ')).toBe('Обязательное поле')
  })

  it('обязательный checkbox без галочки', () => {
    expect(validateField(field('checkbox'), false)).toBe('Обязательное поле')
    expect(validateField(field('checkbox'), true)).toBe('')
  })

  it('email должен быть корректным', () => {
    expect(validateField(field('email'), 'abc')).toBe('Введите корректный email')
    expect(validateField(field('email'), 'adilzhan@cinevibe.kz')).toBe('')
  })

  it('number должен содержать число', () => {
    expect(validateField(field('number'), '12a')).toBe('Введите число')
    expect(validateField(field('number'), '12')).toBe('')
  })

  it('number: дробь через запятую — тоже число (казахстанская раскладка), 0x10 и 1e3 — нет', () => {
    expect(validateField(field('number'), '1,5')).toBe('')
    expect(validateField(field('number'), '-2.75')).toBe('')
    expect(validateField(field('number'), '0x10')).toBe('Введите число')
    expect(validateField(field('number'), '1e3')).toBe('Введите число')
  })

  it('пустое необязательное поле не проверяется', () => {
    expect(validateField(field('email', false), '')).toBe('')
    expect(validateField(field('number', false), '')).toBe('')
  })
})

describe('validateFields', () => {
  it('возвращает только поля с ошибками', () => {
    const fields = [field('text'), field('email'), field('number', false)]

    expect(validateFields(fields, { text: 'Адильжан', email: 'x', number: '' })).toEqual({
      email: 'Введите корректный email',
    })
  })
})
