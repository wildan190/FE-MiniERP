import type { PaginatedResponse } from '../../types'
import type { Customer } from './customer.types'

export interface Prospect {
  id: number
  uuid: string
  customer_id: number
  title: string
  status: string
  expected_value: string | null
  expected_closing_date: string | null
  probability: number | null
  notes: string | null
  created_at: string
  updated_at: string
  customer?: Customer
  pipelines?: any[]
}

export interface CreateProspectRequest {
  customer_id: string // UUID
  title: string
  status: string
  expected_value?: number
  expected_closing_date?: string
  probability?: number
  notes?: string
}

export interface CreateProspectResponse {
  message: string
  data: Prospect
}

export interface UpdateProspectStatusRequest {
  status: string
}

export interface UpdateProspectStatusResponse {
  message: string
  data: Prospect
}

export interface ProspectDetailResponse {
  message: string
  data: Prospect
}

export type ProspectsListResponse = {
  message: string
  data: PaginatedResponse<Prospect>
}
