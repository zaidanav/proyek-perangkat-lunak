// stores/deviceMode.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

const mobileTreshold = 540;

export const useDeviceModeStore = defineStore('deviceMode', () => {
  const currentMode = ref<'mobile' | 'desktop'>(window.innerWidth <= mobileTreshold ? 'mobile' : 'desktop')
  const transitioning = ref(false)

  function updateMode() {
    const newMode = window.innerWidth <= mobileTreshold ? 'mobile' : 'desktop'
    if (newMode !== currentMode.value) {
      transitioning.value = true
      setTimeout(() => {
        currentMode.value = newMode
        transitioning.value = false
      }, 500)
    }
  }

  function startListener() {
    window.addEventListener('resize', updateMode)
  }

  function stopListener() {
    window.removeEventListener('resize', updateMode)
  }

  return {
    currentMode,
    transitioning,
    updateMode,
    startListener,
    stopListener,
  }
})
