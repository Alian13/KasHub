// Format angka ke format Rupiah
export function formatRupiah(angka) {
  if (angka === null || angka === undefined) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(angka)
}

// Format tanggal ke format Indonesia
export function formatTanggal(tanggal, format = 'panjang') {
  if (!tanggal) return '-'
  const d = new Date(tanggal)
  if (format === 'pendek') {
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
  }
  return d.toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })
}

// Format tanggal singkat untuk label grafik
export function formatTanggalLabel(tanggal) {
  const d = new Date(tanggal)
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
}

// Hitung persentase perubahan
export function persenPerubahan(sekarang, sebelumnya) {
  if (!sebelumnya || sebelumnya === 0) return 0
  return ((sekarang - sebelumnya) / sebelumnya * 100).toFixed(1)
}

// Singkat angka besar (1.5jt, 2.3rb)
export function singkatAngka(angka) {
  if (angka >= 1_000_000) return (angka / 1_000_000).toFixed(1) + 'jt'
  if (angka >= 1_000) return (angka / 1_000).toFixed(0) + 'rb'
  return angka.toString()
}

// Warna status stok
export function warnaStok(status) {
  return {
    hijau:  { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'Aman' },
    kuning: { bg: 'bg-amber-100',   text: 'text-amber-700',   dot: 'bg-amber-500',   label: 'Hampir Habis' },
    merah:  { bg: 'bg-red-100',     text: 'text-red-700',     dot: 'bg-red-500',     label: 'Kritis' },
  }[status] || {}
}
