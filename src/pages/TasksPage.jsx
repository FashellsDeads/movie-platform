import { useRef, useState } from 'react'
import Container from '../components/Container/Container.jsx'
import SectionHeader from '../components/SectionHeader/SectionHeader.jsx'
import TaskFilter from '../components/TaskFilter/TaskFilter.jsx'
import TaskForm from '../components/TaskForm/TaskForm.jsx'
import TaskList from '../components/TaskList/TaskList.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { filterTasks } from '../utils/tasks.js'
import './TasksPage.css'

/**
 * Страница «/tasks» — Task Manager (ДЗ №11). Здесь хранится всё состояние: задачи и фильтр,
 * а TaskForm, TaskFilter и TaskList получают данные и обработчики через props.
 */
function TasksPage() {
  useDocumentTitle('Задачи')

  const [tasks, setTasks] = useState([])
  const [filter, setFilter] = useState('All')
  const nextId = useRef(1)

  const addTask = (title) => {
    const id = nextId.current
    nextId.current += 1
    setTasks((prev) => [...prev, { id, title, isCompleted: false }])
  }

  const toggleTask = (id) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, isCompleted: !task.isCompleted } : task)))
  }

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  return (
    <section className="page">
      <Container>
        <div className="tasks">
          <SectionHeader title="Задачи" subtitle="Task Manager: добавляйте задачи, отмечайте выполненные, фильтруйте." />
          <TaskForm onAdd={addTask} />
          <TaskFilter value={filter} onChange={setFilter} />
          <TaskList
            tasks={filterTasks(tasks, filter)}
            emptyText={tasks.length === 0 ? 'Задач пока нет' : 'В этом фильтре задач нет'}
            onToggle={toggleTask}
            onDelete={deleteTask}
          />
        </div>
      </Container>
    </section>
  )
}

export default TasksPage
