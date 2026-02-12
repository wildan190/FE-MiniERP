import type { PaginatedResponse } from '../../types'
import type { Customer } from './customer.types'

export interface QuotationItem {
  id: number
  quotation_id: number
  description: string
  quantity: string | number
  unit_price: string | number
  tax_rate: string | number
  tax_amount: string | number
  subtotal: string | number
  total: string | number
  created_at: string
  updated_at: string
}

export interface Quotation {
  id: number
  customer_id: number
  uuid: string
  quotation_number: string
  valid_until: string
  status: 'draft' | 'sent' | 'accepted' | 'declined' | 'expired'
  subtotal: string | number
  discount_amount: string | number
  tax_amount: string | number
  total_amount: string | number
  terms?: string | null
  created_at: string
  updated_at: string
  customer?: Customer
  items?: QuotationItem[]
}

export interface CreateQuotationItemRequest {
  description: string
  quantity: number
  unit_price: number
  tax_rate?: number
}

export interface CreateQuotationRequest {
  customer_id: string // UUID
  quotation_number?: string
  valid_until: string
  discount_amount?: number
  terms?: string
  status?: 'draft' | 'sent' | 'accepted' | 'declined' | 'expired'
  items: CreateQuotationItemRequest[]
}

export interface CreateQuotationResponse {
  message: string
  data: Quotation
}

export interface QuotationDetailResponse {
  message: string
  data: Quotation
}

export type QuotationListResponse = {
  message: string
  data: PaginatedResponse<Quotation>
}
