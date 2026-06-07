<template>
  <div class="space-y-6">
    <!-- Header dengan tombol -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-slate-800">Manajemen Transaksi</h1>
        <p class="text-sm text-slate-500 mt-1">Total {{ transaksiStore.transaksi.length }} transaksi</p>
      </div>
      <button
        type="button"
        @click="openForm()"
        class="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
      >
        ➕ Tambah Transaksi
      </button>
    </div>

    <!-- Search & Filter -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="🔍 Cari kategori..."
        class="px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      />
      <select
        v-model="filterTipe"
        class="px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      >
        <option value="">Semua Tipe</option>
        <option value="pemasukan">Pemasukan</option>
        <option value="pengeluaran">Pengeluaran</option>
      </select>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
        <p class="text-emerald-600 text-sm font-medium">Pemasukan</p>
        <p class="text-2xl font-bold text-emerald-700 mt-1">{{ formatRupiah(transaksiStore.totalPemasukan) }}</p>
      </div>
      <div class="bg-red-50 border border-red-200 rounded-xl p-4">
        <p class="text-red-600 text-sm font-medium">Pengeluaran</p>
        <p class="text-2xl font-bold text-red-700 mt-1">{{ formatRupiah(transaksiStore.totalPengeluaran) }}</p>
      </div>
      <div :class="['rounded-xl p-4 border', transaksiStore.labaRugi >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200']">
        <p :class="['text-sm font-medium', transaksiStore.labaRugi >= 0 ? 'text-blue-600' : 'text-orange-600']">Laba/Rugi</p>
        <p :class="['text-2xl font-bold mt-1', transaksiStore.labaRugi >= 0 ? 'text-blue-700' : 'text-orange-700']">{{ formatRupiah(transaksiStore.labaRugi) }}</p>
      </div>
    </div>

    <!-- Table untuk Desktop -->
    <div class="hidden lg:block bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
              <th class="text-left px-6 py-3 text-sm font-semibold text-slate-700">Tipe</th>
              <th class="text-left px-6 py-3 text-sm font-semibold text-slate-700">Kategori</th>
              <th class="text-right px-6 py-3 text-sm font-semibold text-slate-700">Nominal</th>
              <th class="text-left px-6 py-3 text-sm font-semibold text-slate-700">Keterangan</th>
              <th class="text-left px-6 py-3 text-sm font-semibold text-slate-700">Tanggal</th>
              <th class="text-center px-6 py-3 text-sm font-semibold text-slate-700">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr v-for="item in filteredTransaksi" :key="item.id" class="hover:bg-slate-50 transition-colors">
              <td class="px-6 py-4"><span :class="['px-3 py-1 rounded-full text-xs font-medium', item.tipe === 'pemasukan' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700']">{{ item.tipe === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran' }}</span></td>
              <td class="px-6 py-4 font-medium text-slate-800">{{ item.kategori }}</td>
              <td class="px-6 py-4 text-right font-bold" :class="item.tipe === 'pemasukan' ? 'text-emerald-600' : 'text-red-600'">{{ formatRupiah(item.nominal) }}</td>
              <td class="px-6 py-4 text-slate-600">{{ item.keterangan }}</td>
              <td class="px-6 py-4 text-slate-600">{{ formatTanggal(item.tanggal, 'pendek') }}</td>
              <td class="px-6 py-4 text-center">
                <button type="button" @click="openForm(item)" class="text-indigo-600 hover:text-indigo-700 text-sm font-medium px-2 py-1">✎ Edit</button>
                <button type="button" @click="showDeleteConfirm(item.id)" class="text-red-600 hover:text-red-700 text-sm font-medium px-2 py-1">🗑️ Hapus</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="filteredTransaksi.length === 0" class="text-center py-12 bg-white">
        <p class="text-slate-500">📭 Tidak ada transaksi</p>
      </div>
    </div>

    <!-- Cards untuk Mobile -->
    <div class="lg:hidden space-y-3">
      <div v-for="item in filteredTransaksi" :key="item.id" class="bg-white rounded-lg border border-slate-200 p-4">
        <div class="flex justify-between items-start mb-3">
          <div>
            <p class="font-bold text-slate-800">{{ item.kategori }}</p>
            <p class="text-xs text-slate-500">{{ formatTanggal(item.tanggal, 'pendek') }}</p>
          </div>
          <span :class="['px-2 py-1 rounded text-xs font-medium', item.tipe === 'pemasukan' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700']">{{ item.tipe === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran' }}</span>
        </div>
        <div class="mb-4">
          <p class="text-slate-500 text-xs">{{ item.keterangan }}</p>
          <p :class="['text-lg font-bold mt-1', item.tipe === 'pemasukan' ? 'text-emerald-600' : 'text-red-600']">{{ formatRupiah(item.nominal) }}</p>
        </div>
        <div class="flex gap-2">
          <button type="button" @click="openForm(item)" class="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium py-2 rounded text-sm">✎ Edit</button>
          <button type="button" @click="showDeleteConfirm(item.id)" class="flex-1 bg-red-50 hover:bg-red-100 text-red-700 font-medium py-2 rounded text-sm">🗑️ Hapus</button>
        </div>
      </div>
      <div v-if="filteredTransaksi.length === 0" class="text-center py-12">
        <p class="text-slate-500">Tidak ada transaksi</p>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <teleport to="body">
      <div v-if="deleteConfirm.show" class="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-xl w-full max-w-sm p-6">
          <h3 class="text-lg font-bold text-slate-800 mb-2">🗑️ Hapus Transaksi?</h3>
          <p class="text-slate-600 mb-6">Apakah anda yakin ingin menghapus transaksi ini?</p>
          <div class="flex gap-3">
            <button type="button" @click="deleteConfirm.show = false" class="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50">Batal</button>
            <button type="button" @click="confirmDelete" class="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium">Ya, Hapus</button>
          </div>
        </div>
      </div>
    </teleport>

    <!-- Add/Edit Form Modal -->
    <teleport to="body">
      <div v-if="showForm" class="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
          <h3 class="text-lg font-bold text-slate-800 mb-4">{{ editingId ? '✎ Edit Transaksi' : '➕ Tambah Transaksi' }}</h3>
          <form @submit.prevent="saveItem" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Tipe Transaksi *</label>
              <select v-model="formData.tipe" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500" required>
                <option value="">Pilih Tipe</option>
                <option value="pemasukan">Pemasukan</option>
                <option value="pengeluaran">Pengeluaran</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Kategori *</label>
              <input v-model="formData.kategori" type="text" placeholder="Contoh: Penjualan Produk" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Nominal *</label>
              <input v-model.number="formData.nominal" type="number" placeholder="0" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Keterangan</label>
              <textarea v-model="formData.keterangan" placeholder="Catatan transaksi..." class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 h-20"></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Tanggal *</label>
              <input v-model="formData.tanggal" type="date" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500" required />
            </div>
            <div class="flex gap-3 pt-4 border-t">
              <button type="button" @click="showForm = false" class="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50">Batal</button>
              <button type="submit" class="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium">{{ editingId ? 'Simpan' : 'Tambah' }}</button>
            </div>
          </form>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useTransaksiStore } from '@/stores/transaksi'
import { useNotificationStore } from '@/stores/notification'
import { formatRupiah, formatTanggal } from '@/utils/helpers'

const transaksiStore = useTransaksiStore()
const notificationStore = useNotificationStore()
const showForm = ref(false)
const editingId = ref(null)
const searchQuery = ref('')
const filterTipe = ref('')
const deleteConfirm = ref({ show: false, id: null })

const formData = reactive({
  tipe: '', kategori: '', nominal: 0, keterangan: '', tanggal: new Date().toISOString().split('T')[0]
})

const filteredTransaksi = computed(() => {
  return transaksiStore.transaksi.filter(t => {
    const matchSearch = t.kategori.toLowerCase().includes(searchQuery.value.toLowerCase()) || t.keterangan.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchTipe = !filterTipe.value || t.tipe === filterTipe.value
    return matchSearch && matchTipe
  })
})

function openForm(item = null) {
  if (item) {
    editingId.value = item.id
    Object.assign(formData, item)
  } else {
    editingId.value = null
    resetForm()
  }
  showForm.value = true
}

function saveItem() {
  if (!formData.tipe || !formData.kategori.trim() || formData.nominal <= 0) {
    notificationStore.error('Lengkapi semua field dengan benar!')
    return
  }
  if (editingId.value) {
    transaksiStore.updateTransaksi ? transaksiStore.updateTransaksi(editingId.value, formData) : transaksiStore.transaksi.splice(transaksiStore.transaksi.findIndex(t => t.id === editingId.value), 1, { ...transaksiStore.transaksi.find(t => t.id === editingId.value), ...formData })
    notificationStore.success('Transaksi berhasil diperbarui')
  } else {
    transaksiStore.tambahTransaksi(formData)
    notificationStore.success('Transaksi berhasil ditambahkan')
  }
  closeForm()
}

function showDeleteConfirm(id) {
  deleteConfirm.value = { show: true, id }
}

function confirmDelete() {
  if (deleteConfirm.value.id) {
    transaksiStore.hapusTransaksi(deleteConfirm.value.id)
    notificationStore.success('Transaksi berhasil dihapus')
  }
  deleteConfirm.value = { show: false, id: null }
}

function closeForm() {
  showForm.value = false
  editingId.value = null
  resetForm()
}

function resetForm() {
  Object.assign(formData, { tipe: '', kategori: '', nominal: 0, keterangan: '', tanggal: new Date().toISOString().split('T')[0] })
}
</script>
