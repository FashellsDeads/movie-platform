# CineVibe — магазин кинотеатра

Учебный проект по React: сайт кинотеатра в Алматы. Билеты на сеансы и товары кинобара (попкорн, напитки, комбо, мерч) лежат в одном каталоге, оформляются одной корзиной и попадают в историю заказов в личном кабинете.

React 19 · Vite · React Router 7 · Context + useReducer · Vitest + React Testing Library · oxlint. Сторонних UI-библиотек нет.

## Запуск

```bash
npm install
npm run dev      # режим разработки, http://localhost:5173
npm run build    # production-сборка
npm run preview  # посмотреть сборку
npm run lint     # проверка кода (oxlint)
npm test         # автотесты: 174 теста в 27 файлах
npm run api      # пересобрать JSON каталога в public/api/ из scripts/products.mjs
```

**Демо-аккаунт для входа:** `adilzhan@cinevibe.kz` / `cinevibe`. Можно и зарегистрироваться: аккаунт сохранится в этом браузере.

## Что умеет сайт

| Адрес | Страница |
|---|---|
| `/` | Главная: «Сейчас в прокате», хиты кинобара, расписание на сегодня, отзывы зрителей |
| `/products` | Каталог: поиск с задержкой, разделы «Билеты» и «Кинобар», категории, сортировка. Все параметры хранятся в адресе, поэтому ссылкой на подборку можно поделиться |
| `/products/:id` | Страница товара. У фильма вкладки «Описание / Сеансы / Отзывы» и выбор количества билетов. Кнопка «Назад» и похожие товары |
| `/favorites` | Избранное (сердечко на любой карточке) |
| `/cart` | Корзина: количество, удаление с подтверждением, промокод `CINEVIBE10` (−10%), оформление заказа |
| `/login`, `/register` | Вход и регистрация |
| `/profile` | Личный кабинет, только после входа. Вложенные страницы: `/profile/orders` — заказы, `/profile/settings` — имя и тема |
| `/about` | О кинотеатре: залы, частые вопросы, контакты |
| `/404` и любой неизвестный адрес | Страница «не найдено» |

Старые адреса (`/movies`, `/movie/:id`, `/tickets`, `/bar`) перенаправляют на новые.

## Как устроен проект

```
src/
├── components/
│   ├── common/      Button, Input, Select, Modal, Card, Loader, ErrorMessage, EmptyState, Tabs, Toggle,
│   │                Accordion, DataLoader, withLoading, SearchInput, CustomInput и другие общие компоненты
│   ├── layout/      MainLayout (на Layout), Header, Footer, Navigation, UserMenu, Container
│   ├── product/     ProductCard, ProductList, ProductFilters, ProductDetails, FavoriteButton, ReviewForm
│   ├── cart/        CartItem, CartList, CartSummary, PromoCode
│   ├── forms/       FormProvider (useReducer + Context), DynamicField, SchemaForm, LoginForm, RegisterForm
│   └── home/        HeroSection, TodaySchedule, TestimonialCard
├── pages/           Home, Products, ProductDetails, Favorites, Cart, Profile, Login, Register, About, NotFound
├── hooks/           useFetch, useDebounce, useDocumentTitle, useProductReviews, useToggleFavorite, useLogout, useLayout
├── context/         AuthContext, CartContext (+ cartReducer), FavoritesContext, ThemeContext
├── services/api.js  адреса и запросы к API, имитация сервера учётных записей
├── routes/          AppRoutes, ProtectedRoute
├── utils/           helpers (цены, даты, фильтры каталога, промокоды), formValidation, storage, placeholders
├── tests/           тесты и помощники (renderApp, подмена API)
├── App.jsx          провайдеры и маршруты
└── main.jsx
public/api/          «сервер» каталога: products.json, products/<id>.json, home.json
scripts/             products.mjs — единственный источник данных каталога, build-api.mjs собирает из него JSON
```

- **Данные.** Каталог загружается настоящими запросами `fetch` к JSON в `public/api/` через хук `useFetch`. Каждый товар — отдельный файл, поэтому страница товара делает свой запрос по `id` из адреса. Ответ «не найдено» (и `index.html`, который dev-сервер отдаёт вместо отсутствующего файла) превращается в понятную страницу «Товар не найден».
- **Учётные записи.** Настоящего бэкенда у проекта нет, поэтому вход и регистрацию имитирует `services/api.js`. Аккаунты хранятся в localStorage, пароль — только как SHA-256. Флажок «Запомнить меня» решает, где живёт сессия: в localStorage или только во вкладке (sessionStorage).
- **Состояние.**
  - Корзина — `useReducer` с действиями ADD, REMOVE, SET_QUANTITY, CLEAR, PLACE_ORDER.
  - Избранное хранит только `id`, сами товары берутся из каталога, так что одни и те же данные не дублируются.
  - Формы входа и регистрации описаны массивом полей: `FormProvider` хранит значения через `useReducer`, а `DynamicField` сам выбирает элемент по типу поля.

## Темы курса в проекте

| Тема | Где в проекте |
|---|---|
| Компоненты и props | Все компоненты, JSDoc-описание props |
| useState, useEffect | Формы и UI-состояния; загрузка данных, localStorage, таймеры уведомлений |
| React Router, useParams, useSearchParams, useNavigate | `routes/AppRoutes.jsx`; `/products/:id`; фильтры каталога в адресе; «Назад» и переходы после входа и заказа |
| Outlet, Protected Routes | Каркас `MainLayout`, кабинет `Profile` с вложенными страницами, `ProtectedRoute` с возвратом на нужную страницу после входа |
| Формы, Controlled Components | `LoginForm`, `RegisterForm` (input, select, checkbox, radio, проверка, ошибки, «Сбросить») |
| Uncontrolled + ref | «Имя в профиле» в `/profile/settings` (`defaultValue`, значение читается при сохранении) |
| forwardRef | `SearchInput`: «Изменить запрос» в пустом каталоге ставит фокус в поиск |
| useImperativeHandle | `CustomInput` в промокоде корзины: `getValue`, `clear`, `focus` |
| Context, useReducer | `AuthContext`, `CartContext` + `cartReducer`, `FavoritesContext`, `ThemeContext`, `FormProvider` |
| Custom Hooks, API | `useFetch`, `useDebounce`, `useProductReviews`; `services/api.js` |
| Оптимизация | `React.memo` у `ProductCard` и `CartItem`; `useCallback` у функций, которые к ним уходят; `useMemo` для фильтрации каталога, итогов корзины и списка избранного. У каждого места есть комментарий, зачем оно нужно |
| Компоненты с children, Layout | `Card`, `Modal`, `Layout` (каркас сайта и каталог с боковой колонкой фильтров), `HeroSection` |
| Compound Components | `Tabs` на странице фильма, `Toggle` для промокода, `Accordion` в частых вопросах |
| Render Props, HOC | `DataLoader` на главной, `withLoading(ProductList)` в каталоге |
| Тестирование | `src/tests/`: каталог, поиск, товар, корзина, удаление, промокод, регистрация, вход, защищённый профиль, все маршруты и перенаправления, компоненты, хуки, reducer'ы |

Состояния загрузки, ошибки и пустого результата одинаково показаны на всех страницах с данными: `Loader`, `ErrorMessage` с кнопкой «Повторить» и `EmptyState`. В тестах сеть заменена теми же JSON из `public/api/`.

## История домашних заданий

Каждое задание сохранено меткой git: `git checkout hw12`, вернуться — `git checkout main`.

| Метка | Задание |
|---|---|
| `hw2` – `hw6` | Props, useState, useEffect, Context API, React Router |
| `midterm` | Финальная интеграция (ДЗ №7) |
| `hw8` | Формы и управляемые компоненты |
| `hw9` | Оптимизация производительности |
| `hw10` | Кастомные хуки и работа с API |
| `hw11` | Тестирование (Vitest + RTL) |
| `hw12` | Продвинутые паттерны компонентов: демо-страница `/patterns` |
| `hw13` | Формы, ref, State Reducer, Undo/Redo: конструктор форм `/form-builder` |
| `hw14` | Финальный проект: сайт стал магазином кинотеатра (этот README) |

Учебные страницы прошлых заданий (задачи, пользователи, демо-страницы паттернов) в `hw14` не входят. Их компоненты работают в настоящих местах магазина, а сами страницы остались в своих метках.
