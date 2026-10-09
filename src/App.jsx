import { AuthProvider } from './context/auth/AuthProvider.jsx'
import { CartProvider } from './context/cart/CartProvider.jsx'
import { ThemeProvider } from './context/theme/ThemeProvider.jsx'
import HomePage from './pages/HomePage.jsx'

/**
 * Корень приложения: глобальные провайдеры (ДЗ №5) и страница.
 * Любой компонент внутри получает тему, сессию и корзину через useTheme / useAuth / useCart,
 * без передачи props через промежуточные уровни.
 */
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <HomePage />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
