import type { Employee } from './employee.types'
import type { OfficeLocation } from './office-location.types'
import type { PaginationLink } from '../../types'

export interface Shift {
  id: number
  name: string
  start_time: string
  end_time: string
  uuid: string
}

export interface Attendance {
  id: number
  uuid: string
  employee_id: number
  shift_id: number | null
  office_location_id: number | null
  date: string
  clock_in: string
  clock_out: string | null
  status: 'present' | 'absent' | 'late' | 'half_day' | 'on_leave'
  face_verification_status: 'pending' | 'verified' | 'failed' | 'skipped'
  location_verification_status: 'pending' | 'verified' | 'failed' | 'skipped'
  location_lat: string | null
  location_long: string | null
  check_in_latitude: number | null
  check_in_longitude: number | null
  check_out_latitude: number | null
  check_out_longitude: number | null
  notes: string | null
  created_at: string
  updated_at: string
  employee?: Employee
  shift?: Shift
  office_location?: OfficeLocation
}

export interface AttendanceFilters {
  employee_uuid?: string
  date?: string
  department_uuid?: string
}

export interface AttendancePaginationData {
  data: Attendance[]
  current_page: number
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

export interface AttendanceListResponse {
  message: string
  data: AttendancePaginationData
}

export interface ClockInRequest {
  location_lat?: string
  location_long?: string
  notes?: string
  face_image?: File
  office_location_uuid?: string
  latitude?: number
  longitude?: number
}

export interface ClockOutRequest {
  notes?: string
  face_image?: File
  latitude?: number
  longitude?: number
}

export interface AttendanceResponse {
  message: string
  data: Attendance
}
