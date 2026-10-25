import { useState } from 'react'
import { ALL_CATEGORY, categories } from '../../data/movies.js'
import { countries, genders } from '../../data/site.js'
import { pluralize } from '../../utils/format.js'
import { MIN_AGE, MIN_PASSWORD_LENGTH, validateRegisterField, validateRegisterForm } from '../../utils/validation.js'
import Button from '../Button/Button.jsx'
import FormField from '../FormField/FormField.jsx'
import './RegisterForm.css'

// «навыки» из задания в кинотеатре — любимые жанры: те же checkbox с выбором нескольких вариантов
const GENRES = categories.filter((category) => category !== ALL_CATEGORY)
const ABOUT_MAX_LENGTH = 500

// порядок полей на странице — к первому неверному переводим фокус после отправки
const FIELD_ORDER = ['name', 'email', 'password', 'age', 'country', 'gender', 'genres', 'about']

/**
 * @typedef {Object} RegisteredUser
 * @property {string} name
 * @property {string} email
 * @property {number} passwordLength — сам пароль наружу не отдаём
 * @property {number} age
 * @property {string} country
 * @property {string} gender — значение из data/site.js → genders
 * @property {string[]} genres
 * @property {string} about
 */

/**
 * @typedef {Object} RegisterFormProps
 * @property {(user: RegisteredUser) => void} [onRegister] — вызывается после успешной отправки
 */

/**
 * ДЗ №8 — форма регистрации зрителя. Все поля управляемые (Controlled Components):
 * значение лежит в useState, поле показывает его через value / checked,
 * а любое изменение проходит через onChange.
 * @param {RegisterFormProps} props
 */
function RegisterForm({ onRegister }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [age, setAge] = useState('')
  const [country, setCountry] = useState('')
  const [gender, setGender] = useState('')
  const [genres, setGenres] = useState([])
  const [about, setAbout] = useState('')

  const [errors, setErrors] = useState({})
  const [submittedUser, setSubmittedUser] = useState(null)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const isSubmitted = submittedUser !== null

  // Ошибку поля пересчитываем, только если она уже показана: исправили — сообщение исчезает,
  // но пока человек впервые заполняет поле, форма не ругается на каждую букву.
  const refreshError = (field, value) => {
    if (!errors[field]) return
    const message = validateRegisterField(field, value)
    setErrors((prev) => {
      const next = { ...prev }
      if (message) next[field] = message
      else delete next[field]
      return next
    })
  }

  // Доп. задание — один обработчик для всех полей с одним значением:
  // text, email, password, number, select, radio и textarea. Какое поле изменилось, говорит атрибут name.
  const setters = {
    name: setName,
    email: setEmail,
    password: setPassword,
    age: setAge,
    country: setCountry,
    gender: setGender,
    about: setAbout,
  }

  const handleChange = (event) => {
    const { name: field, value } = event.target
    setters[field](value)
    refreshError(field, value)
  }

  // У checkbox значение — массив: отмеченный жанр добавляем, снятый убираем
  const handleGenreChange = (event) => {
    const { value, checked } = event.target
    // порядок как в списке жанров, а не в порядке кликов
    const nextGenres = GENRES.filter((genre) => (genre === value ? checked : genres.includes(genre)))
    setGenres(nextGenres)
    refreshError('genres', nextGenres)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const nextErrors = validateRegisterForm({ name, email, password, age, country, gender, genres, about })
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      setSubmittedUser(null)
      // фокус на первое неверное поле, чтобы не искать его глазами
      const firstInvalid = FIELD_ORDER.find((field) => nextErrors[field])
      const element = event.currentTarget.elements.namedItem(firstInvalid)
      ;(element instanceof RadioNodeList ? element[0] : element)?.focus()
      return
    }

    const user = {
      name: name.trim(),
      email: email.trim(),
      passwordLength: password.length,
      age: Number(age),
      country,
      gender,
      genres,
      about: about.trim(),
    }
    setSubmittedUser(user)
    onRegister?.(user)
  }

  // Кнопки «Сбросить» (до отправки) и «Очистить форму» (после) — всё в начальное состояние
  const handleReset = () => {
    setName('')
    setEmail('')
    setPassword('')
    setAge('')
    setCountry('')
    setGender('')
    setGenres([])
    setAbout('')
    setErrors({})
    setSubmittedUser(null)
    setIsPasswordVisible(false)
  }

  // id, name и связь с текстом ошибки — одинаковые для всех одиночных полей
  const fieldProps = (field) => ({
    id: `register-${field}`,
    name: field,
    'aria-invalid': errors[field] ? true : undefined,
    'aria-describedby': errors[field] ? `register-${field}-error` : undefined,
  })

  return (
    <div className="register">
      <form className="register-form" onSubmit={handleSubmit} noValidate>
        <div className="register-form__grid">
          <FormField id="register-name" label="Имя" error={errors.name}>
            <input
              {...fieldProps('name')}
              className="form-control"
              type="text"
              autoComplete="name"
              value={name}
              onChange={handleChange}
            />
          </FormField>

          <FormField id="register-email" label="Email" error={errors.email}>
            <input
              {...fieldProps('email')}
              className="form-control"
              type="email"
              autoComplete="email"
              value={email}
              onChange={handleChange}
            />
          </FormField>

          <FormField
            id="register-password"
            label="Пароль"
            hint={`Не короче ${MIN_PASSWORD_LENGTH} символов`}
            error={errors.password}
          >
            <div className="register-form__password">
              <input
                {...fieldProps('password')}
                className="form-control"
                type={isPasswordVisible ? 'text' : 'password'}
                autoComplete="new-password"
                value={password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="register-form__reveal"
                aria-pressed={isPasswordVisible}
                onClick={() => setIsPasswordVisible((prev) => !prev)}
              >
                {isPasswordVisible ? 'Скрыть' : 'Показать'}
              </button>
            </div>
          </FormField>

          <FormField id="register-age" label="Возраст" hint={`Регистрация с ${MIN_AGE} лет`} error={errors.age}>
            <input
              {...fieldProps('age')}
              className="form-control"
              type="number"
              inputMode="numeric"
              min={MIN_AGE}
              value={age}
              onChange={handleChange}
            />
          </FormField>

          <FormField id="register-country" label="Страна" error={errors.country}>
            <select {...fieldProps('country')} className="form-control" value={country} onChange={handleChange}>
              <option value="" disabled>
                Выберите страну
              </option>
              {countries.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </FormField>

          <FormField id="register-gender" label="Пол" error={errors.gender} isGroup>
            <div className="choice-group">
              {genders.map((item) => (
                <label key={item.value} className="choice">
                  <input
                    type="radio"
                    name="gender"
                    value={item.value}
                    checked={gender === item.value}
                    onChange={handleChange}
                  />
                  {item.label}
                </label>
              ))}
            </div>
          </FormField>
        </div>

        <FormField id="register-genres" label="Любимые жанры" error={errors.genres} isGroup>
          <div className="choice-group">
            {GENRES.map((genre) => (
              <label key={genre} className="choice">
                <input
                  type="checkbox"
                  name="genres"
                  value={genre}
                  checked={genres.includes(genre)}
                  onChange={handleGenreChange}
                />
                {genre}
              </label>
            ))}
          </div>
        </FormField>

        <FormField
          id="register-about"
          label="О себе"
          hint={`Необязательно · ${about.length} / ${ABOUT_MAX_LENGTH}`}
          error={errors.about}
        >
          <textarea
            {...fieldProps('about')}
            className="form-control"
            rows={4}
            maxLength={ABOUT_MAX_LENGTH}
            placeholder="Какое кино вы любите пересматривать?"
            value={about}
            onChange={handleChange}
          />
        </FormField>

        <div className="register-form__actions">
          <Button text="Зарегистрироваться" type="submit" />
          {!isSubmitted && <Button text="Сбросить" variant="outline" onClick={handleReset} />}
        </div>
      </form>

      {isSubmitted && (
        <div className="register-result">
          <p className="register-result__success" role="status">
            Форма успешно отправлена
          </p>

          <section className="register-result__card" aria-labelledby="register-result-title">
            <h2 className="register-result__title" id="register-result-title">
              Данные пользователя
            </h2>
            <dl className="register-result__list">
              <div>
                <dt>Имя</dt>
                <dd>{submittedUser.name}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{submittedUser.email}</dd>
              </div>
              <div>
                <dt>Пароль</dt>
                <dd>
                  {'•'.repeat(submittedUser.passwordLength)} ({submittedUser.passwordLength}{' '}
                  {pluralize(submittedUser.passwordLength, ['символ', 'символа', 'символов'])}, скрыт)
                </dd>
              </div>
              <div>
                <dt>Возраст</dt>
                <dd>
                  {submittedUser.age} {pluralize(submittedUser.age, ['год', 'года', 'лет'])}
                </dd>
              </div>
              <div>
                <dt>Страна</dt>
                <dd>{submittedUser.country}</dd>
              </div>
              <div>
                <dt>Пол</dt>
                <dd>{genders.find((item) => item.value === submittedUser.gender)?.label}</dd>
              </div>
              <div>
                <dt>Любимые жанры</dt>
                <dd>{submittedUser.genres.join(', ')}</dd>
              </div>
              <div>
                <dt>О себе</dt>
                <dd>{submittedUser.about || 'Не заполнено'}</dd>
              </div>
            </dl>
          </section>

          <Button text="Очистить форму" variant="outline" onClick={handleReset} />
        </div>
      )}
    </div>
  )
}

export default RegisterForm
