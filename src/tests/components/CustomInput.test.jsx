import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef, useRef, useState } from 'react'
import { describe, expect, it } from 'vitest'
import CustomInput from '../../components/common/CustomInput/CustomInput.jsx'

// ref создаётся снаружи, чтобы тест мог посмотреть, что именно попало в него
function Parent({ inputRef: outerRef }) {
  const ownRef = useRef(null)
  const inputRef = outerRef ?? ownRef
  const [shown, setShown] = useState('')
  return (
    <>
      <CustomInput ref={inputRef} label="Город" />
      <button onClick={() => inputRef.current.focus()}>Focus</button>
      <button onClick={() => inputRef.current.clear()}>Clear</button>
      <button onClick={() => setShown(inputRef.current.getValue())}>Get value</button>
      <p>Значение: {shown}</p>
    </>
  )
}

describe('CustomInput (useImperativeHandle)', () => {
  it('Get value выводит текущее значение на страницу', async () => {
    const user = userEvent.setup()
    render(<Parent />)

    await user.type(screen.getByLabelText('Город'), 'Алматы')
    await user.click(screen.getByRole('button', { name: 'Get value' }))

    expect(screen.getByText('Значение: Алматы')).toBeInTheDocument()
  })

  it('Clear очищает поле, Focus ставит в него фокус', async () => {
    const user = userEvent.setup()
    render(<Parent />)
    const input = screen.getByLabelText('Город')
    await user.type(input, 'Астана')

    await user.click(screen.getByRole('button', { name: 'Clear' }))
    expect(input).toHaveValue('')

    await user.click(screen.getByRole('button', { name: 'Focus' }))
    expect(input).toHaveFocus()
  })

  it('наружу отдаются только три метода, а не DOM-элемент', () => {
    const inputRef = createRef()
    render(<Parent inputRef={inputRef} />)

    expect(inputRef.current).not.toBeInstanceOf(HTMLElement)
    expect(Object.keys(inputRef.current).sort()).toEqual(['clear', 'focus', 'getValue'])
  })
})
