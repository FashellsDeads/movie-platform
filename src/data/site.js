import { createAvatar } from '../utils/placeholders.js'

export const SITE_NAME = 'CineVibe'

export const navItems = [
  { id: 'home', label: 'Главная', link: '#home' },
  { id: 'catalog', label: 'Каталог', link: '#catalog' },
  { id: 'stats', label: 'Статистика', link: '#stats' },
  { id: 'reviews', label: 'Отзывы', link: '#reviews' },
]

export const currentUser = {
  name: 'Жумагали Адильжан',
  avatarUrl: createAvatar('ЖА', '#e11d48'),
  role: 'Premium-подписчик',
  email: '39088@iitu.edu.kz',
}

export const hero = {
  heading: 'Кино, которое хочется пересматривать',
  subheading:
    'Тысячи фильмов в 4K без рекламы. Новинки каждую неделю — смотрите дома, в дороге и на любом устройстве.',
  buttonText: 'Смотреть «Дюну» сейчас',
}

export const promo = {
  title: 'Premium за полцены',
  text: 'Первый месяц подписки — 1 245 ₸ вместо 2 490 ₸. Успейте, пока идёт таймер.',
  buttonText: 'Забрать скидку',
  durationSeconds: 10 * 60,
}

export const stats = [
  { id: 'titles', title: 'Фильмов в каталоге', value: 12480, change: 8.2, isPositive: true },
  { id: 'online', title: 'Зрителей онлайн', value: 3215, change: 12.5, isPositive: true },
  { id: 'premieres', title: 'Премьер за месяц', value: 146, change: 3.1, isPositive: false },
  { id: 'rating', title: 'Средняя оценка', value: 4.6, change: 0.4, isPositive: true },
]

export const premiumBenefits = [
  'Весь каталог в качестве 4K HDR',
  'Без рекламы и ограничений',
  'Просмотр на 5 устройствах одновременно',
  'Скачивание фильмов для офлайн-просмотра',
]

// icon — данные для атрибута d у <path> (иконки нарисованы линиями 24×24)
export const socialLinks = [
  {
    platform: 'Telegram',
    url: 'https://t.me/',
    icon: 'M21 4 3 11l6 2.2L18 7l-7 7.5V20l3.2-3.6L18 20z',
  },
  {
    platform: 'YouTube',
    url: 'https://youtube.com/',
    icon: 'M3 8a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3zM10 9l5 3-5 3z',
  },
  {
    platform: 'Instagram',
    url: 'https://instagram.com/',
    icon: 'M7.5 3h9A4.5 4.5 0 0 1 21 7.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3zM12 8.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6zM17.2 6.8h.01',
  },
]
