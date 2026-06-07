import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

const DEFAULT_TRANSAKSI = [
  { id: 1, tipe: 'pemasukan',   kategori: 'Penjualan',   nominal: 350000, keterangan: 'Penjualan harian',    tanggal: '2025-01-20', dicatat_oleh: 'admin' },
  { id: 2, tipe: 'pengeluaran', kategori: 'Operasional', nominal: 50000,  keterangan: 'Listrik',             tanggal: '2025-01-20', dicatat_oleh: 'admin' },
  { id: 3, tipe: 'pemasukan',   kategori: 'Penjualan',   nominal: 520000, keterangan: 'Penjualan harian',    tanggal: '2025-01-21', dicatat_oleh: 'admin' },
  { id: 4, tipe: 'pengeluaran', kategori: 'Restok',      nominal: 200000, keterangan: 'Beli beras 10 karung',tanggal: '2025-01-21', dicatat_oleh: 'admin' },
  { id: 5, tipe: 'pemasukan',   kategori: 'Penjualan',   nominal: 410000, keterangan: 'Penjualan harian',    tanggal: '2025-01-22', dicatat_oleh: 'admin' },
]

// Fungsi untuk load data dari localStorage
const loadTransaksiFromStorage = () => {
  try {
    const stored = localStorage.getItem('umkm_transaksi')
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (err) {
    console.warn('Gagal load transaksi dari localStorage:', err)
  }
  return DEFAULT_TRANSAKSI
}

// Fungsi untuk simpan data ke localStorage
const saveTransaksiToStorage = (data) => {
  try {
    localStorage.setItem('umkm_transaksi', JSON.stringify(data))
  } catch (err) {
    console.warn('Gagal simpan transaksi ke localStorage:', err)
  }
}

export const useTransaksiStore = defineStore('transaksi', () => {
  const transaksi = ref(loadTransaksiFromStorage())
  const loading = ref(false)
  const error = ref(null)

  const totalPemasukan  = computed(() =>
    transaksi.value.filter(t => t.tipe === 'pemasukan').reduce((s, t) => s + t.nominal, 0)
  )
  const totalPengeluaran = computed(() =>
    transaksi.value.filter(t => t.tipe === 'pengeluaran').reduce((s, t) => s + t.nominal, 0)
  )
  const labaRugi = computed(() => totalPemasukan.value - totalPengeluaran.value)

  // Watch perubahan transaksi dan simpan ke localStorage
  watch(
    () => transaksi.value,
    (newVal) => saveTransaksiToStorage(newVal),
    { deep: true }
  )

  const transaksiHariIni = computed(() => {
    const hari = new Date().toISOString().slice(0, 10)
    return transaksi.value.filter(t => t.tanggal === hari)
  })

  // Data untuk grafik (7 hari terakhir)
  const dataGrafik = computed(() => {
    const hari7 = Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (6 - i))
      return d.toISOString().slice(0, 10)
    })
    return hari7.map(tgl => {
      const masuk = transaksi.value
        .filter(t => t.tanggal === tgl && t.tipe === 'pemasukan')
        .reduce((s, t) => s + t.nominal, 0)
      const keluar = transaksi.value
        .filter(t => t.tanggal === tgl && t.tipe === 'pengeluaran')
        .reduce((s, t) => s + t.nominal, 0)
      return { tanggal: tgl, pemasukan: masuk, pengeluaran: keluar }
    })
  })

  function tambahTransaksi(data) {
    const id = Math.max(...transaksi.value.map(t => t.id), 0) + 1
    const tanggal = data.tanggal || new Date().toISOString().slice(0, 10)
    transaksi.value.unshift({ id, ...data, tanggal })
  }

  function hapusTransaksi(id) {
    transaksi.value = transaksi.value.filter(t => t.id !== id)
  }

  return {
    transaksi, loading, error,
    totalPemasukan, totalPengeluaran, labaRugi,
    transaksiHariIni, dataGrafik,
    tambahTransaksi, hapusTransaksi
  }
})
