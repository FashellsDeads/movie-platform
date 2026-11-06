import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useDebounce } from './useDebounce.js'

describe('useDebounce', () => {
  // Управляемые часы: не ждём настоящие полсекунды
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('обновляет значение только через 500 мс', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), { initialProps: { value: 'а' } })

    rerender({ value: 'аб' })
    act(() => vi.advanceTimersByTime(499))
    expect(result.current).toBe('а')

    act(() => vi.advanceTimersByTime(1))
    expect(result.current).toBe('аб')
  })

  it('новая буква запускает отсчёт заново', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), { initialProps: { value: '' } })

    rerender({ value: 'а' })
    act(() => vi.advanceTimersByTime(300))
    rerender({ value: 'аб' })
    act(() => vi.advanceTimersByTime(300))
    expect(result.current).toBe('')

    act(() => vi.advanceTimersByTime(200))
    expect(result.current).toBe('аб')
  })
})
