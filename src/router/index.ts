import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LoginPage from '@/pages/LoginPage.vue'
import DashboardPage from '@/pages/DashboardPage.vue'
import CRMDashboardPage from '@/pages/CRMDashboardPage.vue'

import CustomersPage from '@/pages/CustomersPage.vue'
import LeadsPage from '@/pages/LeadsPage.vue'
import ProspectsPage from '@/pages/ProspectsPage.vue'
import SalesPipelinePage from '@/pages/SalesPipelinePage.vue'
import SalesPipelineDetailView from '../views/crm/SalesPipelineDetailView.vue'
import QuotationPage from '../pages/QuotationsPage.vue'
import QuotationDetailView from '../views/crm/QuotationDetailView.vue'

import CustomerDetailView from '@/views/crm/CustomerDetailView.vue'
import LeadDetailView from '@/views/crm/LeadDetailView.vue'
import ProspectDetailView from '@/views/crm/ProspectDetailView.vue'
import OrderListView from '@/views/crm/OrderListView.vue'
// No change to file content here, just updating router.

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
      meta: { requiresAuth: true, breadcrumbs: [{ label: 'Home', to: '/dashboard' }, { label: 'Dashboard' }] },
    },
    {
      path: '/crm',
      name: 'crm',
      component: CRMDashboardPage,
      meta: { requiresAuth: true, breadcrumbs: [{ label: 'Home', to: '/dashboard' }, { label: 'CRM' }] },
    },
    {
      path: '/customers',
      name: 'customers',
      component: CustomersPage,
      meta: { requiresAuth: true, breadcrumbs: [{ label: 'Home', to: '/dashboard' }, { label: 'Customers' }] },
    },
    {
      path: '/quotations',
      name: 'Quotations',
      component: QuotationPage, // Using the already imported QuotationPage
      meta: { requiresAuth: true, breadcrumbs: [{ name: 'Home', path: '/dashboard' }, { name: 'Quotations', path: '/quotations' }] }
    },
    {
      path: '/quotations/:uuid',
      name: 'QuotationDetail',
      component: QuotationDetailView,
      meta: { requiresAuth: true, breadcrumbs: [{ name: 'Home', path: '/dashboard' }, { name: 'Quotations', path: '/quotations' }, { name: 'Detail', path: '' }] }
    },
    {
      path: '/leads',
      name: 'leads',
      component: LeadsPage,
      meta: { requiresAuth: true, breadcrumbs: [{ label: 'Home', to: '/dashboard' }, { label: 'Leads' }] },
    },
    {
      path: '/prospects',
      name: 'prospects',
      component: ProspectsPage,
      meta: { requiresAuth: true, breadcrumbs: [{ label: 'Home', to: '/dashboard' }, { label: 'Prospects' }] },
    },

      {
        path: '/crm/customers/:uuid',
        name: 'crm-customer-detail',
        component: CustomerDetailView,
        meta: { 
          requiresAuth: true, 
          breadcrumbs: [
            { label: 'Home', to: '/dashboard' }, 
            { label: 'Customers', to: '/customers' }, 
            { label: 'Detail' }
          ] 
        },
      },
      {
        path: '/crm/quotations',
        name: 'crm-quotations',
        component: QuotationPage,
        meta: { requiresAuth: true, breadcrumbs: [{ label: 'Home', to: '/dashboard' }, { label: 'CRM', to: '/crm' }, { label: 'Quotations' }] },
      },
      {
        path: '/crm/orders',
        name: 'crm-orders',
        component: OrderListView,
        meta: { requiresAuth: true, breadcrumbs: [{ label: 'Home', to: '/dashboard' }, { label: 'CRM', to: '/crm' }, { label: 'Orders' }] },
      },
      {
        path: '/crm/leads/:uuid',
        name: 'crm-lead-detail',
        component: LeadDetailView,
        meta: { 
          requiresAuth: true, 
          breadcrumbs: [
            { label: 'Home', to: '/dashboard' }, 
            { label: 'Leads', to: '/leads' }, 
            { label: 'Detail' }
          ] 
        },
      },
      {
        path: '/crm/prospects/:uuid',
        name: 'crm-prospect-detail',
        component: ProspectDetailView,
        meta: { 
          requiresAuth: true, 
          breadcrumbs: [
            { label: 'Home', to: '/dashboard' }, 
            { label: 'Prospects', to: '/prospects' }, 
            { label: 'Detail' }
          ] 
        },
      },
      {
        path: '/crm/pipelines',
        name: 'crm-pipelines',
        component: SalesPipelinePage,
        meta: { requiresAuth: true, breadcrumbs: [{ label: 'Home', to: '/dashboard' }, { label: 'CRM', to: '/crm' }, { label: 'Pipelines' }] },
      },
      {
        path: '/crm/pipelines/:uuid',
        name: 'crm-pipeline-detail',
        component: SalesPipelineDetailView,
        meta: { 
          requiresAuth: true, 
          breadcrumbs: [
            { label: 'Home', to: '/dashboard' }, 
            { label: 'CRM', to: '/crm' }, 
            { label: 'Pipelines', to: '/crm/pipelines' },
            { label: 'Detail' }
          ] 
        },
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
