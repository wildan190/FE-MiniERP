import type { PaginationLink } from '../../types'

export interface Shift {
  id: number
  uuid: string
  name: string
  start_time: string
  end_time: string
  description: string | null
  created_at: string
  updated_at: string
}

export interface ShiftFilters {
  name?: string
}

export interface ShiftPaginationData {
  data: Shift[]
  current_page: number
  first_page_url: string
  from: number | null
  last_page: number
  last_page_url: string
  links: PaginationLink[]
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number | null
  total: number
}

export interface ShiftListResponse {
  message: string
  data: ShiftPaginationData
}

export interface ShiftResponse {
  message: string
  data: Shift
}

export interface CreateShiftRequest {
  name: string
  start_time: string
  end_time: string
  description?: string
}

export interface UpdateShiftRequest {
  name: string
  start_time: string
  end_time: string
  description?: string
}
