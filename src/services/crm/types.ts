import type { PaginatedResponse, PaginationLink } from '../types'

// Customer
export interface Customer {
  id: number
  name: string
  email: string
  phone?: string
  address?: string
  created_at: string
  updated_at: string
}

export interface CreateCustomerRequest {
  name: string
  email: string
}

export interface CreateCustomerResponse {
  message: string
  data: Customer
}

export type CustomersListResponse = {
  message: string
  data: PaginatedResponse<Customer>
}

// Lead
export interface Lead {
  id: number
  lead_name: string
  source: string
  created_at: string
  updated_at: string
}

export interface CreateLeadRequest {
  lead_name: string
  source: string
}

export interface CreateLeadResponse {
  message: string
  data: Lead
}

export type LeadsListResponse = {
  message: string
  data: PaginatedResponse<Lead>
}

// Prospect
export interface Prospect {
  id: number
  customer_id: number
  status: string
  created_at: string
  updated_at: string
}

export interface CreateProspectRequest {
  customer_id: number
  status: string
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

export type ProspectsListResponse = {
  message: string
  data: PaginatedResponse<Prospect>
}

// Sales Pipeline
export interface SalesPipeline {
  id: number
  prospect_id: number
  stage: string
  created_at: string
  updated_at: string
}

export interface CreateSalesPipelineRequest {
  prospect_id: number
  stage: string
}

export interface CreateSalesPipelineResponse {
  message: string
  data: SalesPipeline
}

export type SalesPipelineListResponse = {
  message: string
  data: PaginatedResponse<SalesPipeline>
}

// Quotation
export interface Quotation {
  id: number
  customer_id: number
  amount: number | string
  valid_until: string
  created_at: string
  updated_at: string
  status?: string
}

export interface CreateQuotationRequest {
  customer_id: number
  amount: number
  valid_until: string
}

export interface CreateQuotationResponse {
  message: string
  data: Quotation
}

export type QuotationListResponse = {
  message: string
  data: PaginatedResponse<Quotation>
}

// Order
export interface Order {
  id: number
  customer_id: number
  total_amount: number | string
  status: string
  created_at: string
  updated_at: string
}

// Interaction
export interface Interaction {
  id: number
  customer_id: number
  type: string
  notes: string
  contacted_by?: string
  status?: string
  created_at: string
  updated_at: string
}
