<template>
  <div class="fixed top-4 right-4 z-[9999] space-y-2 pointer-events-none">
    <transition-group name="notify" tag="div">
      <div
        v-for="notif in notificationStore.notifications"
        :key="notif.id"
        :class="[
          'px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in pointer-events-auto',
          notifClass(notif.type)
        ]"
      >
        <span class="text-lg">{{ notifIcon(notif.type) }}</span>
        <span class="font-medium">{{ notif.message }}</span>
        <button
          @click="notificationStore.removeNotification(notif.id)"
          class="ml-2 text-lg hover:opacity-70 transition-opacity"
        >
          ×
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { useNotificationStore } from '@/stores/notification'

const notificationStore = useNotificationStore()

const notifClass = (type) => {
  const classes = {
    success: 'bg-emerald-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-amber-500 text-white',
    info: 'bg-indigo-500 text-white'
  }
  return classes[type] || 'bg-indigo-500 text-white'
}

const notifIcon = (type) => {
  const icons = {
    success: '',
    error: '',
    warning: '',
    info: ''
  }
  return icons[type] || ''
}
</script>

<style scoped>
@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}

.notify-enter-active,
.notify-leave-active {
  transition: all 0.3s ease;
}

.notify-enter-from {
  transform: translateX(400px);
  opacity: 0;
}

.notify-leave-to {
  transform: translateX(400px);
  opacity: 0;
}
</style>
