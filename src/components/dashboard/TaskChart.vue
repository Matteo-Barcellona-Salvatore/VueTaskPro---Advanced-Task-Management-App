<script setup lang="ts">
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { useTaskStore } from '@/stores/taskStore'
import { useDarkMode } from '@/composables/useDarkMode'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const taskStore = useTaskStore()
const { isDark } = useDarkMode()

const chartData = computed(() => ({
  labels: ['Low', 'Medium', 'High', 'Urgent'],
  datasets: [{
    label: 'Tasks by Priority',
    data: [
      taskStore.stats.byPriority.low || 0,
      taskStore.stats.byPriority.medium || 0,
      taskStore.stats.byPriority.high || 0,
      taskStore.stats.byPriority.urgent || 0
    ],
    backgroundColor: [
      'rgba(34, 197, 94, 0.8)',
      'rgba(234, 179, 8, 0.8)',
      'rgba(249, 115, 22, 0.8)',
      'rgba(239, 68, 68, 0.8)'
    ],
    borderColor: [
      'rgb(34, 197, 94)',
      'rgb(234, 179, 8)',
      'rgb(249, 115, 22)',
      'rgb(239, 68, 68)'
    ],
    borderWidth: 2
  }]
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    title: {
      display: true,
      text: 'Tasks by Priority',
      color: isDark.value ? '#f3f4f6' : '#111827',
      font: {
        size: 16,
        weight: 'bold'
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
        color: isDark.value ? '#9ca3af' : '#6b7280'
      },
      grid: {
        color: isDark.value ? '#374151' : '#e5e7eb'
      }
    },
    x: {
      ticks: {
        color: isDark.value ? '#9ca3af' : '#6b7280'
      },
      grid: {
        color: isDark.value ? '#374151' : '#e5e7eb'
      }
    }
  }
}))
</script>

<template>
  <div class="card h-80">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>