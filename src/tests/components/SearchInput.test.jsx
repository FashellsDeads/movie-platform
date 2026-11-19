import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef, useRef, useState } from 'react'
import { describe, expect, it } from 'vitest'
import SearchInput from '../../components/common/SearchInput/SearchInput.jsx'

function SearchDemo() {
  const inputRef = useRef(null)
  const [query, setQuery] = useState('')
  return (
    <>
      <SearchInput ref={inputRef} value={query} onChange={setQuery} />
      <button onClick={() => inputRef.current.focus()}>Focus search</button>
      <p>Ищем: {query}</p>
    </>
  )
}

describe('SearchInput (forwardRef)', () => {
  it('«Focus search» ставит фокус в поле через ref', async () => {
    const user = userEvent.setup()
    render(<SearchDemo />)

    await user.click(screen.getByRole('button', { name: 'Focus search' }))

    expect(screen.getByRole('searchbox')).toHaveFocus()
  })

  it('ref указывает на настоящий DOM-элемент input', () => {
    const ref = createRef()
    render(<SearchInput ref={ref} value="" onChange={() => {}} />)

    expect(ref.current).toBeInstanceOf(HTMLInputElement)
    expect(ref.current.type).toBe('search')
  })

  it('сообщает введённый текст строкой', async () => {
    const user = userEvent.setup()
    render(<SearchDemo />)

    await user.type(screen.getByRole('searchbox'), 'Дюна')

    expect(screen.getByText('Ищем: Дюна')).toBeInTheDocument()
  })
})
