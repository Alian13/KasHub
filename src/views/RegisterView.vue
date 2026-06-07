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
      <div class="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/20">
        <div class="text-center mb-8">
          <img :src="logoUrl" alt="KasHub Logo" class="w-30 h-30 mx-auto mb-2 object-contain" />
          <h1 class="text-2xl font-bold text-slate-800">Daftar Akun Baru</h1>
          <p class="text-sm text-slate-500 mt-2">KasHub UMKM</p>
        </div>

        <!-- Success Message -->
        <div v-if="successMessage" class="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-700">
          {{ successMessage }}
        </div>

        <form @submit.prevent="handleRegister" class="space-y-4">
          <!-- Nama Lengkap -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Nama Lengkap</label>
            <input
              v-model="form.nama"
              type="text"
              placeholder="Masukkan nama lengkap"
              class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Email UMKM</label>
            <input
              v-model="form.email"
              type="email"
              placeholder="Masukkan email (contoh: user@umkm.com)"
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
              placeholder="Masukkan password (min. 6 karakter)"
              class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
              minlength="6"
            />
            <p class="text-xs text-slate-500 mt-1">Password minimal 6 karakter</p>
          </div>

          <!-- Confirm Password -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Konfirmasi Password</label>
            <input
              v-model="form.confirmPassword"
              type="password"
              placeholder="Ulangi password"
              class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          <!-- Divider -->
          <div class="pt-4 border-t border-slate-200">
            <p class="text-sm font-medium text-slate-700 mb-4">Informasi UMKM</p>
          </div>

          <!-- Nama UMKM -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Nama UMKM</label>
            <input
              v-model="form.namaUmkm"
              type="text"
              placeholder="Masukkan nama UMKM"
              class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          <!-- Jenis Usaha -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Jenis Usaha</label>
            <input
              v-model="form.jenisUsaha"
              type="text"
              placeholder="Contoh: Retail, Perdagangan, Layanan, dll"
              class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          <!-- Alamat UMKM -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Alamat UMKM</label>
            <textarea
              v-model="form.alamat"
              placeholder="Masukkan alamat lengkap UMKM"
              rows="3"
              class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            ></textarea>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {{ error }}
          </div>

          <!-- Submit Button -->
          <button
            :disabled="auth.loading"
            type="submit"
            class="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-medium py-2.5 rounded-lg transition-colors"
          >
            {{ auth.loading ? 'Sedang mendaftar...' : 'Daftar Sekarang' }}
          </button>
        </form>

        <!-- Divider -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-slate-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-slate-500">atau</span>
          </div>
        </div>

        <!-- Login Link -->
        <RouterLink
          to="/login"
          class="block w-full border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-medium py-2.5 rounded-lg transition-colors text-center"
        >
          Sudah Punya Akun? Masuk
        </RouterLink>

        <!-- Info Box -->
        <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
          <p class="font-semibold mb-2">Tips:</p>
          <ul class="text-xs space-y-1">
            <li>Gunakan email yang valid</li>
            <li>Password minimal 6 karakter</li>
            <li>Setelah registrasi, langsung login</li>
          </ul>
        </div>
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
  nama: '',
  email: '',
  password: '',
  confirmPassword: '',
  namaUmkm: '',
  jenisUsaha: '',
  alamat: ''
})
const error = ref('')
const successMessage = ref('')

async function handleRegister() {
  error.value = ''
  successMessage.value = ''

  // Validasi
  if (form.password.length < 6) {
    error.value = 'Password minimal 6 karakter'
    return
  }

  if (form.password !== form.confirmPassword) {
    error.value = 'Password dan konfirmasi password tidak sesuai'
    return
  }

  if (!form.nama.trim()) {
    error.value = 'Nama lengkap harus diisi'
    return
  }

  if (!form.namaUmkm.trim()) {
    error.value = 'Nama UMKM harus diisi'
    return
  }

  if (!form.jenisUsaha.trim()) {
    error.value = 'Jenis usaha harus diisi'
    return
  }

  if (!form.alamat.trim()) {
    error.value = 'Alamat UMKM harus diisi'
    return
  }

  const result = await auth.register({
    nama: form.nama,
    email: form.email,
    password: form.password,
    namaUmkm: form.namaUmkm,
    jenisUsaha: form.jenisUsaha,
    alamat: form.alamat
  })

  if (result.success) {
    successMessage.value = 'Registrasi berhasil! Silakan login dengan akun Anda.'
    form.nama = ''
    form.email = ''
    form.password = ''
    form.confirmPassword = ''
    form.namaUmkm = ''
    form.jenisUsaha = ''
    form.alamat = ''
    
    setTimeout(() => {
      router.push('/login')
    }, 2000)
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
