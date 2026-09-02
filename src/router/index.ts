import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getModuleByPath as getModuleKey } from '@/config/role-access.config'
// Only the truly always-needed pages are imported statically:
import LoginPage from '@/pages/LoginPage.vue'
import AppMenuView from '@/pages/AppMenuView.vue'
// All other pages are lazy-loaded — no data is fetched until the user visits that route

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
      component: () => import('@/pages/DashboardPage.vue'),
      meta: { requiresAuth: true, module: 'dashboard', breadcrumbs: [{ label: 'Home', to: '/dashboard' }, { label: 'Dashboard' }] },
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: () => import('@/pages/CalendarPage.vue'),
      meta: { requiresAuth: true, module: 'calendar', breadcrumbs: [{ label: 'Home', to: '/dashboard' }, { label: 'Calendar' }] },
    },
    {
      path: '/unauthorized',
      name: 'unauthorized',
      component: () => import('@/pages/UnauthorizedPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/crm',
      name: 'crm',
      component: () => import('@/pages/CRMDashboardPage.vue'),
      meta: { requiresAuth: true, module: 'crm', breadcrumbs: [{ label: 'Home', to: '/dashboard' }, { label: 'CRM' }] },
    },
    {
      path: '/customers',
      name: 'customers',
      component: () => import('@/pages/CustomersPage.vue'),
      meta: { requiresAuth: true, module: 'crm', permission: ['crm.customers.view', 'crm.customers.manage'], breadcrumbs: [{ label: 'Home', to: '/dashboard' }, { label: 'Customers' }] },
    },
    {
      path: '/quotations',
      name: 'Quotations',
      component: () => import('@/pages/QuotationsPage.vue'),
      meta: { requiresAuth: true, module: 'crm', permission: 'crm.quotations.manage', breadcrumbs: [{ name: 'Home', path: '/dashboard' }, { name: 'Quotations', path: '/quotations' }] }
    },
    {
      path: '/quotations/:uuid',
      name: 'QuotationDetail',
      component: () => import('@/views/crm/QuotationDetailView.vue'),
      meta: { requiresAuth: true, breadcrumbs: [{ name: 'Home', path: '/dashboard' }, { name: 'Quotations', path: '/quotations' }, { name: 'Detail', path: '' }] }
    },
    {
      path: '/leads',
      name: 'leads',
      component: () => import('@/pages/LeadsPage.vue'),
      meta: { requiresAuth: true, module: 'crm', permission: 'crm.leads.manage', breadcrumbs: [{ label: 'Home', to: '/dashboard' }, { label: 'Leads' }] },
    },
    {
      path: '/prospects',
      name: 'prospects',
      component: () => import('@/pages/ProspectsPage.vue'),
      meta: { requiresAuth: true, module: 'crm', permission: 'crm.leads.manage', breadcrumbs: [{ label: 'Home', to: '/dashboard' }, { label: 'Prospects' }] },
    },

      {
        path: '/crm/customers/:uuid',
        name: 'crm-customer-detail',
        component: () => import('@/views/crm/CustomerDetailView.vue'),
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
        component: () => import('@/pages/QuotationsPage.vue'),
        meta: { requiresAuth: true, breadcrumbs: [{ label: 'Home', to: '/dashboard' }, { label: 'CRM', to: '/crm' }, { label: 'Quotations' }] },
      },
      {
        path: '/crm/orders',
        name: 'crm-orders',
        component: () => import('@/views/crm/OrderListView.vue'),
        meta: { requiresAuth: true, breadcrumbs: [{ label: 'Home', to: '/dashboard' }, { label: 'CRM', to: '/crm' }, { label: 'Orders' }] },
      },
      {
        path: '/crm/leads/:uuid',
        name: 'crm-lead-detail',
        component: () => import('@/views/crm/LeadDetailView.vue'),
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
        component: () => import('@/views/crm/ProspectDetailView.vue'),
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
        component: () => import('@/pages/SalesPipelinePage.vue'),
        meta: { requiresAuth: true, breadcrumbs: [{ label: 'Home', to: '/dashboard' }, { label: 'CRM', to: '/crm' }, { label: 'Pipelines' }] },
      },
      {
        path: '/crm/pipelines/:uuid',
        name: 'crm-pipeline-detail',
        component: () => import('@/views/crm/SalesPipelineDetailView.vue'),
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
        path: '/hrm',
        name: 'hrm-dashboard',
        redirect: '/hrm/employees',
      },
      {
        path: '/hrm/departments',
        name: 'hrm-departments',
        component: () => import('@/pages/DepartmentsPage.vue'),
        meta: { 
          requiresAuth: true,
          permission: 'hrm.departments.manage',
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
        component: () => import('@/views/hrm/DepartmentDetailView.vue'),
        meta: { 
          requiresAuth: true,
          permission: 'hrm.departments.manage',
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
          permission: 'hrm.designations.manage',
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
          permission: 'hrm.designations.manage',
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
        path: '/hrm/recruitment',
        name: 'hrm-recruitment',
        component: () => import('@/pages/RecruitmentPage.vue'),
        meta: { 
          requiresAuth: true,
          permission: 'hrm.recruitment.manage',
          breadcrumbs: [
            { label: 'Home', to: '/dashboard' }, 
            { label: 'HRM', to: '/hrm' }, 
            { label: 'Talent Acquisition' }
          ] 
        },
      },
      {
        path: '/hrm/employees',
        name: 'hrm-employees',
        component: () => import('@/pages/EmployeesPage.vue'),
        meta: { 
          requiresAuth: true,
          permission: ['hrm.employees.view', 'hrm.employees.manage'],
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
        component: () => import('@/views/hrm/EmployeeDetailView.vue'),
        meta: { 
          requiresAuth: true,
          permission: ['hrm.employees.view', 'hrm.employees.manage'],
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
        component: () => import('@/pages/OfficeLocationsPage.vue'),
        meta: { 
          requiresAuth: true,
          permission: 'hrm.locations.manage',
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
          permission: 'hrm.shifts.manage',
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
          permission: 'hrm.payroll.manage',
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
          permission: 'hrm.payroll.manage',
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
          permission: 'hrm.payroll.manage',
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
          permission: 'hrm.payroll.manage',
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
          // No meta.permission here — all authenticated users can access their own resignations.
          // The canApproveResignation computed in the view controls approve/reject buttons.
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
        path: '/hrm/my-profile',
        name: 'hrm-my-profile',
        component: () => import('@/pages/MyProfilePage.vue'),
        meta: {
          requiresAuth: true,
          // Accessible to any logged in employee
          breadcrumbs: [
            { label: 'Home', to: '/dashboard' },
            { label: 'My Profile' }
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
          permission: 'finance.accounts.manage',
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
          permission: 'finance.ledger.view',
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
        path: '/finance/ap',
        name: 'finance-ap',
        component: () => import('@/pages/finance/AccountPayablePage.vue'),
        meta: {
          requiresAuth: true,
          breadcrumbs: [
            { label: 'Home', to: '/dashboard' },
            { label: 'Finance', to: '/finance' },
            { label: 'Account Payable' }
          ]
        },
      },
      {
        path: '/finance/ap/:uuid',
        name: 'finance-ap-bill',
        component: () => import('@/pages/finance/BillDetailPage.vue'),
        meta: {
          requiresAuth: true,
          breadcrumbs: [
            { label: 'Home', to: '/dashboard' },
            { label: 'Finance', to: '/finance' },
            { label: 'Account Payable', to: '/finance/ap' },
            { label: 'Bill Detail' }
          ]
        },
      },
      {
        path: '/finance/ar',
        name: 'finance-ar',
        component: () => import('@/pages/finance/AccountReceivablePage.vue'),
        meta: {
          requiresAuth: true,
          breadcrumbs: [
            { label: 'Home', to: '/dashboard' },
            { label: 'Finance', to: '/finance' },
            { label: 'Account Receivable' }
          ]
        },
      },
      {
        path: '/finance/ar/:uuid',
        name: 'finance-ar-invoice',
        component: () => import('@/pages/finance/InvoiceDetailPage.vue'),
        meta: {
          requiresAuth: true,
          breadcrumbs: [
            { label: 'Home', to: '/dashboard' },
            { label: 'Finance', to: '/finance' },
            { label: 'Account Receivable', to: '/finance/ar' },
            { label: 'Invoice Detail' }
          ]
        },
      },
      {
        path: '/finance/settings',
        name: 'finance-settings',
        component: () => import('@/pages/finance/FinanceSettingsPage.vue'),
        meta: {
          requiresAuth: true,
          breadcrumbs: [
            { label: 'Home', to: '/dashboard' },
            { label: 'Finance', to: '/finance' },
            { label: 'Settings' }
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
      // ── Inventory ──────────────────────────────────────────────────────────
      {
        path: '/inventory',
        name: 'inventory-dashboard',
        component: () => import('@/pages/inventory/InventoryDashboard.vue'),
        meta: {
          requiresAuth: true,
          breadcrumbs: [
            { label: 'Home', to: '/dashboard' },
            { label: 'Inventory' }
          ]
        },
      },
      {
        path: '/inventory/products',
        name: 'inventory-products',
        component: () => import('@/pages/inventory/InventoryProductListPage.vue'),
        meta: {
          requiresAuth: true,
          breadcrumbs: [
            { label: 'Home', to: '/dashboard' },
            { label: 'Inventory', to: '/inventory' },
            { label: 'Products' }
          ]
        },
      },
      {
        path: '/inventory/warehouses',
        name: 'inventory-warehouses',
        component: () => import('@/pages/inventory/WarehouseListPage.vue'),
        meta: {
          requiresAuth: true,
          breadcrumbs: [
            { label: 'Home', to: '/dashboard' },
            { label: 'Inventory', to: '/inventory' },
            { label: 'Warehouses' }
          ]
        },
      },
      {
        path: '/inventory/movements',
        name: 'inventory-movements',
        component: () => import('@/pages/inventory/StockMovementsPage.vue'),
        meta: {
          requiresAuth: true,
          breadcrumbs: [
            { label: 'Home', to: '/dashboard' },
            { label: 'Inventory', to: '/inventory' },
            { label: 'Stock Movements' }
          ]
        },
      },
      {
        path: '/inventory/transfers',
        name: 'inventory-transfers',
        component: () => import('@/pages/inventory/TransferOrdersPage.vue'),
        meta: {
          requiresAuth: true,
          breadcrumbs: [
            { label: 'Home', to: '/dashboard' },
            { label: 'Inventory', to: '/inventory' },
            { label: 'Transfer Orders' }
          ]
        },
      },
      // ── System Administration ─────────────────────────────────────────────
      {
        path: '/system/roles',
        name: 'system-roles',
        component: () => import('@/pages/system/RoleManagementPage.vue'),
        meta: {
          requiresAuth: true,
          breadcrumbs: [
            { label: 'Home', to: '/dashboard' },
            { label: 'System', to: '/system/roles' },
            { label: 'Role & Permissions' }
          ]
        },
      },
      {
        path: '/system/approvals',
        name: 'system-approvals',
        component: () => import('@/pages/system/ApprovalCenterPage.vue'),
        meta: {
          requiresAuth: true,
          breadcrumbs: [
            { label: 'Home', to: '/dashboard' },
            { label: 'System', to: '/system/approvals' },
            { label: 'Approval Center' }
          ]
        },
      },
  ],
})

// Navigation Guard (Vue Router 4 Modern Syntax)
router.beforeEach((to) => {
  const authStore = useAuthStore()
  authStore.loadUser()

  const requiresAuth = to.meta.requiresAuth !== false
  const isAuthenticated = authStore.isAuthenticated

  // If route requires auth and user is not authenticated, redirect to login
  if (requiresAuth && !isAuthenticated) {
    return '/login'
  }

  // If user is authenticated and trying to access login page, redirect to menu
  if (to.path === '/login' && isAuthenticated) {
    return '/'
  }

  // Module & Granular Permission access guard
  if (isAuthenticated && to.path !== '/unauthorized') {
    const routeModule = (to.meta.module as string | undefined) ?? getModuleKey(to.path)

    // 1. Module-level access guard
    if (routeModule !== 'default' && routeModule !== '') {
      if (!authStore.canAccessModule(routeModule)) {
        return '/unauthorized'
      }
    }

    // 2. Requires HR access guard
    if (to.meta.requiresHr && !authStore.hasHrAccess) {
      return '/unauthorized'
    }

    // 3. Granular Route-Level Permission Guard
    if (to.meta.permission) {
      const perm = to.meta.permission as string | string[]
      const hasPerm = Array.isArray(perm)
        ? perm.some((p) => authStore.hasPermission(p))
        : authStore.hasPermission(perm)

      if (!hasPerm) {
        return '/unauthorized'
      }
    }
  }
})

export default router
