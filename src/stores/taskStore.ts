import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Task, TaskFilter, TaskStats, TaskStatus, TaskPriority } from '@/types/task'
import { useLocalStorage } from '@vueuse/core'

export const useTaskStore = defineStore('tasks', () => {
  // State
  const tasks = useLocalStorage<Task[]>('vue-tasks', [])
  const filter = ref<TaskFilter>({})

  // Getters
  const filteredTasks = computed(() => {
    let result = [...tasks.value]

    if (filter.value.status) {
      result = result.filter(task => task.status === filter.value.status)
    }

    if (filter.value.priority) {
      result = result.filter(task => task.priority === filter.value.priority)
    }

    if (filter.value.search) {
      const search = filter.value.search.toLowerCase()
      result = result.filter(task =>
        task.title.toLowerCase().includes(search) ||
        task.description.toLowerCase().includes(search)
      )
    }

    if (filter.value.tags && filter.value.tags.length > 0) {
      result = result.filter(task =>
        filter.value.tags!.some(tag => task.tags.includes(tag))
      )
    }

    return result
  })

  const tasksByStatus = computed(() => {
    return {
      todo: tasks.value.filter(t => t.status === 'todo'),
      in_progress: tasks.value.filter(t => t.status === 'in_progress'),
      done: tasks.value.filter(t => t.status === 'done')
    }
  })

  const stats = computed<TaskStats>(() => {
    const total = tasks.value.length
    const completed = tasks.value.filter(t => t.status === 'done').length
    const inProgress = tasks.value.filter(t => t.status === 'in_progress').length
    const todo = tasks.value.filter(t => t.status === 'todo').length

    const byPriority = tasks.value.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1
      return acc
    }, {} as Record<TaskPriority, number>)

    return {
      total,
      completed,
      inProgress,
      todo,
      byPriority,
      completionRate: total > 0 ? (completed / total) * 100 : 0
    }
  })

  const allTags = computed(() => {
    const tagSet = new Set<string>()
    tasks.value.forEach(task => {
      task.tags.forEach(tag => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
  })

  // Actions
  function addTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'completedAt'>) {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: null
    }
    tasks.value.push(newTask)
  }

  function updateTask(id: string, updates: Partial<Task>) {
    const index = tasks.value.findIndex(t => t.id === id)
    if (index !== -1) {
      tasks.value[index] = {
        ...tasks.value[index],
        ...updates,
        updatedAt: new Date().toISOString(),
        completedAt: updates.status === 'done' ? new Date().toISOString() : tasks.value[index].completedAt
      }
    }
  }

  function deleteTask(id: string) {
    const index = tasks.value.findIndex(t => t.id === id)
    if (index !== -1) {
      tasks.value.splice(index, 1)
    }
  }

  function updateFilter(newFilter: TaskFilter) {
    filter.value = { ...filter.value, ...newFilter }
  }

  function clearFilter() {
    filter.value = {}
  }

  function initializeDemoData() {
    if (tasks.value.length === 0) {
      const demoTasks: Task[] = [
        {
          id: '1',
          title: 'Setup project repository',
          description: 'Initialize Git repo and setup CI/CD pipeline',
          status: 'done',
          priority: 'high',
          dueDate: '2025-01-15',
          tags: ['setup', 'devops'],
          createdAt: '2025-01-01T10:00:00Z',
          updatedAt: '2025-01-10T15:30:00Z',
          completedAt: '2025-01-10T15:30:00Z'
        },
        {
          id: '2',
          title: 'Implement authentication',
          description: 'Add JWT-based authentication system',
          status: 'in_progress',
          priority: 'urgent',
          dueDate: '2025-02-05',
          tags: ['backend', 'security'],
          createdAt: '2025-01-05T09:00:00Z',
          updatedAt: '2025-01-20T14:00:00Z',
          completedAt: null
        },
        {
          id: '3',
          title: 'Design database schema',
          description: 'Create ERD and database migration scripts',
          status: 'todo',
          priority: 'medium',
          dueDate: '2025-02-10',
          tags: ['database', 'design'],
          createdAt: '2025-01-15T11:00:00Z',
          updatedAt: '2025-01-15T11:00:00Z',
          completedAt: null
        },
        {
          id: '4',
          title: 'Create API documentation',
          description: 'Write comprehensive API docs with Swagger',
          status: 'todo',
          priority: 'low',
          dueDate: '2025-02-20',
          tags: ['documentation', 'api'],
          createdAt: '2025-01-18T09:00:00Z',
          updatedAt: '2025-01-18T09:00:00Z',
          completedAt: null
        },
        {
          id: '5',
          title: 'Implement real-time notifications',
          description: 'Add WebSocket support for live updates',
          status: 'in_progress',
          priority: 'high',
          dueDate: '2025-02-08',
          tags: ['backend', 'realtime'],
          createdAt: '2025-01-12T14:00:00Z',
          updatedAt: '2025-01-22T16:00:00Z',
          completedAt: null
        }
      ]
      tasks.value = demoTasks
    }
  }

  return {
    tasks,
    filter,
    filteredTasks,
    tasksByStatus,
    stats,
    allTags,
    addTask,
    updateTask,
    deleteTask,
    updateFilter,
    clearFilter,
    initializeDemoData
  }
})