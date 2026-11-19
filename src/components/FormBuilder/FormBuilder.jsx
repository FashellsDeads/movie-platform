import Button from '../Button/Button.jsx'
import FieldEditor from '../FieldEditor/FieldEditor.jsx'
import { useForm } from '../FormProvider/useForm.js'
import './FormBuilder.css'

/**
 * ДЗ №13 — FormBuilder: список редакторов полей и кнопка «Добавить поле».
 * Состояние берёт из FormProvider — через props приходит только подсказка снизу.
 * @param {{ notice?: import('react').ReactNode }} props
 */
function FormBuilder({ notice }) {
  const { fields, addField } = useForm()

  return (
    <div className="form-builder">
      {fields.length === 0 && <p className="form-builder__empty">В форме пока нет полей.</p>}
      {fields.map((field) => (
        <FieldEditor key={field.id} fieldId={field.id} />
      ))}
      <div className="form-builder__add">
        <Button variant="secondary" onClick={() => addField()}>
          Добавить поле
        </Button>
        {notice}
      </div>
    </div>
  )
}

export default FormBuilder
