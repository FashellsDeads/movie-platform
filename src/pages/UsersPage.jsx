import { useState } from 'react'
import { USERS_URL } from '../api/usersApi.js'
import Button from '../components/Button/Button.jsx'
import Container from '../components/Container/Container.jsx'
import ErrorState from '../components/ErrorState/ErrorState.jsx'
import SearchBar from '../components/SearchBar/SearchBar.jsx'
import SectionHeader from '../components/SectionHeader/SectionHeader.jsx'
import SortDropdown from '../components/SortDropdown/SortDropdown.jsx'
import UserList from '../components/UserList/UserList.jsx'
import { useDebounce } from '../hooks/useDebounce.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { useFetch } from '../hooks/useFetch.js'
import { ALL_COMPANIES, filterUsers, getCompanies } from '../utils/users.js'
import './UsersPage.css'

const SEARCH_DELAY_MS = 500

/**
 * Страница «/users» — каталог пользователей (ДЗ №10). Загрузку, ошибку и повтор запроса
 * берёт из useFetch, поиск и фильтр работают на уже полученных данных.
 */
function UsersPage() {
  useDocumentTitle('Пользователи')

  const { data, loading, error, refetch } = useFetch(USERS_URL)
  const [search, setSearch] = useState('')
  const [company, setCompany] = useState(ALL_COMPANIES)
  const debouncedSearch = useDebounce(search, SEARCH_DELAY_MS)

  const users = data ?? []
  const companyOptions = [ALL_COMPANIES, ...getCompanies(users)].map((name) => ({ value: name, label: name }))
  // Пустое поле — это не поиск: полный список возвращается сразу, без задержки
  const foundUsers = filterUsers(users, { search: search ? debouncedSearch : '', company })

  const clearSearch = () => {
    setSearch('')
    setCompany(ALL_COMPANIES)
  }

  return (
    <section className="page">
      <Container>
        <SectionHeader title="Пользователи" subtitle="Каталог пользователей из публичного API JSONPlaceholder." />

        {!error && (
          <div className="users-toolbar">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Поиск по имени…"
              label="Поиск пользователей"
              hasClearButton={false}
            />
            <SortDropdown options={companyOptions} value={company} onChange={setCompany} label="Компания" />
            <Button
              text="Очистить поиск"
              variant="secondary"
              isDisabled={!search && company === ALL_COMPANIES}
              onClick={clearSearch}
            />
            <Button text="Повторить запрос" variant="secondary" isDisabled={loading} onClick={refetch} />
          </div>
        )}

        {loading && (
          <p className="users-status" role="status">
            Загрузка...
          </p>
        )}
        {error && <ErrorState message={error} retryText="Повторить запрос" onRetry={refetch} />}
        {data && <UserList users={foundUsers} />}
      </Container>
    </section>
  )
}

export default UsersPage
