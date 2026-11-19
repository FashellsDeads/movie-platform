import { loginFields } from '../authFields.js'
import SchemaForm from '../SchemaForm/SchemaForm.jsx'

/**
 * Форма входа: email, пароль, город (select), «Запомнить меня» (checkbox).
 * @param {{ onSubmit: (values: Record<string, string | boolean>) => Promise<void> }} props
 */
function LoginForm({ onSubmit }) {
  return <SchemaForm fields={loginFields} label="Вход" submitText="Войти" pendingText="Входим…" onSubmit={onSubmit} />
}

export default LoginForm
