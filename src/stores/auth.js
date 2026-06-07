import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(JSON.parse(localStorage.getItem('umkm_user')) || null)
  const token = ref(localStorage.getItem('umkm_token') || null)
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const isLoggedIn = computed(() => !!token.value && !!user.value)
  const isPemilik = computed(() => user.value?.role === 'pemilik')
  const isAdmin = computed(() => user.value?.role === 'admin')
  const fullName = computed(() => user.value?.nama || '')

  // Actions
  async function login(email, password) {
    loading.value = true
    error.value = null
    try {
      // TODO: Ganti dengan API call nyata
      // const res = await api.post('/auth/login', { email, password })
      // Simulasi login sementara
      const mockUsers = {
        'pemilik@umkm.com': { 
          id: 1, 
          nama: 'Pemilik UMKM', 
          email: 'pemilik@umkm.com', 
          role: 'pemilik',
          umkm: {
            nama: 'UMKM Jaya',
            jenisUsaha: 'Retail & Perdagangan',
            alamat: 'Jl. MT Haryomo No. 13, Balikpapan'
          },
          fotoProfil: null
        },
        'admin@umkm.com': { 
          id: 2, 
          nama: 'Admin', 
          email: 'admin@umkm.com', 
          role: 'admin',
          umkm: {
            nama: 'Admin UMKM',
            jenisUsaha: 'Administrasi',
            alamat: 'Balikpapan'
          },
          fotoProfil: null
        }
      }
      
      // Cek di mock users dulu
      let userData = mockUsers[email]
      
      // Jika tidak ada, cek di registered users
      if (!userData) {
        const registeredUsers = JSON.parse(localStorage.getItem('umkm_registered_users') || '{}')
        const registered = registeredUsers[email]
        if (registered && registered.password === password) {
          userData = {
            id: registered.id,
            nama: registered.nama,
            email: registered.email,
            role: registered.role,
            umkm: registered.umkm || {
              nama: '',
              jenisUsaha: '',
              alamat: ''
            },
            fotoProfil: registered.fotoProfil || null
          }
        }
      }
      
      // Validate password untuk mock users
      if (userData && email in mockUsers && password !== 'password123') {
        throw new Error('Email atau password salah')
      }
      
      if (!userData) {
        throw new Error('Email atau password salah')
      }
      
      const mockToken = 'mock_token_' + Date.now()

      user.value = userData
      token.value = mockToken
      localStorage.setItem('umkm_user', JSON.stringify(userData))
      localStorage.setItem('umkm_token', mockToken)
      return { success: true }
    } catch (err) {
      error.value = err.message
      return { success: false, message: err.message }
    } finally {
      loading.value = false
    }
  }

  async function register(payload) {
    loading.value = true
    error.value = null
    try {
      // TODO: Ganti dengan API call nyata
      // const res = await api.post('/auth/register', payload)
      
      // Simulasi registrasi - simpan ke localStorage
      const registeredUsers = JSON.parse(localStorage.getItem('umkm_registered_users') || '{}')
      
      if (registeredUsers[payload.email]) {
        throw new Error('Email sudah terdaftar')
      }
      
      const newUser = {
        id: Date.now(),
        nama: payload.nama,
        email: payload.email,
        password: payload.password, // Dalam produksi harus di-hash
        role: 'pemilik', // Default role untuk user baru
        umkm: {
          nama: payload.namaUmkm || '',
          jenisUsaha: payload.jenisUsaha || '',
          alamat: payload.alamat || ''
        },
        fotoProfil: null // base64 atau URL untuk foto profil
      }
      
      registeredUsers[payload.email] = newUser
      localStorage.setItem('umkm_registered_users', JSON.stringify(registeredUsers))
      
      return { success: true, message: 'Registrasi berhasil! Silakan login.' }
    } catch (err) {
      error.value = err.message
      return { success: false, message: err.message }
    } finally {
      loading.value = false
    }
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('umkm_user')
    localStorage.removeItem('umkm_token')
  }

  function updateProfile(updates) {
    if (!user.value) {
      error.value = 'User tidak ditemukan'
      return false
    }
    
    try {
      // Pastikan struktur umkm ada
      if (!user.value.umkm) {
        user.value.umkm = {
          nama: '',
          jenisUsaha: '',
          alamat: ''
        }
      }
      
      // Update user object
      if (updates.nama) user.value.nama = updates.nama
      if (updates.fotoProfil !== undefined) user.value.fotoProfil = updates.fotoProfil
      
      // Update UMKM info
      if (updates.namaUmkm !== undefined) user.value.umkm.nama = updates.namaUmkm
      if (updates.jenisUsaha !== undefined) user.value.umkm.jenisUsaha = updates.jenisUsaha
      if (updates.alamat !== undefined) user.value.umkm.alamat = updates.alamat
      
      // Simpan ke localStorage umkm_user
      const userString = JSON.stringify(user.value)
      localStorage.setItem('umkm_user', userString)
      
      // Update registered users juga jika user dari registered (bukan mock)
      if (user.value.email) {
        try {
          const registeredUsersString = localStorage.getItem('umkm_registered_users')
          if (registeredUsersString) {
            const registeredUsers = JSON.parse(registeredUsersString)
            
            if (registeredUsers[user.value.email]) {
              registeredUsers[user.value.email] = JSON.parse(userString)
              localStorage.setItem('umkm_registered_users', JSON.stringify(registeredUsers))
            }
          }
        } catch (err) {
          console.warn('Failed to update registered users:', err)
          // Tetap return true karena umkm_user sudah tersimpan
        }
      }
      
      error.value = null
      return true
    } catch (err) {
      error.value = err.message || 'Gagal menyimpan perubahan'
      console.error('Update profile error:', err)
      return false
    }
  }

  return {
    user, token, loading, error,
    isLoggedIn, isPemilik, isAdmin, fullName,
    login, register, logout, updateProfile
  }
}, {
  persist: false // kita handle manual via localStorage di atas
})