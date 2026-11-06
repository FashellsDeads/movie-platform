// Общая настройка тестов: матчеры toBeInTheDocument, toBeChecked и другие,
// а после каждого теста — очистка страницы и подмен, чтобы тесты не влияли друг на друга.
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})
