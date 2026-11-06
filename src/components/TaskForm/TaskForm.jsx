import { useState } from 'react'
import Button from '../Button/Button.jsx'
import './TaskForm.css'

/**
 * Форма новой задачи: контролируемое поле и проверка на пустое название.
 * @param {{ onAdd: (title: string) => void }} props
 */
function TaskForm({ onAdd }) {
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    const trimmedTitle = title.trim()

    if (!trimmedTitle) {
      setError('Введите название задачи')
      return
    }

    onAdd(trimmedTitle)
    setTitle('')
    setError('')
  }

  const handleChange = (event) => {
    setTitle(event.target.value)
    setError('')
  }

  return (
    <form className="task-form" noValidate onSubmit={handleSubmit}>
      <div className="task-form__row">
        <input
          className="form-control task-form__input"
          type="text"
          value={title}
          placeholder="Новая задача…"
          aria-label="Название задачи"
          aria-invalid={Boolean(error)}
          onChange={handleChange}
        />
        <Button text="Добавить" type="submit" />
      </div>
      {error && (
        <p className="task-form__error" role="alert">
          {error}
        </p>
      )}
    </form>
  )
}

export default TaskForm
