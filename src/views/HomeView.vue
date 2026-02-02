<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { CheckCircle2, Clock, ListTodo, TrendingUp, Plus } from 'lucide-vue-next'
import { useTaskStore } from '@/stores/taskStore'
import StatsCard from '@/components/dashboard/StatsCard.vue'
import TaskChart from '@/components/dashboard/TaskChart.vue'

const router = useRouter()
const taskStore = useTaskStore()

onMounted(() => {
  taskStore.initializeDemoData()
})

const completionRate = computed(() => {
  return taskStore.stats.completionRate.toFixed(1) + '%'
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h2>
        <p class="text-gray-600 dark:text-gray-400">Overview of your tasks and productivity</p>
      </div>
      <button @click="router.push('/tasks')" class="btn-primary flex items-center gap-2">
        <Plus :size="20" />
        New Task
      </button>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard
        title="Total Tasks"
        :value="taskStore.stats.total"
        :icon="ListTodo"
        color="bg-primary-600"
      />
      <StatsCard
        title="Completed"
        :value="taskStore.stats.completed"
        :icon="CheckCircle2"
        color="bg-green-600"
      />
      <StatsCard
        title="In Progress"
        :value="taskStore.stats.inProgress"
        :icon="Clock"
        color="bg-blue-600"
      />
      <StatsCard
        title="Completion Rate"
        :value="completionRate"
        :icon="TrendingUp"
        color="bg-purple-600"
      />
    </div>

    <!-- Chart -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <TaskChart />
      
      <div class="card">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
        <div class="space-y-3">
          <div v-for="task in taskStore.tasks.slice(-5).reverse()" :key="task.id" 
               class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div class="flex-1">
              <p class="font-medium text-gray-900 dark:text-white">{{ task.title }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ task.status.replace('_', ' ') }}</p>
            </div>
            <span :class="{
              'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': task.priority === 'low',
              'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200': task.priority === 'medium',
              'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200': task.priority === 'high',
              'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': task.priority === 'urgent'
            }" class="px-2 py-1 text-xs font-medium rounded-full">
              {{ task.priority }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>