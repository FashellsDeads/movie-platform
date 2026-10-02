import { createPoster } from '../utils/placeholders.js'

export const ALL_CATEGORY = 'Все'

export const categories = [ALL_CATEGORY, 'Фантастика', 'Драма', 'Триллер', 'Комедия', 'Анимация']

// Цвет бейджа зависит от смысла статуса:
// green — новинка, yellow — хит / скоро, red — возрастное ограничение.
export const movies = [
  {
    id: 1,
    title: 'Дюна: Часть вторая',
    description:
      'Пол Атрейдес объединяется с фрименами, чтобы отомстить заговорщикам, уничтожившим его семью.',
    year: 2024,
    genre: 'Фантастика',
    duration: '2 ч 46 мин',
    score: 4.7,
    reviewsCount: 18452,
    status: { label: 'Новинка', colorScheme: 'green' },
    isAvailable: true,
    imageUrl: createPoster('Д', ['#c2410c', '#1c1917']),
  },
  {
    id: 2,
    title: 'Интерстеллар',
    description:
      'Группа исследователей отправляется сквозь червоточину в поисках нового дома для человечества.',
    year: 2014,
    genre: 'Фантастика',
    duration: '2 ч 49 мин',
    score: 4.9,
    reviewsCount: 42310,
    status: { label: 'Хит', colorScheme: 'yellow' },
    isAvailable: true,
    imageUrl: createPoster('И', ['#1e3a8a', '#020617']),
  },
  {
    id: 3,
    title: 'Оппенгеймер',
    description:
      'История физика, который возглавил Манхэттенский проект и навсегда изменил ход истории.',
    year: 2023,
    genre: 'Драма',
    duration: '3 ч 00 мин',
    score: 4.6,
    reviewsCount: 21784,
    status: { label: '16+', colorScheme: 'red' },
    isAvailable: true,
    imageUrl: createPoster('О', ['#b45309', '#171717']),
  },
  {
    id: 4,
    title: 'Джокер',
    description:
      'Неудавшийся комик Артур Флек постепенно превращается в самого опасного преступника Готэма.',
    year: 2019,
    genre: 'Триллер',
    duration: '2 ч 02 мин',
    score: 4.5,
    reviewsCount: 35120,
    status: { label: '18+', colorScheme: 'red' },
    isAvailable: true,
    imageUrl: createPoster('Д', ['#15803d', '#3b0764']),
  },
  {
    id: 5,
    title: '1+1',
    description:
      'Аристократ, прикованный к инвалидному креслу, нанимает в помощники самого неподходящего кандидата.',
    year: 2011,
    genre: 'Комедия',
    duration: '1 ч 52 мин',
    score: 4.8,
    reviewsCount: 39876,
    status: { label: 'Хит', colorScheme: 'yellow' },
    isAvailable: true,
    imageUrl: createPoster('1', ['#0f766e', '#082f49']),
  },
  {
    id: 6,
    title: 'Унесённые призраками',
    description:
      'Десятилетняя Тихиро попадает в волшебный мир духов и должна спасти родителей от колдовства.',
    year: 2001,
    genre: 'Анимация',
    duration: '2 ч 05 мин',
    score: 4.9,
    reviewsCount: 27403,
    status: { label: 'Классика', colorScheme: 'yellow' },
    isAvailable: true,
    imageUrl: createPoster('У', ['#be185d', '#312e81']),
  },
  {
    id: 7,
    title: 'Головоломка 2',
    description:
      'В голове повзрослевшей Райли появляются новые эмоции — и главная из них, Тревожность.',
    year: 2024,
    genre: 'Анимация',
    duration: '1 ч 36 мин',
    score: 4.4,
    reviewsCount: 12650,
    status: { label: 'Новинка', colorScheme: 'green' },
    isAvailable: true,
    imageUrl: createPoster('Г', ['#7c3aed', '#0e7490']),
  },
  {
    id: 8,
    title: 'Паразиты',
    description:
      'Бедная семья хитростью устраивается работать в богатый дом, но у этого дома есть свои тайны.',
    year: 2019,
    genre: 'Триллер',
    duration: '2 ч 12 мин',
    score: 4.6,
    reviewsCount: 24518,
    status: { label: '18+', colorScheme: 'red' },
    isAvailable: true,
    imageUrl: createPoster('П', ['#4d7c0f', '#1c1917']),
  },
  {
    id: 9,
    title: 'Проект «Конец света»',
    description:
      'Учитель естествознания просыпается на космическом корабле и понимает, что от него зависит судьба Земли.',
    year: 2026,
    genre: 'Фантастика',
    duration: '2 ч 36 мин',
    score: 4.5,
    reviewsCount: 3120,
    status: { label: 'Скоро', colorScheme: 'yellow' },
    isAvailable: false,
    imageUrl: createPoster('П', ['#0369a1', '#1e1b4b']),
  },
]
