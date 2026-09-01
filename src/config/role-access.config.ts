/**
 * Role-Access Configuration — UI Metadata Only
 * ─────────────────────────────────────────────
 * File ini HANYA mendefinisikan metadata tampilan setiap modul
 * (nama, path, icon, warna). Tidak ada hardcode role slug di sini.
 *
 * Logika akses sepenuhnya dikontrol oleh:
 *   authStore.accessibleModules  ←  dihitung dari permission.module di DB
 *
 * Super admin mengatur akses via UI Role Management (/system/roles):
 *   assign permission "hrm.employees.view" ke role X
 *   → user dengan role X otomatis melihat modul HRM
 */

/** Derive the module key from the current route path */
export function getModuleByPath(path: string): string {
  if (path.startsWith('/dashboard')) return 'dashboard'
  if (path.startsWith('/calendar')) return 'calendar'
  
  // Standalone ESS Modules
  if (path.startsWith('/hrm/attendances')) return 'attendance'
  if (path.startsWith('/hrm/leave-requests') || path.startsWith('/hrm/leave-types')) return 'leaves'
  if (path.startsWith('/hrm/reimbursements')) return 'reimbursement'
  if (path.startsWith('/hrm/payslips')) return 'payslips'
  
  // HRM Administration
  if (path.startsWith('/hrm')) return 'hrm'
  
  // Other Domains
  if (path.startsWith('/finance')) return 'finance'
  if (path.startsWith('/purchasing')) return 'purchasing'
  if (path.startsWith('/project')) return 'project'
  if (path.startsWith('/inventory')) return 'inventory'
  if (path.startsWith('/system')) return 'system'
  if (
    path.startsWith('/crm') ||
    path.startsWith('/customers') ||
    path.startsWith('/leads') ||
    path.startsWith('/prospects') ||
    path.startsWith('/quotations')
  )
    return 'crm'
  return 'default'
}

/**
 * Metadata tampilan untuk setiap modul.
 * Urutan array ini menentukan urutan tampil di AppMenuView.
 */
export interface ModuleMeta {
  /** Key modul — harus cocok dengan permission.module di DB atau ESS module key */
  key: string
  name: string
  path: string
  /** Tailwind gradient class untuk icon background */
  color: string
  /** Key icon dari lucide-vue-next */
  iconKey: string
}

export const MODULE_LIST: ModuleMeta[] = [
  {
    key: 'dashboard',
    name: 'Dashboard',
    path: '/dashboard',
    color: 'bg-gradient-to-br from-blue-500 to-indigo-700',
    iconKey: 'LayoutDashboard',
  },
  {
    key: 'calendar',
    name: 'Calendar & Agenda',
    path: '/calendar',
    color: 'bg-gradient-to-br from-indigo-500 to-purple-700',
    iconKey: 'Calendar',
  },
  // ── ESS (Employee Self-Service) Apps ──────────────────────────────────────
  {
    key: 'attendance',
    name: 'Attendance',
    path: '/hrm/attendances',
    color: 'bg-gradient-to-br from-cyan-500 to-blue-600',
    iconKey: 'Clock',
  },
  {
    key: 'leaves',
    name: 'Leave Requests',
    path: '/hrm/leave-requests',
    color: 'bg-gradient-to-br from-amber-500 to-emerald-600',
    iconKey: 'ClipboardList',
  },
  {
    key: 'reimbursement',
    name: 'Reimbursement',
    path: '/hrm/reimbursements',
    color: 'bg-gradient-to-br from-emerald-500 to-teal-700',
    iconKey: 'Banknote',
  },
  {
    key: 'payslips',
    name: 'My Payslips',
    path: '/hrm/payslips',
    color: 'bg-gradient-to-br from-violet-500 to-purple-700',
    iconKey: 'FileText',
  },
  // ── Core Enterprise Modules ────────────────────────────────────────────────
  {
    key: 'crm',
    name: 'CRM',
    path: '/crm',
    color: 'bg-gradient-to-br from-emerald-500 to-teal-700',
    iconKey: 'Users',
  },
  {
    key: 'hrm',
    name: 'HR Management',
    path: '/hrm/employees',
    color: 'bg-gradient-to-br from-purple-500 to-indigo-700',
    iconKey: 'Zap',
  },
  {
    key: 'finance',
    name: 'Finance',
    path: '/finance',
    color: 'bg-gradient-to-br from-blue-600 to-blue-800',
    iconKey: 'Banknote',
  },
  {
    key: 'purchasing',
    name: 'Purchasing',
    path: '/purchasing',
    color: 'bg-gradient-to-br from-amber-500 to-orange-700',
    iconKey: 'ShoppingCart',
  },
  {
    key: 'project',
    name: 'Project',
    path: '/project',
    color: 'bg-gradient-to-br from-rose-500 to-pink-700',
    iconKey: 'LayoutGrid',
  },
  {
    key: 'inventory',
    name: 'Inventory',
    path: '/inventory',
    color: 'bg-gradient-to-br from-teal-500 to-cyan-700',
    iconKey: 'Package',
  },
  {
    key: 'system',
    name: 'Approvals',
    path: '/system/approvals',
    color: 'bg-gradient-to-br from-violet-600 to-purple-800',
    iconKey: 'ShieldAlert',
  },
  {
    key: 'system',
    name: 'Roles & RBAC',
    path: '/system/roles',
    color: 'bg-gradient-to-br from-indigo-600 to-slate-800',
    iconKey: 'ShieldCheck',
  },
]
