import { apiClient } from '../api/ApiClient'
import type {
  ShiftListResponse,
  ShiftResponse,
  CreateShiftRequest,
  UpdateShiftRequest,
  Shift,
} from './types/shift.types'

export class ShiftService {
  async getShifts(page: number = 1): Promise<ShiftListResponse> {
    const response = await apiClient.getClient().get('/hrm/shifts', {
      params: { page },
    })
    return response.data
  }

  async getActiveShifts(): Promise<{ data: Shift[] }> {
    const response = await apiClient.getClient().get('/hrm/shifts', {
      params: { all: true }, // Assuming 'getActiveShifts' on backend maps to a filter or specific endpoint
    })
    return response.data
  }

  async createShift(data: CreateShiftRequest): Promise<ShiftResponse> {
    const response = await apiClient.getClient().post('/hrm/shifts', data)
    return response.data
  }

  async updateShift(uuid: string, data: UpdateShiftRequest): Promise<ShiftResponse> {
    const response = await apiClient.getClient().put(`/hrm/shifts/${uuid}`, data)
    return response.data
  }

  async deleteShift(uuid: string): Promise<{ message: string }> {
    const response = await apiClient.getClient().delete(`/hrm/shifts/${uuid}`)
    return response.data
  }
}

export const shiftService = new ShiftService()
