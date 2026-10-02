# CineVibe — онлайн-кинотеатр

Семестровый проект по React (Vite + JavaScript). Тема: **Киносайт / Онлайн-кинотеатр**.

## Запуск

```bash
npm install
npm run dev      # режим разработки
npm run build    # production-сборка
npm run lint     # проверка кода (oxlint)
```

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

## Структура

```
src/
├── components/     # 16 компонентов: 15 из задания + Header, каждый в своей папке со своими стилями
├── data/           # моковые данные: фильмы, навигация, статистика, отзывы
├── utils/          # форматирование чисел и дат, генерация постеров и аватаров
├── App.jsx         # сборка страницы
└── index.css       # дизайн-токены (CSS-переменные) и базовые стили
```
