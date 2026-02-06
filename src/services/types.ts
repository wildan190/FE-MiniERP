// API Request/Response Types
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token?: string
  message?: string
  user?: {
    id: number
    name: string
    email: string
    email_verified_at: string | null
    created_at: string
    updated_at: string
  }
}

export interface DashboardResponse {
  message: string
  user: {
    id: number
    name: string
    email: string
    email_verified_at: string | null
    created_at: string
    updated_at: string
  }
}

export interface CRMDashboardResponse {
  metrics: {
    total_customers: number
    total_leads: number
    total_prospects: number
    active_pipelines: number
    total_quotation: number
    quotation_value: string
    prospect_by_status: Array<{
      status: string
      total: number
    }>
  }
}

// Pagination Helper
export interface PaginationLink {
  url: string | null
  label: string
  page: number | null
  active: boolean
}

export interface PaginatedResponse<T> {
  current_page: number
  data: T[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: PaginationLink[]
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number
  total: number
}
