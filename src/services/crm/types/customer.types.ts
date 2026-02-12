import type { PaginatedResponse } from '../../types'

export interface Customer {
  id: number
  uuid: string
  name: string
  email: string
  company_name?: string | null
  customer_type?: string | null
  tax_id?: string | null
  industry?: string | null
  website?: string | null
  phone?: string | null
  alt_phone?: string | null
  department?: string | null
  billing_address?: string | null
  shipping_address?: string | null
  city?: string | null
  province?: string | null
  postal_code?: string | null
  country?: string | null
  address?: string // Keeping for backward compatibility if needed, or mapped from billing/shipping
  credit_limit?: string | number
  payment_terms?: string | null
  currency?: string
  segment?: string | null
  status?: string
  notes?: string | null
  created_at: string
  updated_at: string
}

export interface CreateCustomerRequest {
  name: string
  email: string
  phone?: string
  alt_phone?: string
  company_name?: string
  customer_type?: string
  tax_id?: string
  industry?: string
  website?: string
  department?: string
  billing_address?: string
  shipping_address?: string
  city?: string
  province?: string
  postal_code?: string
  country?: string
  credit_limit?: number | string
  payment_terms?: string
  currency?: string
  segment?: string
  status?: string
  notes?: string
}

export interface CreateCustomerResponse {
  message: string
  data: Customer
}

export type CustomersListResponse = {
  message: string
  data: PaginatedResponse<Customer>
}
