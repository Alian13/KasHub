# 📊 KasHub - Sistem Manajemen Keuangan UMKM 

Aplikasi web modern untuk mengelola keuangan Usaha Mikro, Kecil, dan Menengah (UMKM) dengan antarmuka yang user-friendly dan fitur-fitur lengkap untuk monitoring stok, transaksi, dan laporan keuangan.

## ✨ Fitur Utama

- **🔐 Autentikasi & Otorisasi**: Sistem login/register dengan role-based access control (RBAC)
  - Role: Pemilik dan Admin
  - Session management dengan inactivity warning
  
- **📈 Dashboard**: Visualisasi data keuangan dan ringkasan bisnis secara real-time
  - Overview keuangan
  - Statistik penjualan
  - Grafik dan analytics

- **📦 Manajemen Stok**: Kelola inventori produk
  - Tambah/edit/hapus produk
  - Tracking stok barang
  - Alert stok minimum

- **💰 Pencatatan Transaksi**: Catat semua transaksi bisnis
  - Input transaksi penjualan/pembelian
  - Histori transaksi lengkap
  - Filter dan pencarian data

- **📋 Laporan Keuangan**: Generate laporan bisnis profesional
  - Laporan penjualan
  - Laporan stok
  - Export PDF
  - Analisis keuangan

- **🔔 Notification Center**: Pusat notifikasi untuk alert dan informasi penting
  - Real-time notifications
  - History notifikasi

- **⏱️ Inactivity Warning**: Sistem keamanan dengan notifikasi ketika user tidak aktif
  - Auto logout protection
  - Session timeout management

## 🛠️ Tech Stack

- **Frontend Framework**: [Vue 3](https://vuejs.org/) - Progressive JavaScript framework
- **Build Tool**: [Vite](https://vitejs.dev/) - Next generation frontend tooling
- **State Management**: [Pinia](https://pinia.vuejs.org/) - Official state management library untuk Vue 3
- **Routing**: [Vue Router 4](https://router.vuejs.org/) - Official router untuk Vue.js
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **HTTP Client**: [Axios](https://axios-http.com/) - Promise based HTTP client
- **PDF Generation**: [jsPDF](https://github.com/parallax/jsPDF) - PDF document generation
- **Package Manager**: npm

## 📋 Persyaratan Sistem

- Node.js v16 atau lebih tinggi
- npm v7 atau lebih tinggi

## 🚀 Instalasi

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd umkm-finance
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Jalankan development server**
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan di `http://localhost:5173`

4. **Build untuk production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## 📁 Struktur Proyek

```
src/
├── assets/              # Static assets (images, fonts, etc)
├── components/          # Vue components
│   ├── common/         # Komponen reusable (InactivityWarning, NotificationCenter)
│   ├── dashboard/      # Dashboard components
│   ├── layout/         # Layout components (AppLayout)
│   ├── laporan/        # Report components
│   ├── stok/           # Inventory components
│   └── transaksi/      # Transaction components
├── composables/         # Vue composables (useInactivityTimer)
├── router/             # Vue Router configuration
├── stores/             # Pinia stores (state management)
│   ├── auth.js        # Authentication store
│   ├── notification.js # Notification store
│   ├── stok.js        # Inventory store
│   └── transaksi.js   # Transaction store
├── utils/              # Utility functions (helpers)
├── views/              # Page components
│   ├── DashboardView.vue
│   ├── LaporanView.vue
│   ├── LoginView.vue
│   ├── ProfilView.vue
│   ├── RegisterView.vue
│   ├── StokView.vue
│   └── TransaksiView.vue
├── App.vue            # Root component
└── main.js            # Application entry point
```

## 🔐 Sistem Autentikasi & Otorisasi

### Role-Based Access Control (RBAC)

- **Pemilik**: Akses ke Dashboard, Stok, dan Laporan
- **Admin**: Akses ke semua fitur termasuk Transaksi

### Protected Routes

Aplikasi menggunakan navigation guards untuk melindungi routes berdasarkan:
- Status autentikasi (requiresAuth)
- Status guest (requiresGuest)
- Role user (roles)

## 💾 State Management (Pinia Stores)

### auth.js
Mengelola state autentikasi:
- User login/logout
- User data
- Token management
- Role management

### notification.js
Mengelola notifikasi:
- Add notification
- Remove notification
- Clear notifications

### stok.js
Mengelola data stok:
- List produk
- CRUD operations
- Stock tracking

### transaksi.js
Mengelola transaksi:
- List transaksi
- CRUD operations
- Filter dan sorting

## 🎨 UI/UX

- **Responsive Design**: Mobile-friendly menggunakan Tailwind CSS
- **Modern Styling**: Utility-first CSS approach
- **Component Based**: Modular component architecture
- **Consistent Theme**: Unified design system across the app

## 🔧 Pengembangan

### Menambah Komponen Baru

Buat file `.vue` di folder `components/` yang sesuai dengan kategorinya:
```vue
<script setup>
// Your logic here
</script>

<template>
  <!-- Your template here -->
</template>
```

### Menambah Halaman Baru

1. Buat komponen di folder `views/`
2. Tambahkan route di `src/router/index.js`
3. Update navigation jika diperlukan

### Menambah Store Baru

Buat file di `src/stores/` dan export dari Pinia:
```javascript
import { defineStore } from 'pinia'

export const useYourStore = defineStore('your-store', {
  state: () => ({}),
  getters: {},
  actions: {}
})
```

## 📝 Notes

- Aplikasi menggunakan Vue 3 `<script setup>` syntax
- State management menggunakan Pinia untuk reaktivitas optimal
- Styling menggunakan Tailwind CSS v4
- HTTP requests menggunakan Axios

## 📞 Support & Dokumentasi

- [Vue 3 Documentation](https://vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vue Router Documentation](https://router.vuejs.org/)

---

**Dibuat untuk memenuhi mata kuliah KBT (Kewirausahaan Berbasis Teknologi) - UMKM Finance Management System**
