// ДЗ №11 — фильтры Task Manager. Подписи на кнопках совпадают со значениями.

export const TASK_FILTERS = ['All', 'Active', 'Completed']

/**
 * @typedef {Object} Task
 * @property {number} id
 * @property {string} title — название
 * @property {boolean} isCompleted — выполнена ли
 */

/**
 * Задачи для выбранного фильтра.
 * @param {Task[]} tasks
 * @param {string} filter — значение из TASK_FILTERS
 * @returns {Task[]}
 */
export function filterTasks(tasks, filter) {
  if (filter === 'Active') return tasks.filter((task) => !task.isCompleted)
  if (filter === 'Completed') return tasks.filter((task) => task.isCompleted)
  return tasks
}
