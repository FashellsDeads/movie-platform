# CineVibe — онлайн-кинотеатр

Семестровый проект по React (Vite + JavaScript). Тема: **Киносайт / Онлайн-кинотеатр**.

## Запуск

```bash
npm install
npm run dev      # режим разработки
npm run build    # production-сборка
npm run lint     # проверка кода (oxlint)
```

Каждое ДЗ сохранено отдельной версией: `git checkout hw2` … `git checkout hw5`, вернуться — `git checkout main`.
Таблицы ниже описывают код на момент своего ДЗ. С ДЗ №5 содержимое `App.jsx` переехало в `src/pages/HomePage.jsx`, а тема (вместе с эффектами ДЗ №4 #3 и #15) — в `ThemeProvider`.

## ДЗ №2 — передача данных через props

Интерфейсы props описаны в каждом компоненте через JSDoc (`@typedef`), значения по умолчанию задаются при деструктуризации.

| # | Компонент | Props | Где используется |
|---|---|---|---|
| 1 | `Button` | `text`, `variant`, `isDisabled`, `onClick` | Header (secondary), Hero и карточки (primary), карточка «Скоро» (outline + disabled), модальные окна |
| 2 | `Logo` | `src`, `altText`, `width`, `height` | Header и Footer (разные размеры) |
| 3 | `Card` | `title`, `description`, `imageUrl`, `year`, `genre`, `duration`, `score`, `reviewsCount`, `status`, `isAvailable`, `onWatch` | Каталог: 9 фильмов |
| 4 | `Badge` | `label`, `colorScheme` | Статус в карточке и в окне фильма: «Новинка» (green), «Хит»/«Скоро» (yellow), «18+» (red) |
| 5 | `Navigation` | `navItems[]` (`id`, `label`, `link`) | Получает пункты из Header, рендерит их через `.map()` |
| 6 | `UserProfile` | `user` (`name`, `avatarUrl`, `role`, `email`) | Шапка сайта |
| 7 | `HeroSection` | `heading`, `subheading`, `buttonText`, `onButtonClick` | Главный экран |
| 8 | `StatCard` | `title`, `value`, `change`, `isPositive` | Блок «CineVibe в цифрах», 4 виджета |
| 9 | `RatingStars` | `score`, `reviewsCount` | Внутри карточки и окна фильма |
| 10 | `SectionHeader` | `title`, `subtitle`, `align` | Перед статистикой и каталогом (left), перед отзывами (center) |
| 11 | `CategoryFilter` | `categories[]`, `activeCategory`, `onSelect` | Фильтр жанров над каталогом, активный жанр подсвечен классом `--active` |
| 12 | `TestimonialCard` | `authorName`, `authorRole`, `avatar`, `text`, `date` | Блок отзывов зрителей |
| 13 | `Modal` | `isOpen`, `title`, `onClose`, `children` | Окно просмотра фильма и окно подписки Premium; при `isOpen === false` возвращает `null` |
| 14 | `Container` | `children`, `maxWidth` | Оборачивает все секции (1200 / 1080 / 1320 px) |
| 15 | `Footer` | `copyrightText`, `socialLinks[]` (`platform`, `url`, `icon`) | Подвал сайта |

## ДЗ №3 — управление состоянием с помощью useState

| # | Сценарий | Состояние | Где |
|---|---|---|---|
| 1 | Тёмная / светлая тема | `const [isDarkMode, setIsDarkMode] = useState(true)` | `App.jsx`, кнопка `ThemeToggle` в Header переключает класс `theme-dark` / `theme-light` на обёртке приложения |
| 2 | Быстрый просмотр фильма | `const [isModalOpen, setIsModalOpen] = useState(false)` + `selectedMovie` | `App.jsx` → `QuickViewModal`; открывается кликом по карточке, закрывается крестиком, кнопкой «Закрыть» или кликом по оверлею |
| 3 | Поиск по названию | `const [searchQuery, setSearchQuery] = useState('')` | `App.jsx` → контролируемый input в `SearchBar`, фильтрация на лету |
| 4 | Фильтр по жанру | `const [selectedCategory, setSelectedCategory] = useState('Все')` | `App.jsx` → `CategoryFilter`, активный жанр подсвечен |
| 5 | Пагинация каталога | `const [currentPage, setCurrentPage] = useState(1)` | `App.jsx` → `Pagination` (4 фильма на странице, «Назад» / «Вперёд» блокируются на границах) |
| 6 | Количество билетов на премьеру | `const [quantity, setQuantity] = useState(1)` | `QuantitySelector` внутри окна фильма, не меньше 1 и не больше 10, считает итоговую сумму |
| 7 | Избранное | `const [isFavorite, setIsFavorite] = useState(false)` | `FavoriteButton` на постере; меняет вид сердечка и через `onToggle` обновляет счётчик в шапке (`favoriteIds` в `App.jsx`) |
| 8 | Сортировка каталога | `const [sortBy, setSortBy] = useState('rating-desc')` | `App.jsx` → `<select>` в `SortDropdown`: по рейтингу, году, названию |

При смене поиска, жанра или сортировки каталог возвращается на первую страницу.

## ДЗ №4 — жизненный цикл и побочные эффекты (useEffect)

Данные приходят из имитации сервера [`src/api/cinemaApi.js`](src/api/cinemaApi.js): `setTimeout` со случайной задержкой 300–900 мс и поддержкой `AbortSignal`.

| # | Сценарий | Зависимости | Где |
|---|---|---|---|
| 1 | Загрузка жанров, статистики и отзывов при монтировании (со скелетонами) | `[]` | `App.jsx` |
| 2 | Сохранение избранного в `localStorage` | `[favoriteIds, isStorageReady]` | `App.jsx` |
| 3 | Восстановление избранного и темы из `localStorage` при старте | `[]` | `App.jsx` |
| 4 | `document.title`: «Каталог — Драма \| CineVibe», «Интерстеллар — смотреть онлайн \| CineVibe» | `[isModalOpen, selectedMovie, selectedCategory]` | `App.jsx` |
| 5 | Debounce-поиск: запрос через 500 мс после окончания ввода, `clearTimeout` в очистке | `[searchQuery]` | `App.jsx` |
| 6 | Таймер акции «Premium за полцены», `setInterval` + `clearInterval` | `[isExpired]` | `PromoBanner.jsx` |
| 7 | `resize`: при ширине < 768px — бургер-меню | `[]` | `Header.jsx` |
| 8 | Закрытие меню профиля по клику вне его | `[isMenuOpen]` | `UserProfile.jsx` |
| 9 | Загрузка каталога при смене жанра, страницы, поиска, сортировки | `[catalogRequestKey]` | `App.jsx` |
| 10 | Прокрутка к началу каталога при смене страницы | `[currentPage]` | `App.jsx` |
| 11 | Закрытие модальных окон по Escape | `[isOpen, onClose]` | `Modal.jsx` |
| 12 | Тост «Фильм добавлен в избранное», скрывается через 3 с | `[toast, onClose]` | `Toast.jsx` |
| 13 | `AbortController`: отмена устаревшего запроса каталога (защита от гонки) | в эффекте #9 | `App.jsx` |
| 14 | Полоса прогресса прокрутки страницы | `[]` | `ScrollProgress.jsx` |
| 15 | Синхронизация темы с `prefers-color-scheme`, пока пользователь не выбрал тему сам | `[]` | `App.jsx` |

Каждый эффект отмечен в коде комментарием `ДЗ №4 · #N` (в `App.jsx` — `#N`).

## ДЗ №5 — глобальное состояние с помощью Context API

Все три провайдера оборачивают приложение в [`src/App.jsx`](src/App.jsx): `ThemeProvider` → `AuthProvider` → `CartProvider` → `HomePage`.
Каждый контекст лежит в своей папке `src/context/<имя>/` и состоит из трёх файлов: сам контекст (`createContext`), провайдер и кастомный хук. Хук выбрасывает понятную ошибку, если его вызвали вне провайдера.

| Контекст | Что хранит | Методы и вычисляемые значения | Где используется хук |
|---|---|---|---|
| `ThemeContext` | `theme` (`'light'` / `'dark'`) | `toggleTheme` (сохраняет выбор в localStorage), `isDarkMode` | `useTheme()`: Header (переключатель, логотип), Card (`card--light/dark`), Footer (`footer--light/dark`, логотип), HomePage (класс темы на обёртке) |
| `AuthContext` | `user` или `null`, `isAuthenticated` | `login(userData)`, `logout()`; при старте `useEffect` имитирует проверку сохранённого токена (`fetchSession`) | `useAuth()`: Header («Войти» или аватар с меню «Выйти»), ReviewForm (гость не может оставить отзыв), TicketsModal (оформление только после входа), LoginModal |
| `CartContext` → «Мои билеты» | `cartItems` — билеты на показы в зале CineVibe Hall | `addToCart`, `removeFromCart`, `updateQuantity`, `clearCart`; `totalCount` и `totalPrice` считаются в провайдере | `useCart()`: Header (счётчик и сумма), Card (кнопка «+ 2 500 ₸»), QuickViewModal (выбор количества), TicketsModal (сама корзина) |

Как проверить на сайте:

1. **Тема** — кнопка ☀/☾: меняются цвета, логотипы в шапке и подвале, классы карточек и подвала; выбор сохраняется после перезагрузки.
2. **Вход** — «Войти» в шапке (поля заполнены демо-данными). После входа в шапке аватар, в блоке отзывов открывается форма. После перезагрузки сессия восстанавливается; «Выйти» — в меню аватара.
3. **Билеты** — «+ 2 500 ₸» на карточке или выбор количества в окне фильма → счётчик в шапке. В корзине можно менять количество, удалять, очищать; «Оформить» для гостя сначала просит войти.

Prop drilling, который был в ДЗ №3–4 (`isDarkMode`, `logoSrc`, `onToggleTheme`, `user` передавались из App в Header и Footer), убран: эти компоненты берут данные из контекстов сами.

## Структура

```
src/
├── api/            # имитация сервера: загрузка с задержкой и отменой, проверка сессии
├── components/     # компоненты, каждый в своей папке со своими стилями
├── context/        # ДЗ №5: theme/, auth/, cart/ — контекст, провайдер и хук в каждой
├── data/           # моковые данные: фильмы, навигация, статистика, отзывы
├── pages/          # HomePage — состояние и разметка главной страницы
├── utils/          # форматирование, поиск и сортировка, localStorage, генерация постеров и аватаров
├── App.jsx         # провайдеры контекстов вокруг страницы
└── index.css       # дизайн-токены (CSS-переменные) и базовые стили
```
