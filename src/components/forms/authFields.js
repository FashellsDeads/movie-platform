// Формы входа и регистрации описаны данными: DynamicField сам выбирает, какое поле нарисовать,
// FormProvider хранит значения, formValidation проверяет. Чтобы добавить поле — достаточно строки здесь.
import { genders } from '../../data/site.js'

export const CITIES = ['Алматы', 'Астана', 'Шымкент', 'Караганда', 'Актобе']

/** @type {import('./FormProvider/formReducer.js').FormField[]} */
export const loginFields = [
  { id: 'email', name: 'email', label: 'Email', type: 'email', required: true, autoComplete: 'email' },
  { id: 'password', name: 'password', label: 'Пароль', type: 'password', required: true, autoComplete: 'current-password' },
  { id: 'city', name: 'city', label: 'Город', type: 'select', required: false, options: CITIES },
  { id: 'remember', name: 'remember', label: 'Запомнить меня', type: 'checkbox', required: false },
]

/** @type {import('./FormProvider/formReducer.js').FormField[]} */
export const registerFields = [
  { id: 'name', name: 'name', label: 'Имя', type: 'text', required: true, autoComplete: 'name' },
  { id: 'email', name: 'email', label: 'Email', type: 'email', required: true, autoComplete: 'email' },
  { id: 'password', name: 'password', label: 'Пароль', type: 'password', required: true, autoComplete: 'new-password' },
  { id: 'confirm', name: 'confirm', label: 'Повторите пароль', type: 'password', required: true, autoComplete: 'new-password' },
  { id: 'city', name: 'city', label: 'Город', type: 'select', required: true, options: CITIES },
  { id: 'gender', name: 'gender', label: 'Пол', type: 'radio', required: true, options: genders },
  { id: 'agree', name: 'agree', label: 'Согласен с правилами кинотеатра', type: 'checkbox', required: true },
]
