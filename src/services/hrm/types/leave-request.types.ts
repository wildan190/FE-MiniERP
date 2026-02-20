import type { LeaveType } from './leave-type.types'
import type { Employee } from './employee.types'

export interface LeaveRequest {
  id: number
  uuid: string
  employee_id: number
  leave_type_id: number
  start_date: string
  end_date: string
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  approved_by: number | null
  rejection_reason: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  employee?: Employee
  leave_type?: LeaveType
  approver?: { id: number; name: string; email: string; uuid: string } | null
}

export interface LeaveRequestPagination {
  current_page: number
  data: LeaveRequest[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: Array<{ url: string | null; label: string; page: number | null; active: boolean }>
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number
  total: number
}

export interface LeaveRequestListResponse {
  message: string
  data: LeaveRequestPagination
}

export interface CreateLeaveRequestRequest {
  leave_type_uuid: string
  start_date: string
  end_date: string
  reason: string
}

export interface CreateLeaveRequestResponse {
  message: string
  data: LeaveRequest
}

export interface UpdateLeaveRequestStatusRequest {
  status: 'approved' | 'rejected'
  rejection_reason?: string | null
}

export interface UpdateLeaveRequestStatusResponse {
  message: string
  data: LeaveRequest
}

// Leave Balance
export interface LeaveBalance {
  id: number
  employee_id: number
  leave_type_id: number
  year: number
  total_days: number
  used_days: number
  remaining_days: number
  created_at: string
  updated_at: string
  leave_type?: LeaveType
}

export interface LeaveBalanceResponse {
  message: string
  data: LeaveBalance[]
}
