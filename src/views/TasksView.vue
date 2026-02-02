<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plus, Search, Filter } from 'lucide-vue-next'
import { useTaskStore } from '@/stores/taskStore'
import TaskCard from '@/components/tasks/TaskCard.vue'
import TaskForm from '@/components/tasks/TaskForm.vue'
import type { Task } from '@/types/task'
import { TaskStatus, TaskPriority } from '@/types/task'

const taskStore = useTaskStore()

const showTaskForm = ref(false)
const editingTask = ref<Task | undefined>()
const searchQuery = ref('')
const selectedStatus = ref<TaskStatus | ''>('')
const selectedPriority = ref<TaskPriority | ''>('')

const filteredTasks = computed(() => {
  let tasks = taskStore.tasks

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    tasks = tasks.filter(task =>
      task.title.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query)
    )
  }

  if (selectedStatus.value) {
    tasks = tasks.filter(task => task.status === selectedStatus.value)
  }

  if (selectedPriority.value) {
    tasks = tasks.filter(task => task.priority === selectedPriority.value)
  }

  return tasks
})

function openNewTaskForm() {
  editingTask.value = undefined
  showTaskForm.value = true
}

function openEditTaskForm(task: Task) {
  editingTask.value = task
  showTaskForm.value = true
}

function handleSaveTask(taskData: Partial<Task>) {
  if (editingTask.value) {
    taskStore.updateTask(editingTask.value.id, taskData)
  } else {
    taskStore.addTask(taskData as Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'completedAt'>)
  }
  showTaskForm.value = false
  editingTask.value = undefined
}

function handleDeleteTask(id: string) {
  if (confirm('Are you sure you want to delete this task?')) {
    taskStore.deleteTask(id)
  }
}

function clearFilters() {
  searchQuery.value = ''
  selectedStatus.value = ''
  selectedPriority.value = ''
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">All Tasks</h2>
        <p class="text-gray-600 dark:text-gray-400">Manage and organize your tasks</p>
      </div>
      <button @click="openNewTaskForm" class="btn-primary flex items-center gap-2">
        <Plus :size="20" />
        New Task
      </button>
    </div>

    <!-- Filters -->
    <div class="card mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="md:col-span-2">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" :size="20" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search tasks..."
              class="input pl-10"
            />
          </div>
        </div>
        
        <select v-model="selectedStatus" class="input">
          <option value="">All Statuses</option>
          <option :value="TaskStatus.TODO">To Do</option>
          <option :value="TaskStatus.IN_PROGRESS">In Progress</option>
          <option :value="TaskStatus.DONE">Done</option>
        </select>
        
        <select v-model="selectedPriority" class="input">
          <option value="">All Priorities</option>
          <option :value="TaskPriority.LOW">Low</option>
          <option :value="TaskPriority.MEDIUM">Medium</option>
          <option :value="TaskPriority.HIGH">High</option>
          <option :value="TaskPriority.URGENT">Urgent</option>
        </select>
      </div>
      
      <div v-if="searchQuery || selectedStatus || selectedPriority" class="mt-4 flex items-center justify-between">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          {{ filteredTasks.length }} task{{ filteredTasks.length !== 1 ? 's' : '' }} found
        </p>
        <button @click="clearFilters" class="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400">
          Clear filters
        </button>
      </div>
    </div>

    <!-- Tasks Grid -->
    <div v-if="filteredTasks.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <TaskCard
        v-for="task in filteredTasks"
        :key="task.id"
        :task="task"
        @edit="openEditTaskForm"
        @delete="handleDeleteTask"
      />
    </div>

    <div v-else class="text-center py-16">
      <Filter :size="48" class="mx-auto text-gray-400 mb-4" />
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">No tasks found</h3>
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        {{ searchQuery || selectedStatus || selectedPriority ? 'Try adjusting your filters' : 'Create your first task to get started' }}
      </p>
      <button v-if="!searchQuery && !selectedStatus && !selectedPriority" @click="openNewTaskForm" class="btn-primary">
        Create Task
      </button>
    </div>

    <!-- Task Form Modal -->
    <TaskForm
      :show="showTaskForm"
      :task="editingTask"
      @close="showTaskForm = false"
      @save="handleSaveTask"
    />
  </div>
</template>