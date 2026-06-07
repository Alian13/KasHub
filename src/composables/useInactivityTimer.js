import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

/**
 * Composable untuk menangani auto-logout setelah 20 menit tidak ada aktivitas
 * @param {number} timeoutMs - Waktu timeout dalam milliseconds (default: 20 menit = 1200000ms)
 * @param {boolean} showWarning - Tampilkan warning sebelum logout
 */
export const useInactivityTimer = (timeoutMs = 1200000, showWarning = true) => {
  const router = useRouter()
  const authStore = useAuthStore()
  
  let inactivityTimer = null
  let warningTimer = null
  const warningTime = 60000 // 1 menit sebelum logout
  const isWarningShown = ref(false)
  const remainingTime = ref(0)

  const resetActivityTimer = () => {
    isWarningShown.value = false
    
    // Clear existing timers
    if (inactivityTimer) clearTimeout(inactivityTimer)
    if (warningTimer) clearTimeout(warningTimer)

    // Set warning timer (60 detik sebelum logout)
    if (showWarning) {
      warningTimer = setTimeout(() => {
        isWarningShown.value = true
        let remaining = Math.ceil(warningTime / 1000)
        
        const countdownInterval = setInterval(() => {
          remaining--
          remainingTime.value = remaining
          
          if (remaining <= 0) {
            clearInterval(countdownInterval)
          }
        }, 1000)
      }, timeoutMs - warningTime)
    }

    // Set inactivity timeout
    inactivityTimer = setTimeout(() => {
      logout()
    }, timeoutMs)
  }

  const logout = async () => {
    isWarningShown.value = false
    await authStore.logout()
    router.push('/login')
  }

  const stayLoggedIn = () => {
    isWarningShown.value = false
    resetActivityTimer()
  }

  const setupEventListeners = () => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click']
    
    events.forEach(event => {
      document.addEventListener(event, resetActivityTimer, true)
    })

    // Return cleanup function
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetActivityTimer, true)
      })
      if (inactivityTimer) clearTimeout(inactivityTimer)
      if (warningTimer) clearTimeout(warningTimer)
    }
  }

  onMounted(() => {
    if (authStore.isLoggedIn) {
      resetActivityTimer()
      setupEventListeners()
    }
  })

  onUnmounted(() => {
    if (inactivityTimer) clearTimeout(inactivityTimer)
    if (warningTimer) clearTimeout(warningTimer)
  })

  return {
    isWarningShown,
    remainingTime,
    logout,
    stayLoggedIn,
    resetActivityTimer
  }
}
