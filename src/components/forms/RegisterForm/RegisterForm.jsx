import { validatePasswords } from '../../../utils/formValidation.js'
import { registerFields } from '../authFields.js'
import SchemaForm from '../SchemaForm/SchemaForm.jsx'

/**
 * Форма регистрации: поля, город (select), пол (radio), согласие (checkbox),
 * плюс проверка длины пароля и совпадения повтора.
 * @param {{ onSubmit: (values: Record<string, string | boolean>) => Promise<void> }} props
 */
function RegisterForm({ onSubmit }) {
  return (
    <SchemaForm
      fields={registerFields}
      label="Регистрация"
      submitText="Зарегистрироваться"
      pendingText="Создаём аккаунт…"
      getExtraErrors={validatePasswords}
      onSubmit={onSubmit}
    />
  )
}

export default RegisterForm
