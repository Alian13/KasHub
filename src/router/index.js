import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/RegisterView.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/',
    component: () => import('@/components/layout/AppLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/dashboard'
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/DashboardView.vue'),
        meta: { roles: ['pemilik', 'admin'] }
      },
      {
        path: 'stok',
        name: 'Stok',
        component: () => import('@/views/StokView.vue'),
        meta: { roles: ['pemilik', 'admin'] }
      },
      {
        path: 'transaksi',
        name: 'Transaksi',
        component: () => import('@/views/TransaksiView.vue'),
        meta: { roles: ['admin'] }
      },
      {
        path: 'laporan',
        name: 'Laporan',
        component: () => import('@/views/LaporanView.vue'),
        meta: { roles: ['pemilik', 'admin'] }
      },
      {
        path: 'profil',
        name: 'Profil',
        component: () => import('@/views/ProfilView.vue'),
        meta: { roles: ['pemilik', 'admin'] }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation Guard
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return next({ name: 'Login' })
  }

  if (to.meta.requiresGuest && auth.isLoggedIn) {
    return next({ name: 'Dashboard' })
  }

  if (to.meta.roles && !to.meta.roles.includes(auth.user?.role)) {
    return next({ name: 'Dashboard' })
  }

  next()
})

export default router