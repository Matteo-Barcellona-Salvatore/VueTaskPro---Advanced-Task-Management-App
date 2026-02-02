<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { X } from 'lucide-vue-next'
import type { Task } from '@/types/task'
import { TaskStatus, TaskPriority } from '@/types/task'

const props = defineProps<{
  task?: Task
  show: boolean
}>()

const emit = defineEmits<{
  close: []
  save: [task: Partial<Task>]
}>()

const form = reactive({
  title: '',
  description: '',
  status: TaskStatus.TODO,
  priority: TaskPriority.MEDIUM,
  dueDate: '',
  tags: '' as string
})

watch(() => props.task, (newTask) => {
  if (newTask) {
    form.title = newTask.title
    form.description = newTask.description
    form.status = newTask.status
    form.priority = newTask.priority
    form.dueDate = newTask.dueDate || ''
    form.tags = newTask.tags.join(', ')
  } else {
    resetForm()
  }
}, { immediate: true })

function resetForm() {
  form.title = ''
  form.description = ''
  form.status = TaskStatus.TODO
  form.priority = TaskPriority.MEDIUM
  form.dueDate = ''
  form.tags = ''
}

function handleSubmit() {
  const taskData = {
    title: form.title,
    description: form.description,
    status: form.status,
    priority: form.priority,
    dueDate: form.dueDate || null,
    tags: form.tags.split(',').map(t => t.trim()).filter(Boolean)
  }
  
  emit('save', taskData)
  resetForm()
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div v-if="show" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" @click="emit('close')">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-in" @click.stop>
          <div class="p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ task ? 'Edit Task' : 'New Task' }}
              </h2>
              <button @click="emit('close')" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <X :size="20" />
              </button>
            </div>
            
            <form @submit.prevent="handleSubmit" class="space-y-4">
              <div>
                <label class="label">Title</label>
                <input v-model="form.title" type="text" required class="input" placeholder="Task title" />
              </div>
              
              <div>
                <label class="label">Description</label>
                <textarea v-model="form.description" rows="3" class="input" placeholder="Task description"></textarea>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="label">Status</label>
                  <select v-model="form.status" class="input">
                    <option :value="TaskStatus.TODO">To Do</option>
                    <option :value="TaskStatus.IN_PROGRESS">In Progress</option>
                    <option :value="TaskStatus.DONE">Done</option>
                  </select>
                </div>
                
                <div>
                  <label class="label">Priority</label>
                  <select v-model="form.priority" class="input">
                    <option :value="TaskPriority.LOW">Low</option>
                    <option :value="TaskPriority.MEDIUM">Medium</option>
                    <option :value="TaskPriority.HIGH">High</option>
                    <option :value="TaskPriority.URGENT">Urgent</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label class="label">Due Date</label>
                <input v-model="form.dueDate" type="date" class="input" />
              </div>
              
              <div>
                <label class="label">Tags (comma separated)</label>
                <input v-model="form.tags" type="text" class="input" placeholder="frontend, urgent, bug" />
              </div>
              
              <div class="flex gap-3 justify-end pt-4">
                <button type="button" @click="emit('close')" class="btn-secondary">
                  Cancel
                </button>
                <button type="submit" class="btn-primary">
                  {{ task ? 'Update' : 'Create' }} Task
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>