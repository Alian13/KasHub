<template>
  <div class="space-y-6">
    <!-- Greeting Card -->
    <div class="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-xl p-6 text-white">
      <h2 class="text-2xl font-bold mb-2">Selamat datang, {{ auth.fullName }}! 👋</h2>
      <p class="text-indigo-100">Kelola keuangan UMKM Anda dengan mudah dan efisien</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Produk -->
      <div class="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-slate-500 text-sm">Total Produk</p>
            <p class="text-3xl font-bold text-slate-800">{{ stokStore.totalProduk }}</p>
          </div>
          <div class="text-4xl">📦</div>
        </div>
      </div>

      <!-- Stok Kritis -->
      <div class="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-slate-500 text-sm">Stok Kritis</p>
            <p class="text-3xl font-bold text-red-600">{{ stokStore.stokKritis.length }}</p>
          </div>
          <div class="text-4xl text-red-600">🚨</div>
        </div>
      </div>

      <!-- Total Pemasukan (Bulan Ini) -->
      <div class="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-slate-500 text-sm">Total Pemasukan</p>
            <p class="text-2xl font-bold text-emerald-600">{{ formatRupiah(transaksiStore.totalPemasukan) }}</p>
          </div>
          <div class="text-4xl">📈</div>
        </div>
      </div>

      <!-- Laba Bersih -->
      <div class="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-slate-500 text-sm">Laba Bersih</p>
            <p class="text-2xl font-bold" :class="transaksiStore.labaRugi >= 0 ? 'text-emerald-600' : 'text-red-600'">
              {{ formatRupiah(transaksiStore.labaRugi) }}
            </p>
          </div>
          <div class="text-4xl">💰</div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Transaksi Terbaru -->
      <div class="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <h3 class="text-lg font-bold text-slate-800 mb-4">Transaksi Terbaru</h3>
        <div class="space-y-3">
          <div
            v-for="trx in transaksiStore.transaksi.slice(0, 5)"
            :key="trx.id"
            class="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
          >
            <div class="flex items-center gap-3 flex-1">
              <div :class="['text-2xl', trx.tipe === 'pemasukan' ? 'text-emerald-500' : 'text-red-500']">
                {{ trx.tipe === 'pemasukan' ? '📥' : '📤' }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-medium text-slate-800 truncate">{{ trx.kategori }}</p>
                <p class="text-xs text-slate-500">{{ trx.keterangan }}</p>
              </div>
            </div>
            <div class="text-right">
              <p :class="['font-bold', trx.tipe === 'pemasukan' ? 'text-emerald-600' : 'text-red-600']">
                {{ trx.tipe === 'pemasukan' ? '+' : '-' }}{{ formatRupiah(trx.nominal) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Stok Hampir Habis -->
      <div class="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <h3 class="text-lg font-bold text-slate-800 mb-4">Stok Hampir Habis</h3>
        <div class="space-y-3">
          <div
            v-for="item in stokStore.stokHampirHabis"
            :key="item.id"
            @click="navigateToEditStok(item)"
            class="p-3 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 hover:shadow-md transition-all cursor-pointer"
          >
            <p class="font-medium text-slate-800 text-sm">{{ item.nama }}</p>
            <p class="text-xs text-slate-500">
              Sisa: <span class="font-bold text-amber-700">{{ item.stok }} {{ item.satuan }}</span>
            </p>
          </div>
          <div
            v-if="stokStore.stokHampirHabis.length === 0"
            class="text-center p-6 text-slate-400"
          >
            Semua stok dalam kondisi aman
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <RouterLink
        to="/stok"
        class="bg-indigo-50 hover:bg-indigo-100 border-2 border-indigo-200 rounded-xl p-4 text-center transition-colors"
      >
        <div class="text-3xl mb-2">📦</div>
        <p class="font-medium text-indigo-900 text-sm">Stok Produk</p>
      </RouterLink>
      <RouterLink
        to="/transaksi"
        class="bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-200 rounded-xl p-4 text-center transition-colors"
      >
        <div class="text-3xl mb-2">💸</div>
        <p class="font-medium text-emerald-900 text-sm">Transaksi</p>
      </RouterLink>
      <RouterLink
        to="/laporan"
        class="bg-amber-50 hover:bg-amber-100 border-2 border-amber-200 rounded-xl p-4 text-center transition-colors"
      >
        <div class="text-3xl mb-2">📋</div>
        <p class="font-medium text-amber-900 text-sm">Laporan</p>
      </RouterLink>
      <RouterLink
        to="/profil"
        class="bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-xl p-4 text-center transition-colors"
      >
        <div class="text-3xl mb-2">👤</div>
        <p class="font-medium text-blue-900 text-sm">Profil</p>
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useStokStore } from '@/stores/stok'
import { useTransaksiStore } from '@/stores/transaksi'
import { formatRupiah } from '@/utils/helpers'
import { RouterLink, useRouter } from 'vue-router'

const auth = useAuthStore()
const stokStore = useStokStore()
const transaksiStore = useTransaksiStore()
const router = useRouter()

function navigateToEditStok(item) {
  // Navigasi ke halaman stok dengan query parameter id produk
  router.push({
    name: 'Stok',
    query: { edit: item.id }
  })
}
</script>
