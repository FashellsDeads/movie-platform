import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout/MainLayout.jsx'
import AboutPage from '../pages/About/AboutPage.jsx'
import CartPage from '../pages/Cart/CartPage.jsx'
import FavoritesPage from '../pages/Favorites/FavoritesPage.jsx'
import HomePage from '../pages/Home/HomePage.jsx'
import LoginPage from '../pages/Login/LoginPage.jsx'
import NotFoundPage from '../pages/NotFound/NotFoundPage.jsx'
import ProductDetailsPage from '../pages/ProductDetails/ProductDetailsPage.jsx'
import ProductsPage from '../pages/Products/ProductsPage.jsx'
import ProfileLayout from '../pages/Profile/ProfileLayout.jsx'
import ProfileOrders from '../pages/Profile/ProfileOrders.jsx'
import ProfileOverview from '../pages/Profile/ProfileOverview.jsx'
import ProfileSettings from '../pages/Profile/ProfileSettings.jsx'
import RegisterPage from '../pages/Register/RegisterPage.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'

/** Старый адрес фильма /movie/:id → /products/:id (ссылки из закладок продолжают работать). */
function RedirectToProduct() {
  const { id } = useParams()
  return <Navigate to={`/products/${id}`} replace />
}

/**
 * Карта маршрутов магазина. Все страницы — внутри MainLayout (шапка, подвал),
 * личный кабинет закрыт ProtectedRoute и состоит из вложенных страниц (Outlet).
 */
function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/:id" element={<ProductDetailsPage />} />
        <Route path="favorites" element={<FavoritesPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="profile" element={<ProfileLayout />}>
            <Route index element={<ProfileOverview />} />
            <Route path="orders" element={<ProfileOrders />} />
            <Route path="settings" element={<ProfileSettings />} />
          </Route>
        </Route>

        {/* Старые адреса сайта — без записи в историю */}
        <Route path="movies" element={<Navigate to="/products" replace />} />
        <Route path="catalog" element={<Navigate to="/products" replace />} />
        <Route path="bar" element={<Navigate to="/products?type=bar" replace />} />
        <Route path="movie/:id" element={<RedirectToProduct />} />
        <Route path="tickets" element={<Navigate to="/cart" replace />} />

        <Route path="404" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
