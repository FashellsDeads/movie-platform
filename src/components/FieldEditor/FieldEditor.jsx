import Button from '../Button/Button.jsx'
import Input from '../Input/Input.jsx'
import { useForm } from '../FormProvider/useForm.js'
import './FieldEditor.css'

// Типы, которые можно выбрать в конструкторе (из задания)
const FIELD_TYPES = [
  { value: 'text', label: 'Текст' },
  { value: 'email', label: 'Email' },
  { value: 'number', label: 'Число' },
  { value: 'select', label: 'Список' },
]

const DEFAULT_OPTIONS = ['Вариант 1', 'Вариант 2']

/**
 * ДЗ №13 — редактор одного поля: название, тип, обязательность, удаление.
 * Поле берёт из FormProvider по id, поэтому родителю не нужно передавать его целиком.
 * @param {{ fieldId: string }} props
 */
function FieldEditor({ fieldId }) {
  const { fields, updateField, removeField } = useForm()
  const index = fields.findIndex((field) => field.id === fieldId)
  const field = fields[index]
  if (!field) return null

  const changeType = (type) => {
    // у списка должны быть варианты — даём два для начала
    const changes = type === 'select' && !field.options?.length ? { type, options: DEFAULT_OPTIONS } : { type }
    updateField(field.id, changes)
  }

  return (
    <fieldset className="field-editor">
      <legend className="field-editor__legend">Поле {index + 1}</legend>

      <div className="field-editor__grid">
        <Input label="Название" value={field.label} onChange={(label) => updateField(field.id, { label })} />

        <div className="ui-input">
          <label className="ui-input__label" htmlFor={`${field.id}-type`}>
            Тип
          </label>
          <select
            id={`${field.id}-type`}
            className="ui-input__field"
            value={field.type}
            onChange={(event) => changeType(event.target.value)}
          >
            {FIELD_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {field.type === 'select' && (
        // варианты хранятся как есть (split по запятой без обрезки) — так ввод пробелов и запятых не ломается
        <Input
          label="Варианты через запятую"
          value={(field.options ?? []).join(',')}
          onChange={(text) => updateField(field.id, { options: text.split(',') })}
        />
      )}

      <div className="field-editor__footer">
        <label className="dynamic-field__choice">
          <input
            type="checkbox"
            checked={field.required}
            onChange={(event) => updateField(field.id, { required: event.target.checked })}
          />
          <span>Обязательное</span>
        </label>
        <Button variant="outline" aria-label={`Удалить поле «${field.label}»`} onClick={() => removeField(field.id)}>
          Удалить
        </Button>
      </div>
    </fieldset>
  )
}

export default FieldEditor
