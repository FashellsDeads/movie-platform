import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext.jsx'
import { useFavorites } from '../../context/FavoritesContext.jsx'
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js'
import { useUserOrders } from '../../hooks/useUserOrders.js'

/**
 * «/profile» (index-маршрут) — сводка по аккаунту со ссылками в нужные разделы.
 */
function ProfileOverview() {
  useDocumentTitle('Личный кабинет')
  const { favoriteIds } = useFavorites()
  const { totalCount } = useCart()
  const orders = useUserOrders()

  const tiles = [
    { to: '/favorites', value: favoriteIds.length, label: 'в избранном' },
    { to: '/cart', value: totalCount, label: 'в корзине ждут оформления' },
    { to: '/profile/orders', value: orders.length, label: 'оформленных заказов' },
  ]

  return (
    <div className="profile-tiles">
      {tiles.map((tile) => (
        <Link key={tile.to} className="profile-tile" to={tile.to}>
          <span className="profile-tile__value">{tile.value}</span>
          <span className="profile-tile__label">{tile.label}</span>
        </Link>
      ))}
    </div>
  )
}

export default ProfileOverview
