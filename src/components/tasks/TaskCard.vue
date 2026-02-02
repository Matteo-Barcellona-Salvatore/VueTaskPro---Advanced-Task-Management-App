<script setup lang="ts">
import { computed } from 'vue'
import { format } from 'date-fns'
import { Calendar, Tag, Edit, Trash2 } from 'lucide-vue-next'
import type { Task } from '@/types/task'

const props = defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  edit: [task: Task]
  delete: [id: string]
}>()

const priorityColors = {
  low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  urgent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
}

const statusColors = {
  todo: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  done: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
}

const formattedDate = computed(() => {
  return props.task.dueDate ? format(new Date(props.task.dueDate), 'MMM dd, yyyy') : null
})
</script>

<template>
  <div class="card hover:shadow-lg transition-all duration-200 animate-fade-in">
    <div class="flex items-start justify-between mb-3">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ task.title }}</h3>
      <div class="flex gap-2">
        <button
          @click="emit('edit', task)"
          class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
        >
          <Edit :size="16" class="text-gray-600 dark:text-gray-400" />
        </button>
        <button
          @click="emit('delete', task.id)"
          class="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
        >
          <Trash2 :size="16" class="text-red-600 dark:text-red-400" />
        </button>
      </div>
    </div>
    
    <p class="text-gray-600 dark:text-gray-300 mb-4">{{ task.description }}</p>
    
    <div class="flex flex-wrap gap-2 mb-3">
      <span :class="priorityColors[task.priority]" class="px-2 py-1 text-xs font-medium rounded-full">
        {{ task.priority.toUpperCase() }}
      </span>
      <span :class="statusColors[task.status]" class="px-2 py-1 text-xs font-medium rounded-full">
        {{ task.status.replace('_', ' ').toUpperCase() }}
      </span>
    </div>
    
    <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
      <div v-if="formattedDate" class="flex items-center gap-1">
        <Calendar :size="14" />
        <span>{{ formattedDate }}</span>
      </div>
      
      <div v-if="task.tags.length > 0" class="flex items-center gap-1">
        <Tag :size="14" />
        <span>{{ task.tags.join(', ') }}</span>
      </div>
    </div>
  </div>
</template>