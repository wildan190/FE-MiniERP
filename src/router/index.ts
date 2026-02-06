import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LoginPage from '@/pages/LoginPage.vue'
import DashboardPage from '@/pages/DashboardPage.vue'
import CRMDashboardPage from '@/pages/CRMDashboardPage.vue'
import CustomersPage from '@/pages/CustomersPage.vue'
import LeadsPage from '@/pages/LeadsPage.vue'
import ProspectsPage from '@/pages/ProspectsPage.vue'
import SalesPipelinePage from '@/pages/SalesPipelinePage.vue'
import QuotationPage from '@/pages/QuotationPage.vue'
import CustomerListView from '@/views/crm/CustomerListView.vue'
import CustomerDetailView from '@/views/crm/CustomerDetailView.vue'
import OrderListView from '@/views/crm/OrderListView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
      meta: { requiresAuth: false },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/crm',
      name: 'crm',
      component: CRMDashboardPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/customers',
      name: 'customers',
      component: CustomersPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/leads',
      name: 'leads',
      component: LeadsPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/prospects',
      name: 'prospects',
      component: ProspectsPage,
      meta: { requiresAuth: true },
    },
      {
        path: '/crm/customers',
        name: 'crm-customers',
        component: CustomerListView,
        meta: { requiresAuth: true },
      },
      {
        path: '/crm/customers/:id',
        name: 'crm-customer-detail',
        component: CustomerDetailView,
        meta: { requiresAuth: true },
      },
      {
        path: '/crm/quotations',
        name: 'crm-quotations',
        component: QuotationPage,
        meta: { requiresAuth: true },
      },
      {
        path: '/crm/orders',
        name: 'crm-orders',
        component: OrderListView,
        meta: { requiresAuth: true },
      },
      {
        path: '/crm/pipelines',
        name: 'crm-pipelines',
        component: SalesPipelinePage,
        meta: { requiresAuth: true },
      },
  ],
})

// Navigation Guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  authStore.loadUser()

  const requiresAuth = to.meta.requiresAuth !== false
  const isAuthenticated = authStore.isAuthenticated

  // If route requires auth and user is not authenticated, redirect to login
  if (requiresAuth && !isAuthenticated) {
    next('/login')
  }
  // If user is authenticated and trying to access login page, redirect to dashboard
  else if (to.path === '/login' && isAuthenticated) {
    next('/dashboard')
  }
  // Otherwise, allow navigation
  else {
    next()
  }
})

export default router
