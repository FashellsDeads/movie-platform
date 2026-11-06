// ДЗ №10 — адреса публичного API пользователей. Сами запросы выполняет хук useFetch.
const API_URL = 'https://jsonplaceholder.typicode.com'

export const USERS_URL = `${API_URL}/users`

/** @param {string} id */
export const getUserUrl = (id) => `${USERS_URL}/${encodeURIComponent(id)}`

/** @param {string} id */
export const getUserPostsUrl = (id) => `${getUserUrl(id)}/posts`
