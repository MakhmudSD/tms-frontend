import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/orders'
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../pages/Login.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/orders',
      name: 'Orders',
      component: () => import('../pages/Orders.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/drivers',
      name: 'Drivers',
      component: () => import('../pages/Drivers.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/tracking',
      name: 'Tracking',
      component: () => import('../pages/Tracking.vue'),
      meta: { requiresAuth: false } // Public tracking page
    },
    {
      path: '/database-test',
      name: 'DatabaseTest',
      component: () => import('../pages/DatabaseTest.vue'),
      meta: { requiresAuth: false } // Public test page
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../pages/NotFound.vue')
    }
  ]
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Initialize auth state from localStorage
  authStore.initializeAuth()
  
  const requiresAuth = to.meta.requiresAuth !== false
  const isAuthenticated = authStore.isAuthenticated
  
  if (requiresAuth && !isAuthenticated) {
    // Redirect to login if authentication is required but user is not authenticated
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    // Redirect to orders if user is already authenticated and trying to access login
    next('/orders')
  } else {
    next()
  }
})

export default router
