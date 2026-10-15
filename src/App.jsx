import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/auth/AuthProvider.jsx'
import { CartProvider } from './context/cart/CartProvider.jsx'
import { FavoritesProvider } from './context/favorites/FavoritesProvider.jsx'
import { ThemeProvider } from './context/theme/ThemeProvider.jsx'
import MainLayout from './layouts/MainLayout.jsx'
import AboutPage from './pages/AboutPage.jsx'
import CatalogPage from './pages/CatalogPage.jsx'
import FavoritesPage from './pages/FavoritesPage.jsx'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import MovieDetailsPage from './pages/MovieDetailsPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import TicketsPage from './pages/TicketsPage.jsx'
import ProfileLayout from './pages/profile/ProfileLayout.jsx'
import ProfileOrders from './pages/profile/ProfileOrders.jsx'
import ProfileOverview from './pages/profile/ProfileOverview.jsx'
import ProfileSettings from './pages/profile/ProfileSettings.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx'

/**
 * Корень приложения: глобальные провайдеры (ДЗ №5) и карта маршрутов (ДЗ №6).
 * MainLayout — общий макет (шапка, подвал, модалка Premium, тосты), страницы
 * подставляются в его <Outlet />. Личный кабинет закрыт ProtectedRoute.
 */
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <FavoritesProvider>
            {/* ДЗ №6 · #1 — реестр маршрутов; BrowserRouter подключён в main.jsx */}
            <Routes>
              <Route element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="movies" element={<CatalogPage />} />
                <Route path="movie/:id" element={<MovieDetailsPage />} />
                <Route path="favorites" element={<FavoritesPage />} />
                <Route path="tickets" element={<TicketsPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="login" element={<LoginPage />} />

                <Route element={<ProtectedRoute />}>
                  <Route path="profile" element={<ProfileLayout />}>
                    <Route index element={<ProfileOverview />} />
                    <Route path="orders" element={<ProfileOrders />} />
                    <Route path="settings" element={<ProfileSettings />} />
                  </Route>
                </Route>

                {/* старый адрес каталога — перенаправляем без записи в историю */}
                <Route path="catalog" element={<Navigate to="/movies" replace />} />
                {/* ДЗ №6 · #2 — любой неизвестный адрес, последним в списке */}
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </FavoritesProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
