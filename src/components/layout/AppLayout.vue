<template>
  <div class="min-h-screen bg-slate-50 flex">

    <!-- Sidebar -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300',
        sidebarTerbuka ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0 lg:static lg:flex'
      ]"
    >
      <!-- Logo -->
      <div class="h-16 flex items-center px-6 border-b border-slate-100">
        <div class="flex items-center gap-3">
          <img :src="logoUrl" alt="KasHub Logo" class="w-15 h-15 object-contain" />
          <div>
            <p class="text-sm font-semibold text-slate-800">KasHub UMKM</p>
            <p class="text-xs text-slate-400">Manajemen Keuangan</p>
          </div>
        </div>
      </div>

      <!-- Nav Links -->
      <nav class="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <RouterLink
          v-for="item in menuNav"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
          :class="isAktif(item.to)
            ? 'bg-indigo-50 text-indigo-700'
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'"
          @click="sidebarTerbuka = false"
        >
          <span class="text-lg">{{ item.icon }}</span>
          {{ item.label }}
          <span
            v-if="item.badge"
            class="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
          >
            {{ item.badge }}
          </span>
        </RouterLink>
      </nav>

      <!-- User Info -->
      <div class="p-4 border-t border-slate-100">
        <div class="flex items-center gap-3">
          <div v-if="auth.user?.fotoProfil" class="w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
            <img :src="auth.user.fotoProfil" alt="Foto profil" class="w-full h-full object-cover">
          </div>
          <div v-else class="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span class="text-indigo-700 text-sm font-semibold">
              {{ auth.fullName.charAt(0).toUpperCase() }}
            </span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-slate-800 truncate">{{ auth.fullName }}</p>
            <p class="text-xs text-slate-400 capitalize">Pemilik UMKM</p>
          </div>
          <button
            @click="handleLogout"
            class="text-slate-400 hover:text-red-500 transition-colors p-1"
            title="Keluar"
          >
            [←]
          </button>
        </div>
      </div>
    </aside>

    <!-- Overlay mobile -->
    <div
      v-if="sidebarTerbuka"
      class="fixed inset-0 z-40 bg-black/30 lg:hidden"
      @click="sidebarTerbuka = false"
    />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0">

      <!-- Top Bar -->
      <header class="sticky top-0 z-40 h-16 bg-white border-b border-slate-200 flex items-center px-4 lg:px-6 gap-4">
        <button
          @click="sidebarTerbuka = !sidebarTerbuka"
          class="lg:hidden p-2 text-slate-500 hover:text-slate-700"
        >
          ☰
        </button>
        <div>
          <h1 class="text-base font-semibold text-slate-800">{{ judulHalaman }}</h1>
          <p class="text-xs text-slate-400">{{ tanggalSekarang }}</p>
        </div>

        <!-- Notifikasi stok kritis -->
        <div class="ml-auto flex items-center gap-3">
          <div v-if="stokStore.adaNotifikasi" class="relative">
            <button
              @click="tampilNotif = !tampilNotif"
              class="relative p-2 text-slate-500 hover:text-indigo-600 transition-colors"
            >
              🔔
              <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <!-- Dropdown notifikasi -->
            <div
              v-if="tampilNotif"
              class="absolute right-0 top-10 w-72 bg-white rounded-xl shadow-lg border border-slate-200 z-50"
            >
              <div class="p-3 border-b border-slate-100">
                <p class="text-sm font-semibold text-slate-700">Notifikasi Stok</p>
              </div>
              <div class="max-h-60 overflow-y-auto">
                <div
                  v-for="item in [...stokStore.stokKritis, ...stokStore.stokHampirHabis]"
                  :key="item.id"
                  @click="navigateToEditStok(item)"
                  class="p-3 flex items-center gap-3 hover:bg-slate-50 border-b border-slate-50 cursor-pointer transition-colors"
                >
                  <span :class="stokStore.statusStok(item) === 'merah' ? 'text-red-500' : 'text-amber-500'">
                    {{ stokStore.statusStok(item) === 'merah' ? '●' : '●' }}
                  </span>
                  <div>
                    <p class="text-sm text-slate-800">{{ item.nama }}</p>
                    <p class="text-xs text-slate-400">Sisa: {{ item.stok }} {{ item.satuan }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 p-4 lg:p-6 overflow-y-auto">
        <RouterView />
      </main>
    </div>
  </div>

  <!-- Notification Center -->
  <NotificationCenter />

  <!-- Inactivity Warning -->
  <InactivityWarning
    :is-visible="isWarningShown"
    :remaining-time="remainingTime"
    @stay-logged-in="stayLoggedIn"
    @logout="inactivityLogout"
  />
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterView, RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useStokStore } from '@/stores/stok'
import NotificationCenter from '@/components/common/NotificationCenter.vue'
import InactivityWarning from '@/components/common/InactivityWarning.vue'
import { useInactivityTimer } from '@/composables/useInactivityTimer'
import { formatTanggal } from '@/utils/helpers'
import logoUrl from '@/assets/KasHub_Logo.png'

const auth = useAuthStore()
const stokStore = useStokStore()
const route = useRoute()
const router = useRouter()

// Setup inactivity timer (20 minutes = 1200000ms)
const { isWarningShown, remainingTime, logout: inactivityLogout, stayLoggedIn } = useInactivityTimer(1200000, true)

const sidebarTerbuka = ref(false)
const tampilNotif = ref(false)

const menuNav = computed(() => {
  const semua = [
    { to: '/dashboard',  label: 'Dashboard',   icon: '📊', roles: ['pemilik', 'admin'] },
    { to: '/stok',       label: 'Stok Produk', icon: '📦',
      roles: ['pemilik', 'admin'],
      badge: stokStore.stokKritis.length || null
    },
    { to: '/transaksi',  label: 'Transaksi',   icon: '💸', roles: ['admin'] },
    { to: '/laporan',    label: 'Laporan',      icon: '📋', roles: ['pemilik', 'admin'] },
    { to: '/profil',     label: 'Profil',       icon: '👤', roles: ['pemilik', 'admin'] },
  ]
  return semua.filter(m => m.roles.includes(auth.user?.role))
})

const judulHalaman = computed(() => {
  const map = {
    '/dashboard': 'Dashboard',
    '/stok': 'Stok Produk',
    '/transaksi': 'Transaksi',
    '/laporan': 'Laporan Keuangan',
    '/profil': 'Profil'
  }
  return map[route.path] || 'KasHub UMKM'
})

const tanggalSekarang = computed(() =>
  formatTanggal(new Date(), 'panjang')
)

const isAktif = (path) => route.path === path

function navigateToEditStok(item) {
  // Close notif dropdown dan navigasi ke halaman stok dengan query parameter
  tampilNotif.value = false
  router.push({
    name: 'Stok',
    query: { edit: item.id }
  })
}

async function handleLogout() {
  auth.logout()
  router.push({ name: 'Login' })
}
</script>
