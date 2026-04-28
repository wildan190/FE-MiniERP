import type { SalaryComponent } from './salary-component.types'

export interface EmployeeSalaryComponent {
  uuid: string // Salary Component UUID
  name: string
  type: 'earning' | 'deduction'
  is_fixed: boolean
  is_taxable: boolean
  default_value: string
  custom_value: string | null
  effective_value: string
  salary_component?: SalaryComponent
}

export interface EmployeeSalaryComponentListResponse {
  message: string
  data: EmployeeSalaryComponent[]
}

export interface EmployeeSalaryComponentResponse {
  message: string
  data: EmployeeSalaryComponent
}

export interface AssignSalaryComponentRequest {
  salary_component_uuid: string
  custom_value?: string | null
}

export interface UpdateSalaryComponentRequest {
  custom_value: string | null
}
