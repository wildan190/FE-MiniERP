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
  Coins,
  FileX,
  TrendingUp,
  Package,
  Warehouse,
  ArrowRightLeft,
  RefreshCw,
  ShieldCheck,
  ShieldAlert,
  Calendar,
  UserCircle,
} from 'lucide-vue-next';

export interface NavItem {
  label: string;
  to: string;
  icon: any;
  group?: string;
  requiresHr?: boolean;
  permission?: string | string[];
}

export const NAVIGATION_CONFIG: Record<string, { items: NavItem[], groups?: Record<string, NavItem[]> }> = {
  dashboard: {
    items: [
      { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    ]
  },
  profile: {
    items: [
      { label: 'My Profile', to: '/hrm/my-profile', icon: UserCircle },
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
      { label: 'Customers', to: '/customers', icon: Users, permission: ['crm.customers.view', 'crm.customers.manage'] },
      { label: 'Leads', to: '/leads', icon: Users, permission: 'crm.leads.manage' },
      { label: 'Prospects', to: '/prospects', icon: Users, permission: 'crm.leads.manage' },
      { label: 'Quotations', to: '/crm/quotations', icon: Box, permission: 'crm.quotations.manage' },
      { label: 'Pipelines', to: '/crm/pipelines', icon: LayoutGrid, permission: 'crm.leads.manage' },
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
      { label: 'Leave Types Policy', to: '/hrm/leave-types', icon: CalendarRange, requiresHr: true, permission: 'hrm.leave.approve' },
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
  resignations: {
    items: [
      { label: 'My Resignation Requests', to: '/hrm/resignations', icon: FileX },
    ]
  },
  hrm: {
    items: [
      { label: 'Reports', to: '/hrm/reports', icon: BarChart3, permission: ['hrm.employees.view', 'hrm.employees.manage'] },
    ],
    groups: {
      'hr-administration': [
        { label: 'Talent Acquisition', to: '/hrm/recruitment', icon: Users, permission: 'hrm.recruitment.manage' },
        { label: 'Employees', to: '/hrm/employees', icon: Users, permission: ['hrm.employees.view', 'hrm.employees.manage'] },
        { label: 'Departments', to: '/hrm/departments', icon: Zap, permission: 'hrm.departments.manage' },
        { label: 'Designations', to: '/hrm/designations', icon: Briefcase, permission: 'hrm.designations.manage' },
        { label: 'Office Locations', to: '/hrm/office-locations', icon: MapPin, permission: 'hrm.locations.manage' },
        { label: 'Shifts', to: '/hrm/shifts', icon: CalendarRange, permission: 'hrm.shifts.manage' },
        { label: 'Resignations', to: '/hrm/resignations', icon: FileX, permission: 'hrm.resignation.approve' },
      ],
      'payroll-management': [
        { label: 'Payroll Periods', to: '/hrm/payroll-periods', icon: Banknote, permission: 'hrm.payroll.manage' },
        { label: 'Payrolls', to: '/hrm/payrolls', icon: Banknote, permission: 'hrm.payroll.manage' },
        { label: 'Salary Components', to: '/hrm/salary-components', icon: Banknote, permission: 'hrm.payroll.manage' },
      ]
    }
  },
  finance: {
    items: [
      { label: 'Finance Dashboard', to: '/finance', icon: LayoutDashboard },
      { label: 'Reports', to: '/finance/reports', icon: BarChart3, permission: 'finance.ledger.view' },
    ],
    groups: {
      ledger: [
        { label: 'Chart of Accounts', to: '/finance/ledger/accounts', icon: Box, permission: ['finance.accounts.manage', 'finance.ledger.view'] },
        { label: 'General Ledger', to: '/finance/ledger/items', icon: ClipboardList, permission: 'finance.ledger.view' },
      ],
      receivables: [
        { label: 'Account Receivable', to: '/finance/ar', icon: Coins, permission: ['finance.ledger.view', 'finance.accounts.manage'] },
      ],
      payables: [
        { label: 'Account Payable', to: '/finance/ap', icon: Banknote, permission: ['finance.ledger.view', 'finance.accounts.manage'] },
      ],
      analytics: [
        { label: 'AI Analytics', to: '/finance/analytics', icon: Zap, permission: 'finance.ledger.view' },
      ],
      configuration: [
        { label: 'Settings', to: '/finance/settings', icon: TrendingUp, permission: 'finance.accounts.manage' },
      ],
    }
  },
  purchasing: {
    items: [
      { label: 'Purchasing Dashboard', to: '/purchasing', icon: LayoutDashboard },
      { label: 'Suppliers', to: '/purchasing/suppliers', icon: Users, permission: 'purchasing.suppliers.manage' },
    ],
    groups: {
      procurement: [
        { label: 'Purchase Requests', to: '/purchasing/requests', icon: ClipboardList, permission: ['purchasing.pr.create', 'purchasing.pr.approve'] },
        { label: 'Purchase Orders', to: '/purchasing/orders', icon: Box, permission: 'purchasing.po.manage' },
      ],
      financial: [
        { label: 'Goods Receipts', to: '/purchasing/receipts', icon: Box, permission: 'purchasing.po.manage' },
        { label: 'Supplier Invoices', to: '/purchasing/invoices', icon: Banknote, permission: 'purchasing.po.manage' },
      ]
    }
  },
  project: {
    items: [
      { label: 'Project Dashboard', to: '/project', icon: LayoutDashboard },
      { label: 'Projects', to: '/project/list', icon: Box, permission: ['project.projects.view', 'project.projects.manage'] },
    ],
    groups: {
      execution: [
        { label: 'Tasks', to: '/project/tasks', icon: ClipboardList, permission: ['project.tasks.manage', 'project.projects.view'] },
        { label: 'Kanban Board', to: '/project/kanban', icon: LayoutGrid, permission: ['project.tasks.manage', 'project.projects.view'] },
        { label: 'Timesheets', to: '/project/timesheets', icon: Clock, permission: 'project.timesheets.approve' },
      ],
      management: [
        { label: 'Resources', to: '/project/resources', icon: Users, permission: 'project.projects.manage' },
        { label: 'Budget & Cost', to: '/project/budget', icon: Banknote, permission: 'project.projects.manage' },
      ]
    }
  },
  inventory: {
    items: [
      { label: 'Inventory Dashboard', to: '/inventory', icon: LayoutDashboard },
    ],
    groups: {
      catalog: [
        { label: 'Products', to: '/inventory/products', icon: Package, permission: 'inventory.products.view' },
        { label: 'Warehouses', to: '/inventory/warehouses', icon: Warehouse, permission: 'inventory.stock.manage' },
      ],
      operations: [
        { label: 'Stock Movements', to: '/inventory/movements', icon: RefreshCw, permission: 'inventory.stock.manage' },
        { label: 'Transfer Orders', to: '/inventory/transfers', icon: ArrowRightLeft, permission: 'inventory.transfers.approve' },
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
