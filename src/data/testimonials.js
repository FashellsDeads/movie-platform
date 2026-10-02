import { createAvatar } from '../utils/placeholders.js'

export const testimonials = [
  {
    id: 1,
    authorName: 'Айгерим Нурланова',
    authorRole: 'Подписчица с 2023 года',
    avatar: createAvatar('АН', '#7c3aed'),
    text: 'Наконец-то нашла сервис, где классика и новинки собраны в одном месте. Качество картинки отличное даже на телевизоре.',
    date: '2026-09-14',
  },
  {
    id: 2,
    authorName: 'Джамалов Ильяс',
    authorRole: 'Кинокритик, блогер',
    avatar: createAvatar('ДИ', '#0891b2'),
    text: 'Удобные подборки по жанрам и честные рейтинги зрителей. Смотрю здесь всё, о чём пишу в обзорах.',
    date: '2026-09-02',
  },
  {
    id: 3,
    authorName: 'Арина Ким',
    authorRole: 'Premium-подписчица',
    avatar: createAvatar('АК', '#ea580c'),
    text: 'Скачиваю фильмы перед перелётом и смотрю без интернета. Детям нравится раздел с анимацией.',
    date: '2026-08-21',
  },
]
