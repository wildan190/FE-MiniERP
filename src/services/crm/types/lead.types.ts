import type { PaginatedResponse } from '../../types'

export interface Lead {
  id: number
  uuid: string
  lead_name: string
  email?: string | null
  phone?: string | null
  company?: string | null
  source: string
  status: string
  notes?: string | null
  created_at: string
  updated_at: string
}

export interface CreateLeadRequest {
  lead_name: string
  email?: string
  phone?: string
  company?: string
  source: string
  notes?: string
}

export interface ConvertLeadResponse {
  message: string
  data: {
    id: number
    uuid: string
    customer_id: number
    title: string
    status: string
    notes: string
    updated_at: string
    created_at: string
    customer: any // We can refine this if needed
  }
}

export interface CreateLeadResponse {
  message: string
  data: Lead
}

export interface LeadDetailResponse {
  message: string
  data: Lead
}

export type LeadsListResponse = {
  message: string
  data: PaginatedResponse<Lead>
}
