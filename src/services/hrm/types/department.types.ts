export interface Department {
  id: number
  uuid: string
  name: string
  description: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface DepartmentListResponse {
  message: string
  data: Department[]
}

export interface CreateDepartmentRequest {
  name: string
  description?: string
}

export interface CreateDepartmentResponse {
  message: string
  data: Department
}
