import type { Department } from './department.types'
import type { Designation } from './designation.types'

export interface User {
  id: number
  name: string
  email: string
  email_verified_at: string | null
  created_at: string
  updated_at: string
  uuid: string
}

export interface Employee {
  id: number
  user_id: number | null
  department_id: number | null
  designation_id: number | null
  emp_code: string | null
  joining_date: string | null
  status: 'active' | 'inactive' | 'terminated' | 'resigned' | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  nik: string | null
  place_of_birth: string | null
  date_of_birth: string | null
  gender: 'male' | 'female' | null
  marital_status: 'single' | 'married' | 'divorced' | 'widowed' | null
  religion: string | null
  address: string | null
  phone: string | null
  emergency_contact_name: string | null
  emergency_contact_phone: string | null
  shift_id: number | null
  basic_salary: string | null
  bank_name: string | null
  bank_account_number: string | null
  first_name: string | null
  last_name: string | null
  face_encoding: string | null
  face_image_path: string | null
  requires_face_verification: boolean
  uuid: string
  user?: User
  department?: Department
  designation?: Designation
}

export interface EmployeePaginationData {
  current_page: number
  data: Employee[]
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

export interface EmployeeListResponse {
  message: string
  data: EmployeePaginationData
}

export interface CreateEmployeeRequest {
  first_name?: string
  last_name?: string
  email?: string
  password?: string
  department_uuid?: string
  designation_uuid?: string
  joining_date?: string
  status?: 'active' | 'inactive' | 'terminated' | 'resigned'
  nik?: string
  place_of_birth?: string
  date_of_birth?: string
  gender?: 'male' | 'female'
  marital_status?: 'single' | 'married' | 'divorced' | 'widowed'
  religion?: string
  address?: string
  phone?: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
}

export interface UpdateEmployeeRequest {
  user_uuid?: string
  first_name?: string
  last_name?: string
  department_uuid?: string
  designation_uuid?: string
  emp_code?: string
  joining_date?: string
  status?: 'active' | 'inactive' | 'terminated' | 'resigned'
  nik?: string
  place_of_birth?: string
  date_of_birth?: string
  gender?: 'male' | 'female'
  marital_status?: 'single' | 'married' | 'divorced' | 'widowed'
  religion?: string
  address?: string
  phone?: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
}

export interface CreateEmployeeResponse {
  message: string
  data: Employee
}

export interface UpdateEmployeeResponse {
  message: string
  data: Employee
}

export interface EmployeeDetailResponse {
  message: string
  data: Employee
}

export interface EmployeeFormData {
  first_name?: string
  last_name?: string
  email?: string
  password?: string
  user_uuid?: string
  department_uuid?: string
  designation_uuid?: string
  emp_code?: string
  joining_date?: string
  status?: 'active' | 'inactive' | 'terminated' | 'resigned'
  nik?: string
  place_of_birth?: string
  date_of_birth?: string
  gender?: 'male' | 'female'
  marital_status?: 'single' | 'married' | 'divorced' | 'widowed'
  religion?: string
  address?: string
  phone?: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
}