import type { Employee } from './employee.types'
import type { PayrollPeriod } from './payroll-period.types'

export interface PayrollItem {
  id: number
  payroll_id: number
  salary_component_id: number | null
  name: string
  amount: string
  type: 'earning' | 'deduction'
  created_at: string
  updated_at: string
}

export interface Payroll {
  id: number
  employee_id: number
  payroll_period_id: number
  basic_salary: string
  total_earnings: string
  total_deductions: string
  net_salary: string
  status: string
  payment_date: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  uuid: string
  employee?: Employee
  payroll_period?: PayrollPeriod
  items?: PayrollItem[]
}

export interface PayrollPaginationData {
  current_page: number
  data: Payroll[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: Array<{
    url: string | null
    label: string
    page: number | null
    active: boolean
  }>
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number
  total: number
}

export interface PayrollListResponse {
  message: string
  data: PayrollPaginationData
}

export interface PayrollDetailResponse {
  message: string
  data: Payroll
}

export interface PayPayrollResponse {
  message: string
  data: Payroll
}
