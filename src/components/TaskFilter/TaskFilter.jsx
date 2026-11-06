import { TASK_FILTERS } from '../../utils/tasks.js'
import './TaskFilter.css'

/**
 * Кнопки фильтров All / Active / Completed. Выбранный фильтр хранит родитель.
 * @param {{ value: string, onChange: (filter: string) => void }} props
 */
function TaskFilter({ value, onChange }) {
  return (
    <div className="task-filter" role="group" aria-label="Фильтр задач">
      {TASK_FILTERS.map((filter) => (
        <button
          key={filter}
          type="button"
          className={`task-filter__button${filter === value ? ' task-filter__button--active' : ''}`}
          aria-pressed={filter === value}
          onClick={() => onChange(filter)}
        >
          {filter}
        </button>
      ))}
    </div>
  )
}

export default TaskFilter
