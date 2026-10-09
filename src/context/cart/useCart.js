import { useContext } from 'react'
import { CartContext } from './CartContext.js'

/**
 * Доступ к корзине билетов из любого компонента внутри CartProvider.
 * @returns {import('./CartContext.js').CartContextValue}
 */
export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart нужно вызывать внутри <CartProvider>')
  return context
}
