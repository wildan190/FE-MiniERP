export interface Designation {
  id: number
  uuid: string
  name: string
  description: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface DesignationListResponse {
  message: string
  data: Designation[]
}

export interface DesignationDetailResponse {
  message: string
  data: Designation
}

export interface CreateDesignationRequest {
  name: string
  description?: string
}

export interface CreateDesignationResponse {
  message: string
  data: Designation
}

export interface UpdateDesignationRequest {
  name: string
  description?: string
}

export interface UpdateDesignationResponse {
  message: string
  data: Designation
}