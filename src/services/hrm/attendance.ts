import { apiClient } from '../api/ApiClient'
import type {
  AttendanceListResponse,
  AttendanceFilters,
  ClockInRequest,
  ClockOutRequest,
  AttendanceResponse,
} from './types/attendance.types'

export class AttendanceService {
  async getAttendances(filters: AttendanceFilters = {}, page: number = 1): Promise<AttendanceListResponse> {
    const response = await apiClient.getClient().get('/hrm/attendances', {
      params: { ...filters, page },
    })
    return response.data
  }

  async clockIn(data: ClockInRequest): Promise<AttendanceResponse> {
    const formData = new FormData()
    if (data.location_lat) formData.append('location_lat', data.location_lat)
    if (data.location_long) formData.append('location_long', data.location_long)
    if (data.notes) formData.append('notes', data.notes)
    if (data.face_image) formData.append('face_image', data.face_image)
    if (data.office_location_uuid) formData.append('office_location_uuid', data.office_location_uuid)
    if (data.latitude) formData.append('latitude', data.latitude.toString())
    if (data.longitude) formData.append('longitude', data.longitude.toString())

    const response = await apiClient.getClient().post('/hrm/attendances/clock-in', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  }

  async clockOut(data: ClockOutRequest): Promise<AttendanceResponse> {
    const formData = new FormData()
    if (data.notes) formData.append('notes', data.notes)
    if (data.face_image) formData.append('face_image', data.face_image)
    if (data.latitude) formData.append('latitude', data.latitude.toString())
    if (data.longitude) formData.append('longitude', data.longitude.toString())

    const response = await apiClient.getClient().post('/hrm/attendances/clock-out', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  }
}

export const attendanceService = new AttendanceService()
