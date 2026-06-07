<template>
  <div class="space-y-6">
    <!-- Header dengan tombol -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-slate-800">Manajemen Stok</h1>
        <p class="text-sm text-slate-500 mt-1">Total {{ stokStore.totalProduk }} produk</p>
      </div>
      <button
        type="button"
        @click="openForm()"
        class="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
      >
        ➕ Tambah Produk
      </button>
    </div>

    <!-- Search & Filter -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Cari nama produk..."
        class="px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      />
      <select
        v-model="filterStatus"
        class="px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      >
        <option value="">Semua Status</option>
        <option value="hijau">Aman</option>
        <option value="kuning">Hampir Habis</option>
        <option value="merah">Kritis</option>
      </select>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
        <p class="text-emerald-600 text-sm font-medium">Aman</p>
        <p class="text-2xl font-bold text-emerald-700 mt-1">
          {{ stokStore.produk.filter(p => stokStore.statusStok(p) === 'hijau').length }}
        </p>
      </div>
      <div class="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p class="text-amber-600 text-sm font-medium">Hampir Habis</p>
        <p class="text-2xl font-bold text-amber-700 mt-1">{{ stokStore.stokHampirHabis.length }}</p>
      </div>
      <div class="bg-red-50 border border-red-200 rounded-xl p-4">
        <p class="text-red-600 text-sm font-medium">Kritis</p>
        <p class="text-2xl font-bold text-red-700 mt-1">{{ stokStore.stokKritis.length }}</p>
      </div>
    </div>

    <!-- Table untuk Desktop -->
    <div class="hidden lg:block bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
              <th class="text-left px-6 py-3 text-sm font-semibold text-slate-700">Produk</th>
              <th class="text-left px-6 py-3 text-sm font-semibold text-slate-700">Kategori</th>
              <th class="text-right px-6 py-3 text-sm font-semibold text-slate-700">Stok</th>
              <th class="text-right px-6 py-3 text-sm font-semibold text-slate-700">Harga</th>
              <th class="text-center px-6 py-3 text-sm font-semibold text-slate-700">Status</th>
              <th class="text-center px-6 py-3 text-sm font-semibold text-slate-700">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr v-for="item in filteredProduk" :key="item.id" class="hover:bg-slate-50 transition-colors">
              <td class="px-6 py-4"><p class="font-medium text-slate-800">{{ item.nama }}</p></td>
              <td class="px-6 py-4 text-slate-600">{{ item.kategori }}</td>
              <td class="px-6 py-4 text-right"><span class="font-semibold">{{ item.stok }}</span> <span class="text-slate-500 text-sm">{{ item.satuan }}</span></td>
              <td class="px-6 py-4 text-right font-medium text-slate-800">{{ formatRupiah(item.harga) }}</td>
              <td class="px-6 py-4 text-center"><span :class="['inline-block px-3 py-1 rounded-full text-xs font-medium', statusClass(stokStore.statusStok(item))]">{{ statusLabel(stokStore.statusStok(item)) }}</span></td>
              <td class="px-6 py-4 text-center">
                <button type="button" @click="openForm(item)" class="text-indigo-600 hover:text-indigo-700 text-sm font-medium px-2 py-1">✎ Edit</button>
                <button type="button" @click="showDeleteConfirm(item.id)" class="text-red-600 hover:text-red-700 text-sm font-medium px-2 py-1">Hapus</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="filteredProduk.length === 0" class="text-center py-12 bg-white">
        <p class="text-slate-500">Tidak ada produk</p>
      </div>
    </div>

    <!-- Cards untuk Mobile -->
    <div class="lg:hidden space-y-3">
      <div v-for="item in filteredProduk" :key="item.id" class="bg-white rounded-lg border border-slate-200 p-4">
        <div class="flex justify-between items-start mb-3">
          <div><p class="font-bold text-slate-800">{{ item.nama }}</p><p class="text-xs text-slate-500">{{ item.kategori }}</p></div>
          <span :class="['px-2 py-1 rounded text-xs font-medium', statusClass(stokStore.statusStok(item))]">{{ statusLabel(stokStore.statusStok(item)) }}</span>
        </div>
        <div class="grid grid-cols-3 gap-3 mb-4 text-sm">
          <div><p class="text-slate-500">Stok</p><p class="font-bold">{{ item.stok }} {{ item.satuan }}</p></div>
          <div><p class="text-slate-500">Min</p><p class="font-bold">{{ item.stokMin }}</p></div>
          <div><p class="text-slate-500">Harga</p><p class="font-bold text-indigo-600">{{ formatRupiah(item.harga) }}</p></div>
        </div>
        <div class="flex gap-2">
          <button type="button" @click="openForm(item)" class="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium py-2 rounded text-sm">✎ Edit</button>
          <button type="button" @click="showDeleteConfirm(item.id)" class="flex-1 bg-red-50 hover:bg-red-100 text-red-700 font-medium py-2 rounded text-sm">Hapus</button>
        </div>
      </div>
      <div v-if="filteredProduk.length === 0" class="text-center py-12">
        <p class="text-slate-500">📭 Tidak ada produk</p>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <teleport to="body">
      <div v-if="deleteConfirm.show" class="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-xl w-full max-w-sm p-6">
          <h3 class="text-lg font-bold text-slate-800 mb-2">Hapus Produk?</h3>
          <p class="text-slate-600 mb-6">Apakah Anda yakin ingin menghapus produk ini?</p>
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
          <h3 class="text-lg font-bold text-slate-800 mb-4">{{ editingId ? '✎ Edit Produk' : '➕ Tambah Produk' }}</h3>
          <form @submit.prevent="saveItem" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Nama Produk *</label>
              <input v-model="formData.nama" type="text" placeholder="Contoh: Beras 5kg" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Kategori *</label>
              <input v-model="formData.kategori" type="text" placeholder="Contoh: Sembako" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500" required />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Stok *</label>
                <input v-model.number="formData.stok" type="number" placeholder="0" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500" required />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Stok Min *</label>
                <input v-model.number="formData.stokMin" type="number" placeholder="0" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500" required />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Harga *</label>
                <input v-model.number="formData.harga" type="number" placeholder="0" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500" required />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Satuan *</label>
                <select v-model="formData.satuan" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500" required>
                  <option value="pcs">pcs</option>
                  <option value="karung">karung</option>
                  <option value="botol">botol</option>
                  <option value="bungkus">bungkus</option>
                  <option value="dus">dus</option>
                </select>
              </div>
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
import { ref, reactive, computed, onMounted } from 'vue'
import { useStokStore } from '@/stores/stok'
import { useNotificationStore } from '@/stores/notification'
import { useRoute } from 'vue-router'
import { formatRupiah } from '@/utils/helpers'

const stokStore = useStokStore()
const notificationStore = useNotificationStore()
const route = useRoute()
const showForm = ref(false)
const editingId = ref(null)
const searchQuery = ref('')
const filterStatus = ref('')
const deleteConfirm = ref({ show: false, id: null })

const formData = reactive({
  nama: '', kategori: '', stok: 0, stokMin: 0, harga: 0, satuan: 'pcs'
})

const filteredProduk = computed(() => {
  return stokStore.produk.filter(p => {
    const matchSearch = p.nama.toLowerCase().includes(searchQuery.value.toLowerCase()) || p.kategori.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchStatus = !filterStatus.value || stokStore.statusStok(p) === filterStatus.value
    return matchSearch && matchStatus
  })
})

const statusLabel = (status) => ({ hijau: 'Aman', kuning: 'Hampir Habis', merah: 'Kritis' }[status] || '-')
const statusClass = (status) => ({ hijau: 'bg-emerald-100 text-emerald-700', kuning: 'bg-amber-100 text-amber-700', merah: 'bg-red-100 text-red-700' }[status] || '')

// Cek query parameter edit saat component mounted
onMounted(() => {
  if (route.query.edit) {
    const produk = stokStore.produk.find(p => p.id === route.query.edit)
    if (produk) {
      openForm(produk)
    }
  }
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
  if (!formData.nama.trim() || !formData.kategori.trim()) {
    notificationStore.error('Nama dan kategori harus diisi!')
    return
  }
  if (editingId.value) {
    stokStore.updateProduk(editingId.value, formData)
    notificationStore.success('Produk berhasil diperbarui')
  } else {
    stokStore.tambahProduk(formData)
    notificationStore.success('Produk berhasil ditambahkan')
  }
  closeForm()
}

function showDeleteConfirm(id) {
  deleteConfirm.value = { show: true, id }
}

function confirmDelete() {
  if (deleteConfirm.value.id) {
    stokStore.hapusProduk(deleteConfirm.value.id)
    notificationStore.success('Produk berhasil dihapus')
  }
  deleteConfirm.value = { show: false, id: null }
}

function closeForm() {
  showForm.value = false
  editingId.value = null
  resetForm()
}

function resetForm() {
  Object.assign(formData, { nama: '', kategori: '', stok: 0, stokMin: 0, harga: 0, satuan: 'pcs' })
}
</script>
