import { 
  Users, 
  Box, 
  LayoutGrid,
  Zap,
  LayoutDashboard,
  Briefcase,
  ClipboardList,
  BarChart3,
  MapPin,
  Clock,
  CalendarRange,
  Banknote,
  FileX,
  TrendingUp,
} from 'lucide-vue-next';

export interface NavItem {
  label: string;
  to: string;
  icon: any;
  group?: string;
}

export const NAVIGATION_CONFIG: Record<string, { items: NavItem[], groups?: Record<string, NavItem[]> }> = {
  crm: {
    items: [
      { label: 'CRM Dashboard', to: '/crm', icon: LayoutDashboard },
      { label: 'Customers', to: '/customers', icon: Users },
      { label: 'Leads', to: '/leads', icon: Users },
      { label: 'Prospects', to: '/prospects', icon: Users },
      { label: 'Quotations', to: '/crm/quotations', icon: Box },
      { label: 'Pipelines', to: '/crm/pipelines', icon: LayoutGrid },
    ]
  },
  hrm: {
    items: [
      { label: 'Reports', to: '/hrm/reports', icon: BarChart3 },
    ],
    groups: {
      employment: [
        { label: 'Employees', to: '/hrm/employees', icon: Users },
        { label: 'Departments', to: '/hrm/departments', icon: Zap },
        { label: 'Designations', to: '/hrm/designations', icon: Briefcase },
        { label: 'Resignations', to: '/hrm/resignations', icon: FileX },
        { label: 'Office Locations', to: '/hrm/office-locations', icon: MapPin },
      ],
      tracking: [
        { label: 'Attendance', to: '/hrm/attendances', icon: Clock },
        { label: 'Shifts', to: '/hrm/shifts', icon: CalendarRange },
        { label: 'Leave Management', to: '/hrm/leave-requests', icon: ClipboardList },
      ],
      claims: [
        { label: 'Reimbursements', to: '/hrm/reimbursements', icon: Banknote },
      ],
      payroll: [
        { label: 'Payroll Periods', to: '/hrm/payroll-periods', icon: Banknote },
        { label: 'Payrolls', to: '/hrm/payrolls', icon: Banknote },
        { label: 'Payslips', to: '/hrm/payslips', icon: Banknote },
        { label: 'Salary Components', to: '/hrm/salary-components', icon: Banknote },
      ]
    }
  },
  finance: {
    items: [
      { label: 'Finance Dashboard', to: '/finance', icon: LayoutDashboard },
      { label: 'Reports', to: '/finance/reports', icon: BarChart3 },
    ],
    groups: {
      ledger: [
        { label: 'Chart of Accounts', to: '/finance/ledger/accounts', icon: Box },
        { label: 'General Ledger', to: '/finance/ledger/items', icon: ClipboardList },
      ],
      analytics: [
        { label: 'AI Analytics', to: '/finance/analytics', icon: Zap },
      ]
    }
  },
  purchasing: {
    items: [
      { label: 'Purchasing Dashboard', to: '/purchasing', icon: LayoutDashboard },
      { label: 'Suppliers', to: '/purchasing/suppliers', icon: Users },
    ],
    groups: {
      procurement: [
        { label: 'Purchase Requests', to: '/purchasing/requests', icon: ClipboardList },
        { label: 'Purchase Orders', to: '/purchasing/orders', icon: Box },
      ],
      financial: [
        { label: 'Goods Receipts', to: '/purchasing/receipts', icon: Box },
        { label: 'Supplier Invoices', to: '/purchasing/invoices', icon: Banknote },
      ]
    }
  },
  project: {
    items: [
      { label: 'Project Dashboard', to: '/project', icon: LayoutDashboard },
      { label: 'Projects', to: '/project/list', icon: Box },
    ],
    groups: {
      execution: [
        { label: 'Tasks', to: '/project/tasks', icon: ClipboardList },
        { label: 'Kanban Board', to: '/project/kanban', icon: LayoutGrid },
        { label: 'Timesheets', to: '/project/timesheets', icon: Clock },
      ],
      management: [
        { label: 'Resources', to: '/project/resources', icon: Users },
        { label: 'Budget & Cost', to: '/project/budget', icon: Banknote },
      ]
    }
  },
  default: {
    items: [
      { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
      { label: 'CRM', to: '/crm', icon: Users },
      { label: 'HRM', to: '/hrm/departments', icon: Zap },
      { label: 'Finance', to: '/finance', icon: Banknote },
      { label: 'Purchasing', to: '/purchasing', icon: Box },
      { label: 'Project', to: '/project', icon: LayoutGrid },
    ]
  }
};

export const getModuleByPath = (path: string): string => {
  if (path.startsWith('/hrm')) return 'hrm';
  if (path.startsWith('/finance')) return 'finance';
  if (path.startsWith('/purchasing')) return 'purchasing';
  if (path.startsWith('/project')) return 'project';
  if (path.startsWith('/crm') || 
      path.startsWith('/customers') || 
      path.startsWith('/leads') || 
      path.startsWith('/prospects')) return 'crm';
  return 'default';
};
