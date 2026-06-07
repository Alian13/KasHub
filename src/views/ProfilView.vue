<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-slate-800">Profil Pengguna</h1>

    <!-- Profil Card -->
    <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
      <div class="flex items-center gap-4 mb-6">
        <!-- Foto Profil -->
        <div class="relative">
          <div v-if="auth.user?.fotoProfil" class="w-16 h-16 rounded-full overflow-hidden">
            <img :src="auth.user.fotoProfil" alt="Foto profil" class="w-full h-full object-cover">
          </div>
          <div v-else class="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center">
            <span class="text-white text-2xl font-bold">{{ auth.fullName.charAt(0).toUpperCase() }}</span>
          </div>
          <button
            @click="$refs.fileInput.click()"
            class="absolute bottom-0 right-0 bg-indigo-500 text-white text-xs rounded-full p-1 hover:bg-indigo-700 transition-colors font-bold"
            title="Ubah foto"
          >
            +
          </button>
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleFotoChange"
          />
        </div>
        <div>
          <h2 class="text-2xl font-bold text-slate-800">{{ auth.fullName }}</h2>
          <p class="text-slate-500 capitalize">Pemilik UMKM</p>
        </div>
      </div>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Email</label>
          <p class="px-4 py-2 bg-slate-50 rounded-lg text-slate-800">{{ auth.user?.email }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Role</label>
          <div class="inline-block px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-medium capitalize">
            Pemilik UMKM
          </div>
        </div>
      </div>
    </div>

    <!-- Informasi UMKM -->
    <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold text-slate-800">Informasi UMKM</h3>
        <button
          @click="editMode = !editMode"
          class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition-colors"
        >
          {{ editMode ? 'Batal' : 'Edit' }}
        </button>
      </div>

      <div class="space-y-4">
        <!-- Nama UMKM -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Nama UMKM</label>
          <input
            v-if="editMode"
            v-model="umkmData.nama"
            type="text"
            class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Masukkan nama UMKM"
          />
          <p v-else class="px-4 py-2 bg-slate-50 rounded-lg text-slate-800">{{ umkmData.nama || '-' }}</p>
        </div>

        <!-- Jenis Usaha -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Jenis Usaha</label>
          <input
            v-if="editMode"
            v-model="umkmData.jenisUsaha"
            type="text"
            class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Contoh: Retail, Perdagangan, Layanan"
          />
          <p v-else class="px-4 py-2 bg-slate-50 rounded-lg text-slate-800">{{ umkmData.jenisUsaha || '-' }}</p>
        </div>

        <!-- Alamat -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Alamat</label>
          <textarea
            v-if="editMode"
            v-model="umkmData.alamat"
            rows="3"
            class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Masukkan alamat lengkap"
          ></textarea>
          <p v-else class="px-4 py-2 bg-slate-50 rounded-lg text-slate-800">{{ umkmData.alamat || '-' }}</p>
        </div>

        <!-- Tombol Simpan (hanya tampil saat edit) -->
        <div v-if="editMode" class="flex gap-3 pt-4">
          <button
            @click="handleSaveUmkm"
            class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-medium transition-colors"
          >
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>

    <!-- Statistik Akun -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
        <p class="text-indigo-600 text-sm font-medium">Total Produk</p>
        <p class="text-3xl font-bold text-indigo-700 mt-2">{{ stokStore.totalProduk }}</p>
      </div>
      <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
        <p class="text-emerald-600 text-sm font-medium">Total Transaksi</p>
        <p class="text-3xl font-bold text-emerald-700 mt-2">{{ transaksiStore.transaksi.length }}</p>
      </div>
      <div class="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <p class="text-amber-600 text-sm font-medium">Stok Kritis</p>
        <p class="text-3xl font-bold text-amber-700 mt-2">{{ stokStore.stokKritis.length }}</p>
      </div>
    </div>

    <!-- Logout Button -->
    <button
      @click="handleLogout"
      class="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors"
    >
      ← Keluar dari Akun
    </button>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useStokStore } from '@/stores/stok'
import { useTransaksiStore } from '@/stores/transaksi'
import { useNotificationStore } from '@/stores/notification'

const router = useRouter()
const auth = useAuthStore()
const stokStore = useStokStore()
const transaksiStore = useTransaksiStore()
const notificationStore = useNotificationStore()

const editMode = ref(false)
const fileInput = ref(null)
const umkmData = reactive({
  nama: '',
  jenisUsaha: '',
  alamat: ''
})

onMounted(() => {
  // Load UMKM data dari auth store
  if (auth.user?.umkm) {
    umkmData.nama = auth.user.umkm.nama || ''
    umkmData.jenisUsaha = auth.user.umkm.jenisUsaha || ''
    umkmData.alamat = auth.user.umkm.alamat || ''
  }
})

function handleFotoChange(event) {
  const file = event.target.files?.[0]
  if (file) {
    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      notificationStore.error('Ukuran foto maksimal 5MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const base64 = e.target?.result
        const success = auth.updateProfile({ fotoProfil: base64 })
        if (success) {
          notificationStore.success('Foto profil berhasil diubah')
        } else {
          notificationStore.error('Gagal menyimpan foto profil')
        }
      } catch (err) {
        notificationStore.error('Error mengubah foto profil')
        console.error('Foto change error:', err)
      }
    }
    reader.onerror = () => {
      notificationStore.error('Gagal membaca file')
    }
    reader.readAsDataURL(file)
  }
}

function handleSaveUmkm() {
  if (!umkmData.nama.trim()) {
    notificationStore.error('Nama UMKM harus diisi')
    return
  }
  if (!umkmData.jenisUsaha.trim()) {
    notificationStore.error('Jenis usaha harus diisi')
    return
  }
  if (!umkmData.alamat.trim()) {
    notificationStore.error('Alamat harus diisi')
    return
  }

  try {
    const success = auth.updateProfile({
      namaUmkm: umkmData.nama,
      jenisUsaha: umkmData.jenisUsaha,
      alamat: umkmData.alamat
    })

    if (success) {
      editMode.value = false
      notificationStore.success('Informasi UMKM berhasil diperbarui')
    } else {
      const errorMsg = auth.error || 'Gagal menyimpan perubahan'
      notificationStore.error(errorMsg)
    }
  } catch (err) {
    notificationStore.error('Gagal menyimpan perubahan: ' + (err.message || 'Unknown error'))
    console.error('Save UMKM error:', err)
  }
}

function handleLogout() {
  auth.logout()
  router.push('/login')
}
</script>
