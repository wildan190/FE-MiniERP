import type { Employee } from './employee.types'

export interface Resignation {
  id: number
  employee_id: number
  notice_date: string
  resignation_date: string
  reason: string
  status: 'pending' | 'approved' | 'rejected' | 'withdrawn'
  handover_to: number | null
  remarks: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  uuid: string
  employee?: Employee
}

export interface ResignationPaginationData {
  current_page: number
  data: Resignation[]
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

export interface ResignationListResponse {
  message: string
  data: ResignationPaginationData
}

export interface ResignationDetailResponse {
  message: string
  data: Resignation
}

export interface CreateResignationRequest {
  employee_uuid: string
  notice_date: string
  resignation_date: string
  reason: string
  handover_to_uuid?: string | null
}

export interface UpdateResignationStatusRequest {
  status: 'approved' | 'rejected' | 'withdrawn'
  remarks?: string
}
