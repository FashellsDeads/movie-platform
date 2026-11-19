import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import Modal from '../../components/common/Modal/Modal.jsx'

describe('Modal', () => {
  it('закрытое окно ничего не рендерит', () => {
    render(
      <Modal isOpen={false} onClose={vi.fn()}>
        <p>Текст</p>
      </Modal>,
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('содержимое задаётся только через children, без title', () => {
    render(
      <Modal isOpen onClose={vi.fn()}>
        <h2>Delete product?</h2>
        <p>Are you sure?</p>
      </Modal>,
    )

    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveTextContent('Delete product?')
    expect(dialog).toHaveTextContent('Are you sure?')
  })

  it('без title нет пустого заголовка, а у окна есть доступное имя', () => {
    render(
      <Modal isOpen onClose={vi.fn()}>
        <h2>Delete product?</h2>
      </Modal>,
    )

    expect(screen.getByRole('dialog', { name: 'Диалог' })).toBeInTheDocument()
    expect(screen.getAllByRole('heading')).toHaveLength(1)
  })

  it('с title окно названо заголовком', () => {
    render(
      <Modal isOpen title="Подтверждение" onClose={vi.fn()}>
        <p>Текст</p>
      </Modal>,
    )

    expect(screen.getByRole('dialog', { name: 'Подтверждение' })).toBeInTheDocument()
  })

  it('Escape вызывает onClose', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <Modal isOpen onClose={onClose}>
        <p>Текст</p>
      </Modal>,
    )

    await user.keyboard('{Escape}')

    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
