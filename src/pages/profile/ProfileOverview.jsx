import { Link } from 'react-router-dom'
import { useCart } from '../../context/cart/useCart.js'
import { useFavorites } from '../../context/favorites/useFavorites.js'
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js'

/**
 * «/profile» (index-маршрут) — сводка по аккаунту со ссылками в нужные разделы.
 */
function ProfileOverview() {
  useDocumentTitle('Личный кабинет')
  const { favoriteIds } = useFavorites()
  const { totalCount, orders } = useCart()

  const tiles = [
    { to: '/favorites', value: favoriteIds.length, label: 'фильмов в избранном' },
    { to: '/tickets', value: totalCount, label: 'билетов ждут оформления' },
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
