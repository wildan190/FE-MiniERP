import {
  leaveTypeService,
  type LeaveTypeListResponse,
  type LeaveTypeDetailResponse,
  type CreateLeaveTypeRequest,
  type CreateLeaveTypeResponse,
  type UpdateLeaveTypeRequest,
  type UpdateLeaveTypeResponse,
} from '../../services/hrm/leave-type'

export class LeaveTypeRepository {
  async getLeaveTypes(): Promise<LeaveTypeListResponse> {
    return await leaveTypeService.getLeaveTypes()
  }

  async getLeaveTypeDetail(uuid: string): Promise<LeaveTypeDetailResponse> {
    return await leaveTypeService.getLeaveTypeDetail(uuid)
  }

  async createLeaveType(data: CreateLeaveTypeRequest): Promise<CreateLeaveTypeResponse> {
    return await leaveTypeService.createLeaveType(data)
  }

  async updateLeaveType(uuid: string, data: UpdateLeaveTypeRequest): Promise<UpdateLeaveTypeResponse> {
    return await leaveTypeService.updateLeaveType(uuid, data)
  }

  async deleteLeaveType(uuid: string): Promise<{ message: string }> {
    return await leaveTypeService.deleteLeaveType(uuid)
  }
}

export const leaveTypeRepository = new LeaveTypeRepository()
