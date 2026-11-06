import './TaskItem.css'

/**
 * Одна задача: чекбокс выполнения, название и кнопка удаления.
 * @param {{
 *   task: import('../../utils/tasks.js').Task,
 *   onToggle: (id: number) => void,
 *   onDelete: (id: number) => void,
 * }} props
 */
function TaskItem({ task, onToggle, onDelete }) {
  return (
    <div className={`task-item${task.isCompleted ? ' task-item--completed' : ''}`}>
      <label className="task-item__label">
        <input
          className="task-item__checkbox"
          type="checkbox"
          checked={task.isCompleted}
          onChange={() => onToggle(task.id)}
        />
        <span className="task-item__title">{task.title}</span>
      </label>
      <button
        type="button"
        className="task-item__delete"
        aria-label={`Удалить задачу ${task.title}`}
        onClick={() => onDelete(task.id)}
      >
        Удалить
      </button>
    </div>
  )
}

export default TaskItem
