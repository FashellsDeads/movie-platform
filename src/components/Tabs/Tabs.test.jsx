import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import Tabs from './Tabs.jsx'

function ProfileTabs() {
  return (
    <Tabs>
      <Tabs.List>
        <Tabs.Tab>Profile</Tabs.Tab>
        <Tabs.Tab>Settings</Tabs.Tab>
        <Tabs.Tab>Orders</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel>Profile content</Tabs.Panel>
      <Tabs.Panel>Settings content</Tabs.Panel>
      <Tabs.Panel>Orders content</Tabs.Panel>
    </Tabs>
  )
}

describe('Tabs', () => {
  it('сначала открыта первая вкладка', () => {
    render(<ProfileTabs />)

    expect(screen.getByRole('tab', { name: 'Profile' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Profile content')
    expect(screen.queryByText('Settings content')).not.toBeInTheDocument()
  })

  it('клик по вкладке показывает её панель и скрывает остальные', async () => {
    const user = userEvent.setup()
    render(<ProfileTabs />)

    await user.click(screen.getByRole('tab', { name: 'Settings' }))

    expect(screen.getByRole('tab', { name: 'Settings' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Profile' })).toHaveAttribute('aria-selected', 'false')
    expect(screen.getByRole('tabpanel', { name: 'Settings' })).toHaveTextContent('Settings content')
    expect(screen.queryByText('Profile content')).not.toBeInTheDocument()
  })

  it('стрелки, Home и End переключают вкладки с клавиатуры', async () => {
    const user = userEvent.setup()
    render(<ProfileTabs />)

    await user.tab()
    expect(screen.getByRole('tab', { name: 'Profile' })).toHaveFocus()

    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Settings' })).toHaveFocus()
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Settings content')

    await user.keyboard('{End}')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Orders content')

    // с последней вкладки стрелка вправо идёт на первую
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Profile' })).toHaveFocus()

    await user.keyboard('{ArrowLeft}')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Orders content')

    await user.keyboard('{Home}')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Profile content')
  })
})
