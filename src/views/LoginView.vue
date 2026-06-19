<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
    <!-- Animated Background Elements -->
    <div class="absolute inset-0">
      <!-- Floating Circles -->
      <div class="absolute top-10 left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
      <div class="absolute top-1/2 left-1/3 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse animation-delay-4000"></div>
      
      <!-- Grid Pattern Overlay -->
      <div class="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" stroke-width="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <!-- Decorative Shapes -->
      <div class="absolute top-20 right-10 w-32 h-32 border border-indigo-400/20 rounded-3xl rotate-45 animate-slow-spin"></div>
      <div class="absolute bottom-32 left-20 w-40 h-40 border border-blue-400/20 rounded-full opacity-50"></div>
      
      <!-- Gradient Accent Lines -->
      <div class="absolute top-0 left-1/4 w-1 h-96 bg-gradient-to-b from-indigo-500/50 to-transparent blur-sm"></div>
      <div class="absolute bottom-0 right-1/3 w-1 h-80 bg-gradient-to-t from-blue-500/50 to-transparent blur-sm"></div>
    </div>

    <!-- Content Container -->
    <div class="w-full max-w-md relative z-10">
      <!-- Card -->
      <div class="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/20">
        <!-- Header -->
        <div class="text-center mb-8">
          <img :src="logoUrl" alt="KasHub Logo" class="w-25 h-25 mx-auto mb-2 object-contain" />
          <h1 class="text-3xl font-bold text-slate-850">Login Akun</h1>
          <!-- <p class="text-sm text-slate-500 mt-2">Sistem Manajemen Keuangan UMKM</p> -->
        </div>

        <!-- Form -->
        <form @submit.prevent="handleLogin" class="space-y-4">
          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Email</label>
            <input
              v-model="form.email"
              type="email"
              placeholder="Masukkan email"
              class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <input
              v-model="form.password"
              type="password"
              placeholder="Masukkan password"
              class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          <!-- Error Message -->
          <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {{ error }}
          </div>

          <!-- Submit Button -->
          <button
            :disabled="auth.loading"
            class="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-medium py-2.5 rounded-lg transition-colors"
          >
            {{ auth.loading ? 'Sedang login...' : 'Masuk' }}
          </button>
        </form>

        <!-- Separator -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-slate-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-slate-500">atau</span>
          </div>
        </div>

        <!-- Register Link -->
        <RouterLink
          to="/register"
          class="block w-full border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-medium py-2.5 rounded-lg transition-colors text-center"
        >
          Daftar Akun Baru
        </RouterLink>

        <!-- Demo Info -->
        <!-- <div class="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
          <p class="font-semibold mb-2">Demo Login:</p> -->
          <!-- <p class="text-xs mb-2">📧 admin@umkm.com | 🔐 password123</p> -->
          <!-- <p class="text-xs">pemilik@umkm.com | password123</p>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const logoUrl = '/KasHub_LogoT.png'

const router = useRouter()
const auth = useAuthStore()

const form = reactive({
  email: '',
  password: ''
})
const error = ref('')

async function handleLogin() {
  error.value = ''
  const result = await auth.login(form.email, form.password)
  if (result.success) {
    router.push('/dashboard')
  } else {
    error.value = result.message
  }
}
</script>

<style scoped>
@keyframes slow-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

.animate-slow-spin {
  animation: slow-spin 20s linear infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

:deep(.bg-white\/95) {
  backdrop-filter: blur(10px);
}
</style>
