export const SITE_NAME = 'CineVibe'

// Ссылки ведут на маршруты React Router
export const navItems = [
  { id: 'home', label: 'Главная', link: '/' },
  { id: 'products', label: 'Каталог', link: '/products' },
  { id: 'favorites', label: 'Избранное', link: '/favorites' },
  { id: 'about', label: 'О кинотеатре', link: '/about' },
]

export const footerLinks = [
  { id: 'products', label: 'Каталог', link: '/products' },
  { id: 'cart', label: 'Корзина', link: '/cart' },
  { id: 'profile', label: 'Личный кабинет', link: '/profile' },
  { id: 'about', label: 'О кинотеатре', link: '/about' },
]

export const cinemaInfo = {
  address: 'Алматы, пр. Абая, 52 — ТРЦ «Керемет», 3 этаж',
  phone: '+7 (727) 355-00-55',
  email: 'hello@cinevibe.kz',
  hours: 'Ежедневно с 10:00 до 02:00',
}

// Варианты для radio «Пол» в форме регистрации
export const genders = [
  { value: 'male', label: 'Мужской' },
  { value: 'female', label: 'Женский' },
  { value: 'unspecified', label: 'Не указывать' },
]

export const hero = {
  eyebrow: 'Кинотеатр в Алматы · Dolby Atmos · VIP-зал',
  heading: 'Кино на большом экране — билеты и попкорн в одной корзине',
  subheading: 'Выберите сеанс, добавьте комбо из кинобара и приходите к началу фильма: всё уже будет готово.',
}

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
