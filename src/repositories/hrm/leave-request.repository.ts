import { leaveRequestService } from '../../services/hrm/leave-request'
import type {
  LeaveRequestListResponse,
  CreateLeaveRequestRequest,
  CreateLeaveRequestResponse,
  UpdateLeaveRequestStatusRequest,
  UpdateLeaveRequestStatusResponse,
  LeaveBalanceResponse,
} from '../../services/hrm/types/leave-request.types'

export class LeaveRequestRepository {
  async getLeaveRequests(page: number = 1, filters: Record<string, string | number | undefined> = {}): Promise<LeaveRequestListResponse> {
    return await leaveRequestService.getLeaveRequests(page, filters)
  }

  async createLeaveRequest(data: CreateLeaveRequestRequest): Promise<CreateLeaveRequestResponse> {
    return await leaveRequestService.createLeaveRequest(data)
  }

  async updateLeaveRequestStatus(uuid: string, data: UpdateLeaveRequestStatusRequest): Promise<UpdateLeaveRequestStatusResponse> {
    return await leaveRequestService.updateLeaveRequestStatus(uuid, data)
  }

  async getMyLeaveBalance(): Promise<LeaveBalanceResponse> {
    return await leaveRequestService.getMyLeaveBalance()
  }
}

export const leaveRequestRepository = new LeaveRequestRepository()
