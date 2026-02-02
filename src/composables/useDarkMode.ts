import { ref, watch } from 'vue'
import { useLocalStorage } from '@vueuse/core'

export function useDarkMode() {
  const isDark = useLocalStorage('darkMode', false)

  watch(isDark, (val) => {
    if (val) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, { immediate: true })

  function toggleDark() {
    isDark.value = !isDark.value
  }

  return {
    isDark,
    toggleDark
  }
}