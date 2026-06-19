<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-slate-800">Laporan Keuangan</h1>
      <button
        @click="downloadPDF"
        :disabled="isDownloading"
        class="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg v-if="!isDownloading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        <svg v-else class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        {{ isDownloading ? 'Memproses...' : 'Unduh PDF' }}
      </button>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
        <p class="text-emerald-600 text-sm font-medium">Total Pemasukan</p>
        <p class="text-3xl font-bold text-emerald-700 mt-2">{{ formatRupiah(transaksiStore.totalPemasukan) }}</p>
      </div>
      <div class="bg-red-50 border border-red-200 rounded-xl p-6">
        <p class="text-red-600 text-sm font-medium">Total Pengeluaran</p>
        <p class="text-3xl font-bold text-red-700 mt-2">{{ formatRupiah(transaksiStore.totalPengeluaran) }}</p>
      </div>
      <div
        :class="[
          'rounded-xl p-6',
          transaksiStore.labaRugi >= 0
            ? 'bg-emerald-50 border border-emerald-200'
            : 'bg-red-50 border border-red-200'
        ]"
      >
        <p :class="transaksiStore.labaRugi >= 0 ? 'text-emerald-600' : 'text-red-600'" class="text-sm font-medium">
          Laba / Rugi
        </p>
        <p :class="transaksiStore.labaRugi >= 0 ? 'text-emerald-700' : 'text-red-700'" class="text-3xl font-bold mt-2">
          {{ formatRupiah(transaksiStore.labaRugi) }}
        </p>
      </div>
    </div>

    <!-- Input Form Pemasukan/Pengeluaran -->
    <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold text-slate-800">Tambah Transaksi</h3>
        <button
          @click="toggleForm"
          :class="['px-4 py-2 rounded-lg font-medium transition-colors', showInputForm ? 'bg-slate-200 text-slate-800' : 'bg-indigo-600 hover:bg-indigo-700 text-white']"
        >
          {{ showInputForm ? '✕ Tutup' : '➕ Buka Form' }}
        </button>
      </div>

      <div v-if="showInputForm" class="border-t pt-6">
        <form @submit.prevent="saveTransaction" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Tipe Transaksi *</label>
              <select
                v-model="formTransaction.tipe"
                class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Pilih Tipe</option>
                <option value="pemasukan">Pemasukan</option>
                <option value="pengeluaran">Pengeluaran</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Kategori *</label>
              <input
                v-model="formTransaction.kategori"
                type="text"
                placeholder="Contoh: Penjualan Produk"
                class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Nominal *</label>
              <input
                v-model.number="formTransaction.nominal"
                type="number"
                placeholder="0"
                min="0"
                class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Tanggal *</label>
              <input
                v-model="formTransaction.tanggal"
                type="date"
                class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Keterangan</label>
            <textarea
              v-model="formTransaction.keterangan"
              placeholder="Catatan transaksi..."
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 h-20"
            ></textarea>
          </div>

          <div class="flex gap-3 pt-4 border-t">
            <button
              type="button"
              @click="resetForm"
              class="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              class="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium"
            >
              Simpan Transaksi
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Transaksi Detail -->
    <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
      <h3 class="text-lg font-bold text-slate-800 mb-4">Rincian Transaksi</h3>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-slate-50">
            <tr>
              <th class="text-left px-4 py-3 text-sm font-semibold text-slate-700">Tanggal</th>
              <th class="text-left px-4 py-3 text-sm font-semibold text-slate-700">Kategori</th>
              <th class="text-left px-4 py-3 text-sm font-semibold text-slate-700">Tipe</th>
              <th class="text-right px-4 py-3 text-sm font-semibold text-slate-700">Nominal</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr
              v-for="item in transaksiStore.transaksi"
              :key="item.id"
              class="hover:bg-slate-50"
            >
              <td class="px-4 py-3 text-sm">{{ formatTanggal(item.tanggal, 'pendek') }}</td>
              <td class="px-4 py-3 text-sm">{{ item.kategori }}</td>
              <td class="px-4 py-3">
                <span
                  :class="[
                    'text-xs font-medium px-2 py-1 rounded',
                    item.tipe === 'pemasukan'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-red-100 text-red-700'
                  ]"
                >
                  {{ item.tipe === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran' }}
                </span>
              </td>
              <td :class="['px-4 py-3 text-sm font-bold text-right', item.tipe === 'pemasukan' ? 'text-emerald-600' : 'text-red-600']">
                {{ item.tipe === 'pemasukan' ? '+' : '-' }}{{ formatRupiah(item.nominal) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Stok Summary -->
    <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
      <h3 class="text-lg font-bold text-slate-800 mb-6">Ringkasan Stok</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Stok Aman -->
        <div class="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-6 border-2 border-emerald-200 hover:shadow-lg transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <div class="text-4xl">✅</div>
            <span class="text-xs font-semibold text-emerald-700 bg-emerald-200 px-3 py-1 rounded-full">Aman</span>
          </div>
          <p class="text-emerald-600 text-sm font-medium mb-2">Stok Aman</p>
          <p class="text-4xl font-bold text-emerald-700">
            {{ stokStore.produk.filter(p => stokStore.statusStok(p) === 'hijau').length }}
          </p>
          <p class="text-xs text-emerald-600 mt-3">
            {{ Math.round((stokStore.produk.filter(p => stokStore.statusStok(p) === 'hijau').length / stokStore.totalProduk) * 100) }}% dari total produk
          </p>
          <div class="mt-3 bg-emerald-200 h-2 rounded-full overflow-hidden">
            <div 
              :style="{ width: Math.round((stokStore.produk.filter(p => stokStore.statusStok(p) === 'hijau').length / stokStore.totalProduk) * 100) + '%' }"
              class="bg-emerald-600 h-full rounded-full transition-all"
            ></div>
          </div>
        </div>

        <!-- Stok Hampir Habis -->
        <div class="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-6 border-2 border-amber-200 hover:shadow-lg transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <div class="text-4xl">⚠️</div>
            <span class="text-xs font-semibold text-amber-700 bg-amber-200 px-3 py-1 rounded-full">Perhatian</span>
          </div>
          <p class="text-amber-600 text-sm font-medium mb-2">Stok Hampir Habis</p>
          <p class="text-4xl font-bold text-amber-700">{{ stokStore.stokHampirHabis.length }}</p>
          <p class="text-xs text-amber-600 mt-3">
            {{ Math.round((stokStore.stokHampirHabis.length / stokStore.totalProduk) * 100) }}% dari total produk
          </p>
          <div class="mt-3 bg-amber-200 h-2 rounded-full overflow-hidden">
            <div 
              :style="{ width: Math.round((stokStore.stokHampirHabis.length / stokStore.totalProduk) * 100) + '%' }"
              class="bg-amber-600 h-full rounded-full transition-all"
            ></div>
          </div>
        </div>

        <!-- Stok Kritis -->
        <div class="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6 border-2 border-red-200 hover:shadow-lg transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <div class="text-4xl">🚨</div>
            <span class="text-xs font-semibold text-red-700 bg-red-200 px-3 py-1 rounded-full">Kritis</span>
          </div>
          <p class="text-red-600 text-sm font-medium mb-2">Stok Kritis</p>
          <p class="text-4xl font-bold text-red-700">{{ stokStore.stokKritis.length }}</p>
          <p class="text-xs text-red-600 mt-3">
            {{ Math.round((stokStore.stokKritis.length / stokStore.totalProduk) * 100) }}% dari total produk
          </p>
          <div class="mt-3 bg-red-200 h-2 rounded-full overflow-hidden">
            <div 
              :style="{ width: Math.round((stokStore.stokKritis.length / stokStore.totalProduk) * 100) + '%' }"
              class="bg-red-600 h-full rounded-full transition-all"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useStokStore } from '@/stores/stok'
import { useTransaksiStore } from '@/stores/transaksi'
import { useNotificationStore } from '@/stores/notification'
import { formatRupiah, formatTanggal } from '@/utils/helpers'
import { jsPDF } from 'jspdf'

const stokStore = useStokStore()
const transaksiStore = useTransaksiStore()
const notificationStore = useNotificationStore()
const isDownloading = ref(false)
const showInputForm = ref(false)

const formTransaction = reactive({
  tipe: '',
  kategori: '',
  nominal: 0,
  keterangan: '',
  tanggal: new Date().toISOString().split('T')[0]
})

function toggleForm() {
  showInputForm.value = !showInputForm.value
  if (!showInputForm.value) {
    resetForm()
  }
}

function resetForm() {
  formTransaction.tipe = ''
  formTransaction.kategori = ''
  formTransaction.nominal = 0
  formTransaction.keterangan = ''
  formTransaction.tanggal = new Date().toISOString().split('T')[0]
}

function saveTransaction() {
  if (!formTransaction.tipe || !formTransaction.kategori.trim() || formTransaction.nominal <= 0) {
    notificationStore.error('Lengkapi semua field dengan benar!')
    return
  }
  
  transaksiStore.tambahTransaksi({
    tipe: formTransaction.tipe,
    kategori: formTransaction.kategori,
    nominal: formTransaction.nominal,
    keterangan: formTransaction.keterangan,
    tanggal: formTransaction.tanggal
  })
  
  notificationStore.success('Transaksi berhasil ditambahkan')
  resetForm()
  showInputForm.value = false
}

// Fungsi untuk membuat tabel di PDF
const createTable = (pdf, columns, data, startY, options = {}) => {
  const { fontSize = 10, headBgColor = [59, 130, 246], cellHeight = 7 } = options
  const pageWidth = pdf.internal.pageSize.getWidth()
  const margin = 14
  const availableWidth = pageWidth - margin * 2
  const columnWidth = availableWidth / columns.length

  let yPos = startY

  // Header
  pdf.setFontSize(fontSize)
  pdf.setFont('helvetica', 'bold')
  pdf.setFillColor(...headBgColor)
  pdf.setTextColor(255, 255, 255)

  columns.forEach((col, idx) => {
    pdf.rect(margin + idx * columnWidth, yPos, columnWidth, cellHeight, 'F')
    pdf.text(col, margin + idx * columnWidth + 2, yPos + 5)
  })

  yPos += cellHeight

  // Body
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(fontSize - 1)
  pdf.setTextColor(0, 0, 0)

  data.forEach((row) => {
    // Check if need new page
    if (yPos > pdf.internal.pageSize.getHeight() - 20) {
      pdf.addPage()
      yPos = 15
    }

    row.forEach((cell, idx) => {
      pdf.rect(margin + idx * columnWidth, yPos, columnWidth, cellHeight)
      pdf.text(String(cell), margin + idx * columnWidth + 2, yPos + 5)
    })
    yPos += cellHeight
  })

  return yPos + 5
}

const downloadPDF = async () => {
  isDownloading.value = true
  try {
    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4'
    })

    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    let yPosition = 15

    // Header
    pdf.setFontSize(18)
    pdf.setFont('helvetica', 'bold')
    pdf.text('LAPORAN KEUANGAN', pageWidth / 2, yPosition, { align: 'center' })

    yPosition += 10
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    pdf.text(`Tanggal: ${new Date().toLocaleDateString('id-ID')}`, pageWidth / 2, yPosition, { align: 'center' })

    yPosition += 15

    // RINGKASAN KEUANGAN
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'bold')
    pdf.text('RINGKASAN KEUANGAN', 14, yPosition)
    yPosition += 8

    const summaryColumns = ['Keterangan', 'Nominal']
    const summaryData = [
      ['Total Pemasukan', formatRupiah(transaksiStore.totalPemasukan)],
      ['Total Pengeluaran', formatRupiah(transaksiStore.totalPengeluaran)],
      ['Laba / Rugi', formatRupiah(transaksiStore.labaRugi)]
    ]

    yPosition = createTable(pdf, summaryColumns, summaryData, yPosition, { fontSize: 9 })
    yPosition += 10

    // RINCIAN TRANSAKSI
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'bold')
    pdf.text('RINCIAN TRANSAKSI', 14, yPosition)
    yPosition += 8

    const transaksiColumns = ['Tanggal', 'Kategori', 'Tipe', 'Nominal']
    const transaksiData = transaksiStore.transaksi.map(item => [
      formatTanggal(item.tanggal, 'pendek'),
      item.kategori,
      item.tipe === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran',
      formatRupiah(item.nominal)
    ])

    yPosition = createTable(pdf, transaksiColumns, transaksiData, yPosition, { fontSize: 8 })
    yPosition += 10

    // Check if need new page for stock summary
    if (pageHeight - yPosition < 80) {
      pdf.addPage()
      yPosition = 15
    }

    // RINGKASAN STOK
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'bold')
    pdf.text('RINGKASAN STOK PRODUK', 14, yPosition)
    yPosition += 8

    const stokAman = stokStore.produk.filter(p => stokStore.statusStok(p) === 'hijau').length
    const stokHampirHabis = stokStore.stokHampirHabis.length
    const stokKritis = stokStore.stokKritis.length

    const stokColumns = ['Status', 'Jumlah', 'Persentase']
    const stokData = [
      ['Stok Aman', stokAman, `${Math.round((stokAman / stokStore.totalProduk) * 100)}%`],
      ['Stok Hampir Habis', stokHampirHabis, `${Math.round((stokHampirHabis / stokStore.totalProduk) * 100)}%`],
      ['Stok Kritis', stokKritis, `${Math.round((stokKritis / stokStore.totalProduk) * 100)}%`],
      ['Total Produk', stokStore.totalProduk, '100%']
    ]

    createTable(pdf, stokColumns, stokData, yPosition, { fontSize: 9 })

    // Footer - Nomor halaman
    const totalPages = pdf.internal.pages.length - 1 // exclude first empty page
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i)
      pdf.setFontSize(8)
      pdf.setTextColor(150)
      pdf.text(
        `Halaman ${i} dari ${totalPages}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      )
    }

    // Download
    const fileName = `Laporan-Keuangan-${new Date().toISOString().split('T')[0]}.pdf`
    pdf.save(fileName)

  } catch (error) {
    console.error('Error generating PDF:', error)
    alert('Gagal mengunduh laporan. ' + error.message)
  } finally {
    isDownloading.value = false
  }
}
</script>
