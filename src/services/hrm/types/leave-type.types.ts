export interface LeaveType {
  id: number
  uuid: string
  name: string
  days_allowed: number
  description: string | null
  created_at: string
  updated_at: string
}

export interface LeaveTypeListResponse {
  message: string
  data: LeaveType[]
}

export interface LeaveTypeDetailResponse {
  message: string
  data: LeaveType
}

export interface CreateLeaveTypeRequest {
  name: string
  days_allowed: number
  description?: string | null
}

export interface CreateLeaveTypeResponse {
  message: string
  data: LeaveType
}

export interface UpdateLeaveTypeRequest {
  name: string
  days_allowed: number
  description?: string | null
}

export interface UpdateLeaveTypeResponse {
  message: string
  data: LeaveType
}
