export interface SalaryComponent {
  id: number
  name: string
  type: 'earning' | 'deduction'
  is_taxable: boolean
  is_fixed: boolean
  value: string
  percentage_of: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
  uuid: string
}

export interface SalaryComponentListResponse {
  message: string
  data: SalaryComponent[]
}

export interface CreateSalaryComponentRequest {
  name: string
  type: 'earning' | 'deduction'
  is_taxable: boolean
  is_fixed: boolean
  value: string
  percentage_of?: string | null
}

export interface CreateSalaryComponentResponse {
  message: string
  data: SalaryComponent
}
