import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false, speed: 400, minimum: 0.15 })

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../pages/Login.vue'),
    meta: { public: true }
  },
  {
    path: '/super-login',
    name: 'SuperLogin',
    component: () => import('../pages/SuperLogin.vue'),
    meta: { public: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../pages/Login.vue'),
    meta: { public: true, initialMode: 'register' }
  },
  {
    path: '/',
    component: () => import('../components/Layout.vue'),
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('../pages/Dashboard.vue'),
        meta: { roles: ['admin', 'cashier', 'member'] }
      },
      {
        path: 'activities',
        name: 'Activities',
        component: () => import('../pages/Activities.vue'),
        meta: { roles: ['admin'] }
      },
      {
        path: 'shop',
        name: 'Shop',
        component: () => import('../pages/Shop.vue'),
        meta: { roles: ['admin', 'cashier', 'member'] }
      },
      {
        path: 'subscriptions',
        name: 'Subscriptions',
        component: () => import('../pages/Subscriptions.vue'),
        meta: { roles: ['admin', 'cashier'] }
      },
      {
        path: 'members',
        name: 'Members',
        component: () => import('../pages/Members.vue'),
        meta: { roles: ['admin', 'cashier'] }
      },
      {
        path: 'tickets',
        name: 'Tickets',
        component: () => import('../pages/Tickets.vue'),
        meta: { roles: ['admin', 'cashier'] }
      },
      {
        path: 'access',
        name: 'AccessControl',
        component: () => import('../pages/AccessControl.vue'),
        meta: { roles: ['admin', 'controller'] }
      },
      {
        path: 'cash-register',
        name: 'CashRegister',
        component: () => import('../pages/CashRegister.vue'),
        meta: { roles: ['admin', 'cashier'] }
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('../pages/Users.vue'),
        meta: { roles: ['admin'] }
      },
      {
        path: 'super',
        name: 'SuperDashboard',
        component: () => import('../pages/SuperDashboard.vue'),
        meta: { roles: ['superadmin'] }
      },
      {
        path: 'super/gyms',
        name: 'SuperGyms',
        component: () => import('../pages/SuperGyms.vue'),
        meta: { roles: ['superadmin'] }
      },
      {
        path: 'super/subscriptions',
        name: 'SuperSubscriptions',
        component: () => import('../pages/SuperSubscriptions.vue'),
        meta: { roles: ['superadmin'] }
      },
      {
        path: 'super/admins',
        name: 'SuperAdmins',
        component: () => import('../pages/SuperAdmins.vue'),
        meta: { roles: ['superadmin'] }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const publicPages = new Set(['Login', 'Register', 'SuperLogin'])

const getRedirectForGuest = (path: string) => (
  path.startsWith('/super')
    ? { name: 'SuperLogin' as const }
    : { name: 'Login' as const }
)

const getRedirectForRole = (role: string) => {
  if (role === 'superadmin') return { name: 'SuperDashboard' as const }
  if (role === 'controller') return { name: 'AccessControl' as const }
  return { name: 'Dashboard' as const }
}

router.beforeEach((to, from, next) => {
  if (to.path !== from.path) {
    NProgress.start()
  }

  const authStore = useAuthStore()
  const user = authStore.user
  const authRequired = !publicPages.has(to.name as string)
  const roles = to.meta.roles as string[] | undefined

  if (authRequired && !user) {
    next(getRedirectForGuest(to.path))
    return
  }

  if (!roles || !user) {
    next()
    return
  }

  if (roles.includes(user.role)) {
    next()
    return
  }

  next(getRedirectForRole(user.role))
})

router.afterEach(() => {
  NProgress.done()
})

export default router
