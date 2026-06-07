<script setup>
import { useAuthStore } from '@/stores/auth'
import { RouterView } from 'vue-router'

const auth = useAuthStore()
</script>

<template>
  <RouterView />
</template>
