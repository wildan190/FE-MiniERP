import { apiClient } from '../api/ApiClient'
import type {
  LeaveRequestListResponse,
  CreateLeaveRequestRequest,
  CreateLeaveRequestResponse,
  UpdateLeaveRequestStatusRequest,
  UpdateLeaveRequestStatusResponse,
  LeaveBalanceResponse,
} from './types/leave-request.types'

export type {
  LeaveRequestListResponse,
  CreateLeaveRequestRequest,
  CreateLeaveRequestResponse,
  UpdateLeaveRequestStatusRequest,
  UpdateLeaveRequestStatusResponse,
  LeaveBalanceResponse,
}

export class LeaveRequestService {
  async getLeaveRequests(page: number = 1): Promise<LeaveRequestListResponse> {
    const response = await apiClient.getClient().get('/hrm/leave-requests', { params: { page } })
    return response.data
  }

  async createLeaveRequest(data: CreateLeaveRequestRequest): Promise<CreateLeaveRequestResponse> {
    const response = await apiClient.getClient().post('/hrm/leave-requests', data)
    return response.data
  }

  async updateLeaveRequestStatus(uuid: string, data: UpdateLeaveRequestStatusRequest): Promise<UpdateLeaveRequestStatusResponse> {
    const response = await apiClient.getClient().put(`/hrm/leave-requests/${uuid}/status`, data)
    return response.data
  }

  async getMyLeaveBalance(): Promise<LeaveBalanceResponse> {
    const response = await apiClient.getClient().get('/hrm/leave-balances/my-balance')
    return response.data
  }
}

export const leaveRequestService = new LeaveRequestService()
