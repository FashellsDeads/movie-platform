// ДЗ №9 — «каталог товаров» в кинотеатре: меню кинобара и мерч (24 позиции)

export const ALL_BAR_CATEGORIES = 'Все категории'

export const barCategories = [ALL_BAR_CATEGORIES, 'Попкорн', 'Напитки', 'Снеки', 'Комбо', 'Мерч']

/**
 * @typedef {Object} Product
 * @property {number} id
 * @property {string} name
 * @property {string} category
 * @property {number} price — цена в тенге
 * @property {number} rating — оценка гостей от 1 до 5
 */

/** @type {Product[]} */
export const barProducts = [
  { id: 1, name: 'Попкорн солёный S', category: 'Попкорн', price: 990, rating: 4.6 },
  { id: 2, name: 'Попкорн солёный L', category: 'Попкорн', price: 1590, rating: 4.7 },
  { id: 3, name: 'Попкорн карамельный M', category: 'Попкорн', price: 1490, rating: 4.8 },
  { id: 4, name: 'Попкорн сырный M', category: 'Попкорн', price: 1490, rating: 4.4 },
  { id: 5, name: 'Попкорн «Сладкий и солёный» L', category: 'Попкорн', price: 1890, rating: 4.9 },
  { id: 6, name: 'Кола 0,5 л', category: 'Напитки', price: 690, rating: 4.5 },
  { id: 7, name: 'Лимонад «Тархун» 0,5 л', category: 'Напитки', price: 750, rating: 4.3 },
  { id: 8, name: 'Холодный чай с персиком', category: 'Напитки', price: 790, rating: 4.2 },
  { id: 9, name: 'Вода без газа 0,5 л', category: 'Напитки', price: 390, rating: 4.0 },
  { id: 10, name: 'Молочный коктейль ванильный', category: 'Напитки', price: 1290, rating: 4.7 },
  { id: 11, name: 'Капучино', category: 'Напитки', price: 990, rating: 4.4 },
  { id: 12, name: 'Начос с сырным соусом', category: 'Снеки', price: 1690, rating: 4.6 },
  { id: 13, name: 'Хот-дог классический', category: 'Снеки', price: 1390, rating: 4.1 },
  { id: 14, name: 'Драже шоколадное 45 г', category: 'Снеки', price: 590, rating: 4.5 },
  { id: 15, name: 'Чипсы картофельные', category: 'Снеки', price: 790, rating: 4.0 },
  { id: 16, name: 'Мармелад «Кислые червячки»', category: 'Снеки', price: 650, rating: 4.3 },
  { id: 17, name: 'Комбо «Соло»: попкорн M + напиток', category: 'Комбо', price: 1990, rating: 4.6 },
  { id: 18, name: 'Комбо «На двоих»: попкорн L + 2 напитка', category: 'Комбо', price: 2790, rating: 4.8 },
  { id: 19, name: 'Комбо «Начос-пати»', category: 'Комбо', price: 2990, rating: 4.5 },
  { id: 20, name: 'Комбо «Семейное»', category: 'Комбо', price: 4490, rating: 4.7 },
  { id: 21, name: 'Футболка CineVibe', category: 'Мерч', price: 7990, rating: 4.4 },
  { id: 22, name: 'Кружка «Тишина в зале»', category: 'Мерч', price: 3490, rating: 4.6 },
  { id: 23, name: 'Брелок-хлопушка', category: 'Мерч', price: 1290, rating: 3.9 },
  { id: 24, name: 'Подарочная карта на 2 билета', category: 'Мерч', price: 5000, rating: 4.9 },
]

export const barSortOptions = [
  { value: 'rating-desc', label: 'По рейтингу' },
  { value: 'price-asc', label: 'Сначала дешевле' },
  { value: 'price-desc', label: 'Сначала дороже' },
]
