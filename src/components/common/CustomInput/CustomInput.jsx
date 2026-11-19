import { useId, useImperativeHandle, useRef } from 'react'
import '../Input/Input.css'

/**
 * @typedef {Object} CustomInputHandle
 * @property {() => void} focus — поставить фокус в поле
 * @property {() => void} clear — очистить поле
 * @property {() => string} getValue — текущее значение
 */

/**
 * @typedef {Object} CustomInputProps
 * @property {string} label — подпись поля
 * @property {string} [defaultValue='']
 * @property {string} [placeholder]
 * @property {import('react').Ref<CustomInputHandle>} [ref] — сюда попадает собственный API компонента
 */

/**
 * useImperativeHandle: через ref родитель получает не DOM-элемент,
 * а только три метода. Как устроено поле внутри, снаружи не видно.
 * @param {CustomInputProps} props
 */
function CustomInput({ label, defaultValue = '', placeholder, ref }) {
  const inputRef = useRef(null)
  const inputId = useId()

  useImperativeHandle(
    ref,
    () => ({
      focus: () => inputRef.current.focus(),
      clear: () => {
        inputRef.current.value = ''
      },
      getValue: () => inputRef.current.value,
    }),
    [],
  )

  return (
    <div className="ui-input">
      <label className="ui-input__label" htmlFor={inputId}>
        {label}
      </label>
      <input
        ref={inputRef}
        id={inputId}
        className="ui-input__field"
        defaultValue={defaultValue}
        placeholder={placeholder}
      />
    </div>
  )
}

export default CustomInput
