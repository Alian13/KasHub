<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition name="fade">
      <div
        v-if="isVisible"
        class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      >
        <!-- Modal -->
        <div class="bg-white rounded-xl shadow-lg max-w-sm w-full p-6 animate-pulse">
          <div class="flex gap-3 mb-4">
            <div class="text-3xl">⏱️</div>
            <div class="flex-1">
              <h2 class="text-lg font-bold text-slate-800">Sesi Akan Berakhir</h2>
              <p class="text-sm text-slate-500">Tidak ada aktivitas terdeteksi</p>
            </div>
          </div>

          <p class="text-sm text-slate-600 mb-6">
            Anda akan logout otomatis dalam <span class="font-bold text-red-600">{{ remainingTime }} detik</span> karena tidak ada aktivitas.
          </p>

          <div class="flex gap-3">
            <button
              @click="stayLoggedIn"
              class="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
            >
              Tetap Login
            </button>
            <button
              @click="logout"
              class="flex-1 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition-colors"
            >
              Logout Sekarang
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  remainingTime: {
    type: Number,
    default: 60
  }
})

const emit = defineEmits(['stay-logged-in', 'logout'])

const stayLoggedIn = () => {
  emit('stay-logged-in')
}

const logout = () => {
  emit('logout')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.95;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
