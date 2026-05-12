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
import AppMenuView from '@/pages/AppMenuView.vue'
import DepartmentsPage from '@/pages/DepartmentsPage.vue'
import DepartmentDetailView from '@/views/hrm/DepartmentDetailView.vue'
import EmployeesPage from '@/pages/EmployeesPage.vue'
import EmployeeDetailView from '@/views/hrm/EmployeeDetailView.vue'
import OfficeLocationsPage from '@/pages/OfficeLocationsPage.vue'
// No change to file content here, just updating router.

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'menu',
      component: AppMenuView,
      meta: { requiresAuth: true },
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
      {
        path: '/hrm/departments',
        name: 'hrm-departments',
        component: DepartmentsPage,
        meta: { 
          requiresAuth: true, 
          breadcrumbs: [
            { label: 'Home', to: '/dashboard' }, 
            { label: 'HRM', to: '/hrm' }, 
            { label: 'Departments' }
          ] 
        },
      },
      {
        path: '/hrm/departments/:uuid',
        name: 'hrm-department-detail',
        component: DepartmentDetailView,
        meta: { 
          requiresAuth: true, 
          breadcrumbs: [
            { label: 'Home', to: '/dashboard' }, 
            { label: 'HRM', to: '/hrm' }, 
            { label: 'Departments', to: '/hrm/departments' },
            { label: 'Detail' }
          ] 
        },
      },
      {
        path: '/hrm/designations',
        name: 'hrm-designations',
        component: () => import('@/pages/DesignationsPage.vue'),
        meta: { 
          requiresAuth: true, 
          breadcrumbs: [
            { label: 'Home', to: '/dashboard' }, 
            { label: 'HRM', to: '/hrm' }, 
            { label: 'Designations' }
          ] 
        },
      },
      {
        path: '/hrm/designations/:uuid',
        name: 'hrm-designation-detail',
        component: () => import('@/views/hrm/DesignationDetailView.vue'),
        meta: { 
          requiresAuth: true, 
          breadcrumbs: [
            { label: 'Home', to: '/dashboard' }, 
            { label: 'HRM', to: '/hrm' }, 
            { label: 'Designations', to: '/hrm/designations' },
            { label: 'Detail' }
          ] 
        },
      },
      {
        path: '/hrm/leave-types',
        name: 'hrm-leave-types',
        component: () => import('@/pages/LeaveManagementPage.vue'),
        meta: { 
          requiresAuth: true, 
          breadcrumbs: [
            { label: 'Home', to: '/dashboard' }, 
            { label: 'HRM', to: '/hrm' }, 
            { label: 'Leave Types' }
          ] 
        },
      },
      {
        path: '/hrm/leave-requests',
        name: 'hrm-leave-requests',
        component: () => import('@/pages/LeaveManagementPage.vue'),
        meta: { 
          requiresAuth: true, 
          breadcrumbs: [
            { label: 'Home', to: '/dashboard' }, 
            { label: 'HRM', to: '/hrm' }, 
            { label: 'Leave Requests' }
          ] 
        },
      },
      {
        path: '/hrm/reports',
        name: 'hrm-reports',
        component: () => import('@/pages/HrmReportsPage.vue'),
        meta: { 
          requiresAuth: true, 
          breadcrumbs: [
            { label: 'Home', to: '/dashboard' }, 
            { label: 'HRM', to: '/hrm' }, 
            { label: 'Reports' }
          ] 
        },
      },
      {
        path: '/hrm/employees',
        name: 'hrm-employees',
        component: EmployeesPage,
        meta: { 
          requiresAuth: true, 
          breadcrumbs: [
            { label: 'Home', to: '/dashboard' }, 
            { label: 'HRM', to: '/hrm' }, 
            { label: 'Employees' }
          ] 
        },
      },
      {
        path: '/hrm/employees/:uuid',
        name: 'hrm-employee-detail',
        component: EmployeeDetailView,
        meta: { 
          requiresAuth: true, 
          breadcrumbs: [
            { label: 'Home', to: '/dashboard' }, 
            { label: 'HRM', to: '/hrm' }, 
            { label: 'Employees', to: '/hrm/employees' },
            { label: 'Detail' }
          ] 
        },
      },
      {
        path: '/hrm/office-locations',
        name: 'hrm-office-locations',
        component: OfficeLocationsPage,
        meta: { 
          requiresAuth: true, 
          breadcrumbs: [
            { label: 'Home', to: '/dashboard' }, 
            { label: 'HRM', to: '/hrm' }, 
            { label: 'Office Locations' }
          ] 
        },
      },
      {
        path: '/hrm/attendances',
        name: 'hrm-attendances',
        component: () => import('@/pages/AttendancesPage.vue'),
        meta: { 
          requiresAuth: true, 
          breadcrumbs: [
            { label: 'Home', to: '/dashboard' }, 
            { label: 'HRM', to: '/hrm' }, 
            { label: 'Attendances' }
          ] 
        },
      },
      {
        path: '/hrm/shifts',
        name: 'hrm-shifts',
        component: () => import('@/pages/ShiftsPage.vue'),
        meta: { 
          requiresAuth: true, 
          breadcrumbs: [
            { label: 'Home', to: '/dashboard' }, 
            { label: 'HRM', to: '/hrm' }, 
            { label: 'Shifts' }
          ] 
        },
      },
      {
        path: '/hrm/reimbursements',
        name: 'hrm-reimbursements',
        component: () => import('@/pages/ReimbursementPage.vue'),
        meta: { 
          requiresAuth: true, 
          breadcrumbs: [
            { label: 'Home', to: '/dashboard' }, 
            { label: 'HRM', to: '/hrm' }, 
            { label: 'Reimbursements' }
          ] 
        },
      },
      {
        path: '/hrm/payroll-periods',
        name: 'hrm-payroll-periods',
        component: () => import('@/pages/PayrollPeriodsPage.vue'),
        meta: { 
          requiresAuth: true, 
          breadcrumbs: [
            { label: 'Home', to: '/dashboard' }, 
            { label: 'HRM', to: '/hrm' }, 
            { label: 'Payroll Periods' }
          ] 
        },
      },
      {
        path: '/hrm/payrolls',
        name: 'hrm-payrolls',
        component: () => import('@/pages/PayrollsPage.vue'),
        meta: { 
          requiresAuth: true, 
          breadcrumbs: [
            { label: 'Home', to: '/dashboard' }, 
            { label: 'HRM', to: '/hrm' }, 
            { label: 'Payrolls' }
          ] 
        },
      },
      {
        path: '/hrm/payrolls/:uuid',
        name: 'hrm-payroll-detail',
        component: () => import('@/views/hrm/PayrollDetailView.vue'),
        meta: { 
          requiresAuth: true, 
          breadcrumbs: [
            { label: 'Home', to: '/dashboard' }, 
            { label: 'HRM', to: '/hrm' }, 
            { label: 'Payrolls', to: '/hrm/payrolls' },
            { label: 'Detail' }
          ] 
        },
      },
      {
        path: '/hrm/payslips',
        name: 'hrm-payslips',
        component: () => import('@/pages/PayslipsPage.vue'),
        meta: {
          requiresAuth: true,
          breadcrumbs: [
            { label: 'Home', to: '/dashboard' },
            { label: 'HRM', to: '/hrm' },
            { label: 'Payslips' }
          ]
        },
      },
      {
        path: '/hrm/salary-components',
        name: 'hrm-salary-components',
        component: () => import('@/pages/SalaryComponentsPage.vue'),
        meta: {
          requiresAuth: true,
          breadcrumbs: [
            { label: 'Home', to: '/dashboard' },
            { label: 'HRM', to: '/hrm' },
            { label: 'Salary Components' }
          ]
        },
      },
      {
        path: '/hrm/employees/:uuid/salary-components',
        name: 'hrm-employee-salary-components',
        component: () => import('@/views/hrm/EmployeeSalaryComponentsView.vue'),
        meta: {
          requiresAuth: true,
          breadcrumbs: [
            { label: 'Home', to: '/dashboard' },
            { label: 'HRM', to: '/hrm' },
            { label: 'Employees', to: '/hrm/employees' },
            { label: 'Salary Components' }
          ]
        },
      },
      {
        path: '/hrm/resignations',
        name: 'hrm-resignations',
        component: () => import('@/views/hrm/ResignationsView.vue'),
        meta: {
          requiresAuth: true,
          breadcrumbs: [
            { label: 'Home', to: '/dashboard' },
            { label: 'HRM', to: '/hrm' },
            { label: 'Resignations' }
          ]
        },
      },
      {
        path: '/hrm/resignations/:uuid',
        name: 'hrm-resignation-detail',
        component: () => import('@/views/hrm/ResignationDetailView.vue'),
        meta: {
          requiresAuth: true,
          breadcrumbs: [
            { label: 'Home', to: '/dashboard' },
            { label: 'HRM', to: '/hrm' },
            { label: 'Resignations', to: '/hrm/resignations' },
            { label: 'Detail' }
          ]
        },
      },
      {
        path: '/finance',
        name: 'finance-dashboard',
        component: () => import('@/pages/FinanceDashboardPage.vue'),
        meta: { 
          requiresAuth: true, 
          breadcrumbs: [
            { label: 'Home', to: '/dashboard' }, 
            { label: 'Finance' }
          ] 
        },
      },
      {
        path: '/finance/ledger/accounts',
        name: 'finance-ledger-accounts',
        component: () => import('@/pages/finance/LedgerAccountsPage.vue'),
        meta: { 
          requiresAuth: true, 
          breadcrumbs: [
            { label: 'Home', to: '/dashboard' }, 
            { label: 'Finance', to: '/finance' },
            { label: 'Chart of Accounts' }
          ] 
        },
      },
      {
        path: '/finance/ledger/items',
        name: 'finance-ledger-items',
        component: () => import('@/pages/finance/LedgerItemsPage.vue'),
        meta: { 
          requiresAuth: true, 
          breadcrumbs: [
            { label: 'Home', to: '/dashboard' }, 
            { label: 'Finance', to: '/finance' },
            { label: 'General Ledger' }
          ] 
        },
      },
      {
        path: '/finance/reports',
        name: 'finance-reports',
        component: () => import('@/pages/finance/FinancialReportsPage.vue'),
        meta: { 
          requiresAuth: true, 
          breadcrumbs: [
            { label: 'Home', to: '/dashboard' }, 
            { label: 'Finance', to: '/finance' },
            { label: 'Reports' }
          ] 
        },
      },
      {
        path: '/finance/analytics',
        name: 'finance-analytics',
        component: () => import('@/pages/finance/AIAnalyticsPage.vue'),
        meta: { 
          requiresAuth: true, 
          breadcrumbs: [
            { label: 'Home', to: '/dashboard' }, 
            { label: 'Finance', to: '/finance' },
            { label: 'AI Analytics' }
          ] 
        },
      },
      {
        path: '/purchasing',
        name: 'purchasing-dashboard',
        component: () => import('@/pages/purchasing/PurchasingDashboard.vue'),
        meta: { 
          requiresAuth: true, 
          breadcrumbs: [
            { label: 'Home', to: '/dashboard' }, 
            { label: 'Purchasing' }
          ] 
        },
      },
      {
        path: '/purchasing/suppliers',
        name: 'purchasing-suppliers',
        component: () => import('@/pages/purchasing/SuppliersPage.vue'),
        meta: { 
          requiresAuth: true, 
          breadcrumbs: [
            { label: 'Home', to: '/dashboard' }, 
            { label: 'Purchasing', to: '/purchasing' },
            { label: 'Suppliers' }
          ] 
        },
      },
      {
        path: '/purchasing/requests',
        name: 'purchasing-requests',
        component: () => import('@/pages/purchasing/PurchaseRequestsPage.vue'),
        meta: { 
          requiresAuth: true, 
          breadcrumbs: [
            { label: 'Home', to: '/dashboard' }, 
            { label: 'Purchasing', to: '/purchasing' },
            { label: 'Requests' }
          ] 
        },
      },
      {
        path: '/purchasing/orders',
        name: 'purchasing-orders',
        component: () => import('@/pages/purchasing/PurchaseOrdersPage.vue'),
        meta: { 
          requiresAuth: true, 
          breadcrumbs: [
            { label: 'Home', to: '/dashboard' }, 
            { label: 'Purchasing', to: '/purchasing' },
            { label: 'Orders' }
          ] 
        },
      },
      {
        path: '/purchasing/receipts',
        name: 'purchasing-receipts',
        component: () => import('@/pages/purchasing/GoodsReceiptsPage.vue'),
        meta: { 
          requiresAuth: true, 
          breadcrumbs: [
            { label: 'Home', to: '/dashboard' }, 
            { label: 'Purchasing', to: '/purchasing' },
            { label: 'Receipts' }
          ] 
        },
      },
      {
        path: '/purchasing/invoices',
        name: 'purchasing-invoices',
        component: () => import('@/pages/purchasing/PurchaseInvoicesPage.vue'),
        meta: { 
          requiresAuth: true, 
          breadcrumbs: [
            { label: 'Home', to: '/dashboard' }, 
            { label: 'Purchasing', to: '/purchasing' },
            { label: 'Invoices' }
          ] 
        },
      },
      {
        path: '/project',
        name: 'project-dashboard',
        component: () => import('@/pages/project/ProjectDashboard.vue'),
        meta: { 
          requiresAuth: true, 
          breadcrumbs: [
            { label: 'Home', to: '/dashboard' }, 
            { label: 'Project' }
          ] 
        },
      },
      {
        path: '/project/list',
        name: 'project-list',
        component: () => import('@/pages/project/ProjectListPage.vue'),
        meta: { 
          requiresAuth: true, 
          breadcrumbs: [
            { label: 'Home', to: '/dashboard' }, 
            { label: 'Project', to: '/project' },
            { label: 'List' }
          ] 
        },
      },
      {
        path: '/project/kanban',
        name: 'project-kanban',
        component: () => import('@/pages/project/TaskKanbanPage.vue'),
        meta: { 
          requiresAuth: true, 
          breadcrumbs: [
            { label: 'Home', to: '/dashboard' }, 
            { label: 'Project', to: '/project' },
            { label: 'Kanban' }
          ] 
        },
      },
      {
        path: '/project/tasks',
        name: 'project-tasks',
        component: () => import('@/pages/project/TasksPage.vue'),
        meta: { 
          requiresAuth: true, 
          breadcrumbs: [
            { label: 'Home', to: '/dashboard' }, 
            { label: 'Project', to: '/project' },
            { label: 'Tasks' }
          ] 
        },
      },
      {
        path: '/project/resources',
        name: 'project-resources',
        component: () => import('@/pages/project/ResourcesPage.vue'),
        meta: { 
          requiresAuth: true, 
          breadcrumbs: [
            { label: 'Home', to: '/dashboard' }, 
            { label: 'Project', to: '/project' },
            { label: 'Resources' }
          ] 
        },
      },
      {
        path: '/project/budget',
        name: 'project-budget',
        component: () => import('@/pages/project/BudgetCostPage.vue'),
        meta: { 
          requiresAuth: true, 
          breadcrumbs: [
            { label: 'Home', to: '/dashboard' }, 
            { label: 'Project', to: '/project' },
            { label: 'Budget & Cost' }
          ] 
        },
      },
      {
        path: '/project/timesheets',
        name: 'project-timesheets',
        component: () => import('@/pages/project/TimesheetPage.vue'),
        meta: { 
          requiresAuth: true, 
          breadcrumbs: [
            { label: 'Home', to: '/dashboard' }, 
            { label: 'Project', to: '/project' },
            { label: 'Timesheets' }
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
  // If user is authenticated and trying to access login page, redirect to menu
  else if (to.path === '/login' && isAuthenticated) {
    next('/')
  }
  // Otherwise, allow navigation
  else {
    next()
  }
})

export default router
