import type { PaginationLink } from '@/services/hrm/types/shift.types' // Reusing common pagination types

export type ReimbursementStatus = 'pending' | 'approved' | 'rejected' | 'paid'

export interface Reimbursement {
  uuid: string
  employee_id: number
  employee?: {
    uuid: string
    user: {
      name: string
      email: string
    }
  }
  approver?: {
    name: string
    email: string
  }
  type: string
  amount: number
  description: string | null
  proof_file: string | null
  status: ReimbursementStatus
  approved_by: number | null
  approved_at: string | null
  rejection_reason: string | null
  created_at: string
  updated_at: string
}

export interface ReimbursementFilters {
  employee_uuid?: string
  status?: ReimbursementStatus
  page?: number
}

export interface CreateReimbursementRequest {
  type: string
  amount: number
  description?: string
  proof_file?: File | null
}

export interface UpdateReimbursementStatusRequest {
  status: 'approved' | 'rejected' | 'paid'
  reason?: string
}

export interface ReimbursementPaginationData {
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number
  to: number
  links: PaginationLink[]
}

export interface ReimbursementListResponse {
  data: {
    data: Reimbursement[]
  } & ReimbursementPaginationData
}

export interface ReimbursementResponse {
  data: {
    data: Reimbursement
  }
}
