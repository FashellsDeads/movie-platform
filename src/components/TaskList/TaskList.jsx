import TaskItem from '../TaskItem/TaskItem.jsx'
import './TaskList.css'

/**
 * Список задач через map(). Если показывать нечего — текст emptyText.
 * @param {{
 *   tasks: import('../../utils/tasks.js').Task[],
 *   emptyText: string,
 *   onToggle: (id: number) => void,
 *   onDelete: (id: number) => void,
 * }} props
 */
function TaskList({ tasks, emptyText, onToggle, onDelete }) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-state__title">{emptyText}</p>
      </div>
    )
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task.id}>
          <TaskItem task={task} onToggle={onToggle} onDelete={onDelete} />
        </li>
      ))}
    </ul>
  )
}

export default TaskList
