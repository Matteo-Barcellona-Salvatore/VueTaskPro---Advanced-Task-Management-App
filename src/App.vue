ì<script setup lang="ts">
import { RouterView } from 'vue-router'
import TheHeader from './components/common/TheHeader.vue'
</script>

<template>
  <div class="min-h-screen">
    <TheHeader />
    <main>
      <RouterView />
    </main>
  </div>
</template>