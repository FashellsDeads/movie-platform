import { useContext } from 'react'
import { ThemeContext } from './ThemeContext.js'

/**
 * Доступ к теме из любого компонента внутри ThemeProvider.
 * @returns {import('./ThemeContext.js').ThemeContextValue}
 */
export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme нужно вызывать внутри <ThemeProvider>')
  return context
}
