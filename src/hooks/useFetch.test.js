import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { errorResponse, jsonResponse, stubFetch } from '../test/mockUsers.js'
import { useFetch } from './useFetch.js'

describe('useFetch', () => {
  let fetchMock

  beforeEach(() => {
    fetchMock = stubFetch()
  })

  it('возвращает данные и выключает загрузку', async () => {
    fetchMock.mockResolvedValue(jsonResponse(['данные']))
    const { result } = renderHook(() => useFetch('/api'))

    expect(result.current.loading).toBe(true)
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.data).toEqual(['данные'])
    expect(result.current.error).toBeNull()
  })

  it('превращает ответ 404 в понятное сообщение', async () => {
    fetchMock.mockResolvedValue(errorResponse(404))
    const { result } = renderHook(() => useFetch('/api'))

    await waitFor(() => expect(result.current.error).toContain('404'))

    expect(result.current.data).toBeNull()
    expect(result.current.loading).toBe(false)
  })

  it('refetch выполняет запрос ещё раз и обновляет данные', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse('старое'))
    fetchMock.mockResolvedValueOnce(jsonResponse('новое'))
    const { result } = renderHook(() => useFetch('/api'))
    await waitFor(() => expect(result.current.data).toBe('старое'))

    act(() => result.current.refetch())

    await waitFor(() => expect(result.current.data).toBe('новое'))
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('при смене адреса отменяет старый запрос: его ответ не попадает в данные', async () => {
    // Как настоящий fetch: первый запрос висит, пока его не отменят, и падает с AbortError
    fetchMock.mockImplementation((url, { signal }) => {
      if (url === '/new') return Promise.resolve(jsonResponse('новый ответ'))
      return new Promise((_, reject) => {
        signal.addEventListener('abort', () => reject(new DOMException('Отменён', 'AbortError')))
      })
    })
    const { result, rerender } = renderHook(({ url }) => useFetch(url), { initialProps: { url: '/old' } })
    const oldSignal = fetchMock.mock.calls[0][1].signal

    rerender({ url: '/new' })

    await waitFor(() => expect(result.current.data).toBe('новый ответ'))
    expect(oldSignal.aborted).toBe(true)
    expect(result.current.error).toBeNull()
  })
})
