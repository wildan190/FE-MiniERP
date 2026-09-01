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
  Package,
  Warehouse,
  ArrowRightLeft,
  RefreshCw,
  ShieldCheck,
  ShieldAlert,
  Calendar,
} from 'lucide-vue-next';

export interface NavItem {
  label: string;
  to: string;
  icon: any;
  group?: string;
  requiresHr?: boolean;
}

export const NAVIGATION_CONFIG: Record<string, { items: NavItem[], groups?: Record<string, NavItem[]> }> = {
  dashboard: {
    items: [
      { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    ]
  },
  calendar: {
    items: [
      { label: 'Calendar & Agenda', to: '/calendar', icon: Calendar },
    ]
  },
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
  attendance: {
    items: [
      { label: 'My Attendance', to: '/hrm/attendances', icon: Clock },
    ]
  },
  leaves: {
    items: [
      { label: 'My Leave Requests', to: '/hrm/leave-requests', icon: ClipboardList },
      { label: 'Leave Types Policy', to: '/hrm/leave-types', icon: CalendarRange, requiresHr: true },
    ]
  },
  reimbursement: {
    items: [
      { label: 'My Claims', to: '/hrm/reimbursements', icon: Banknote },
    ]
  },
  payslips: {
    items: [
      { label: 'My Payslips', to: '/hrm/payslips', icon: Banknote },
    ]
  },
  hrm: {
    items: [
      { label: 'Reports', to: '/hrm/reports', icon: BarChart3 },
    ],
    groups: {
      'hr-administration': [
        { label: 'Talent Acquisition', to: '/hrm/recruitment', icon: Users },
        { label: 'Employees', to: '/hrm/employees', icon: Users },
        { label: 'Departments', to: '/hrm/departments', icon: Zap },
        { label: 'Designations', to: '/hrm/designations', icon: Briefcase },
        { label: 'Office Locations', to: '/hrm/office-locations', icon: MapPin },
        { label: 'Shifts', to: '/hrm/shifts', icon: CalendarRange },
        { label: 'Resignations', to: '/hrm/resignations', icon: FileX },
      ],
      'payroll-management': [
        { label: 'Payroll Periods', to: '/hrm/payroll-periods', icon: Banknote },
        { label: 'Payrolls', to: '/hrm/payrolls', icon: Banknote },
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
      payables: [
        { label: 'Account Payable', to: '/finance/ap', icon: Banknote },
      ],
      analytics: [
        { label: 'AI Analytics', to: '/finance/analytics', icon: Zap },
      ],
      configuration: [
        { label: 'Settings', to: '/finance/settings', icon: TrendingUp },
      ],
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
  inventory: {
    items: [
      { label: 'Inventory Dashboard', to: '/inventory', icon: LayoutDashboard },
    ],
    groups: {
      catalog: [
        { label: 'Products', to: '/inventory/products', icon: Package },
        { label: 'Warehouses', to: '/inventory/warehouses', icon: Warehouse },
      ],
      operations: [
        { label: 'Stock Movements', to: '/inventory/movements', icon: RefreshCw },
        { label: 'Transfer Orders', to: '/inventory/transfers', icon: ArrowRightLeft },
      ],
    }
  },
  system: {
    items: [
      { label: 'Role & Permissions', to: '/system/roles', icon: ShieldCheck },
      { label: 'Approval Center', to: '/system/approvals', icon: ShieldAlert },
    ]
  },
  default: {
    items: [
      { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    ]
  }
};

export const getModuleByPath = (path: string): string => {
  if (path.startsWith('/dashboard')) return 'dashboard';
  if (path.startsWith('/calendar')) return 'calendar';
  if (path.startsWith('/hrm')) return 'hrm';
  if (path.startsWith('/finance')) return 'finance';
  if (path.startsWith('/purchasing')) return 'purchasing';
  if (path.startsWith('/project')) return 'project';
  if (path.startsWith('/inventory')) return 'inventory';
  if (path.startsWith('/system')) return 'system';
  if (path.startsWith('/crm') || 
      path.startsWith('/customers') || 
      path.startsWith('/leads') || 
      path.startsWith('/prospects')) return 'crm';
  return 'default';
};
