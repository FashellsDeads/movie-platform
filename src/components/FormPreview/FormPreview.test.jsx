import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import FormProvider from '../FormProvider/FormProvider.jsx'
import FormPreview from './FormPreview.jsx'

describe('FormPreview', () => {
  it('поля с одинаковой подписью не теряют значения в результате Submit', async () => {
    const user = userEvent.setup()
    const fields = [
      { id: 'a', name: 'a', label: 'Телефон', type: 'text', required: false },
      { id: 'b', name: 'b', label: 'Телефон', type: 'text', required: false },
      { id: 'c', name: 'c', label: '  ', type: 'text', required: false },
    ]
    render(
      <FormProvider initialFields={fields}>
        <FormPreview />
      </FormProvider>,
    )

    const inputs = screen.getAllByRole('textbox')
    await user.type(inputs[0], '+7 701 111 22 33')
    await user.type(inputs[1], '+7 777 444 55 66')
    await user.type(inputs[2], 'без подписи')
    await user.click(screen.getByRole('button', { name: 'Submit' }))

    expect(JSON.parse(screen.getByTestId('submit-result').textContent)).toEqual({
      Телефон: '+7 701 111 22 33',
      'Телефон (2)': '+7 777 444 55 66',
      c: 'без подписи',
    })
  })
})
