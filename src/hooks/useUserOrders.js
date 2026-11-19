import { useMemo } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'

/**
 * Заказы вошедшего зрителя. Все заказы этого браузера хранятся в одном списке
 * (номера заказов сквозные), а каждому аккаунту показываются только его собственные.
 * @returns {import('../context/cartReducer.js').Order[]}
 */
export function useUserOrders() {
  const { user } = useAuth()
  const { orders } = useCart()
  // useMemo: фильтр пересчитывается только при новом заказе или смене пользователя
  return useMemo(() => (user ? orders.filter((order) => order.email === user.email) : []), [orders, user])
}
