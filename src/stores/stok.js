import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

const DEFAULT_PRODUK = [
  { id: 1, nama: 'Beras 5kg',       kategori: 'Sembako', stok: 45, stokMin: 10, harga: 65000,  satuan: 'karung' },
  { id: 2, nama: 'Minyak Goreng 2L', kategori: 'Sembako', stok: 8,  stokMin: 10, harga: 32000,  satuan: 'botol'  },
  { id: 3, nama: 'Gula Pasir 1kg',  kategori: 'Sembako', stok: 2,  stokMin: 5,  harga: 15000,  satuan: 'bungkus'},
  { id: 4, nama: 'Teh Botol 500ml', kategori: 'Minuman', stok: 60, stokMin: 12, harga: 4500,   satuan: 'botol'  },
  { id: 5, nama: 'Sabun Mandi',     kategori: 'Kebersihan', stok: 30, stokMin: 8, harga: 8000, satuan: 'pcs'   },
]

// Fungsi untuk load data dari localStorage
const loadProdukFromStorage = () => {
  try {
    const stored = localStorage.getItem('umkm_stok_produk')
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (err) {
    console.warn('Gagal load produk dari localStorage:', err)
  }
  return DEFAULT_PRODUK
}

// Fungsi untuk simpan data ke localStorage
const saveProdukToStorage = (data) => {
  try {
    localStorage.setItem('umkm_stok_produk', JSON.stringify(data))
  } catch (err) {
    console.warn('Gagal simpan produk ke localStorage:', err)
  }
}

export const useStokStore = defineStore('stok', () => {
  const produk = ref(loadProdukFromStorage())
  const loading = ref(false)
  const error = ref(null)

  // Status stok: hijau = aman, kuning = hampir habis, merah = habis/kritis
  const statusStok = (item) => {
    const rasio = item.stok / item.stokMin
    if (rasio <= 0.5) return 'merah'
    if (rasio <= 1)   return 'kuning'
    return 'hijau'
  }

  const stokKritis  = computed(() => produk.value.filter(p => statusStok(p) === 'merah'))
  const stokHampirHabis = computed(() => produk.value.filter(p => statusStok(p) === 'kuning'))
  const totalProduk = computed(() => produk.value.length)
  const adaNotifikasi = computed(() => stokKritis.value.length > 0 || stokHampirHabis.value.length > 0)

  // Watch perubahan produk dan simpan ke localStorage
  watch(
    () => produk.value,
    (newVal) => saveProdukToStorage(newVal),
    { deep: true }
  )

  function tambahProduk(data) {
    const id = Math.max(...produk.value.map(p => p.id), 0) + 1
    produk.value.push({ id, ...data })
  }

  function updateProduk(id, data) {
    const idx = produk.value.findIndex(p => p.id === id)
    if (idx !== -1) produk.value[idx] = { ...produk.value[idx], ...data }
  }

  function updateStok(id, jumlah) {
    const item = produk.value.find(p => p.id === id)
    if (item) item.stok += jumlah
  }

  function hapusProduk(id) {
    produk.value = produk.value.filter(p => p.id !== id)
  }

  return {
    produk, loading, error,
    statusStok, stokKritis, stokHampirHabis,
    totalProduk, adaNotifikasi,
    tambahProduk, updateProduk, updateStok, hapusProduk
  }
})
