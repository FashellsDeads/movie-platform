import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // ДЗ №11 — тесты: jsdom заменяет браузер, setup подключает матчеры и очистку
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
  },
})
