import { apiClient } from '../api/ApiClient'
import type {
  LeaveTypeListResponse,
  LeaveTypeDetailResponse,
  CreateLeaveTypeRequest,
  CreateLeaveTypeResponse,
  UpdateLeaveTypeRequest,
  UpdateLeaveTypeResponse,
} from './types/leave-type.types'

export type {
  LeaveTypeListResponse,
  LeaveTypeDetailResponse,
  CreateLeaveTypeRequest,
  CreateLeaveTypeResponse,
  UpdateLeaveTypeRequest,
  UpdateLeaveTypeResponse,
}

export class LeaveTypeService {
  async getLeaveTypes(): Promise<LeaveTypeListResponse> {
    const response = await apiClient.getClient().get('/hrm/leave-types')
    return response.data
  }

  async getLeaveTypeDetail(uuid: string): Promise<LeaveTypeDetailResponse> {
    const response = await apiClient.getClient().get(`/hrm/leave-types/${uuid}`)
    return response.data
  }

  async createLeaveType(data: CreateLeaveTypeRequest): Promise<CreateLeaveTypeResponse> {
    const response = await apiClient.getClient().post('/hrm/leave-types', data)
    return response.data
  }

  async updateLeaveType(uuid: string, data: UpdateLeaveTypeRequest): Promise<UpdateLeaveTypeResponse> {
    const response = await apiClient.getClient().put(`/hrm/leave-types/${uuid}`, data)
    return response.data
  }

  async deleteLeaveType(uuid: string): Promise<{ message: string }> {
    const response = await apiClient.getClient().delete(`/hrm/leave-types/${uuid}`)
    return response.data
  }
}

export const leaveTypeService = new LeaveTypeService()
