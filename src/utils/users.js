// ДЗ №10 — чистые функции для каталога пользователей: работают с уже полученными
// данными, поэтому поиск и фильтр не делают новых запросов к API.

export const ALL_COMPANIES = 'Все компании'

/**
 * Названия компаний для select: без повторов и по алфавиту.
 * @param {Array<{ company: { name: string } }>} users
 * @returns {string[]}
 */
export function getCompanies(users) {
  const names = users.map((user) => user.company.name)
  return [...new Set(names)].sort((a, b) => a.localeCompare(b))
}

/**
 * Поиск по имени + фильтр по компании.
 * @template {{ name: string, company: { name: string } }} User
 * @param {User[]} users
 * @param {{ search: string, company: string }} filters
 * @returns {User[]}
 */
export function filterUsers(users, { search, company }) {
  const normalizedSearch = search.trim().toLowerCase()

  return users
    .filter((user) => company === ALL_COMPANIES || user.company.name === company)
    .filter((user) => user.name.toLowerCase().includes(normalizedSearch))
}
