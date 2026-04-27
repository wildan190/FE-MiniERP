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
  Banknote
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
      ]
    }
  },
  default: {
    items: [
      { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
      { label: 'CRM', to: '/crm', icon: Users },
      { label: 'HRM', to: '/hrm/departments', icon: Zap },
    ]
  }
};

export const getModuleByPath = (path: string): string => {
  if (path.startsWith('/hrm')) return 'hrm';
  if (path.startsWith('/crm') || 
      path.startsWith('/customers') || 
      path.startsWith('/leads') || 
      path.startsWith('/prospects')) return 'crm';
  return 'default';
};
