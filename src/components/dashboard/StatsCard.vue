<script setup lang="ts">
import type { LucideIcon } from 'lucide-vue-next'

defineProps<{
  title: string
  value: string | number
  icon: LucideIcon
  color: string
}>()
</script>

<template>
  <div class="card">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">{{ title }}</p>
        <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ value }}</p>
      </div>
      <div :class="`p-3 rounded-lg ${color}`">
        <component :is="icon" :size="24" class="text-white" />
      </div>
    </div>
  </div>
</template>