import {
  designationService,
  type DesignationListResponse,
  type DesignationDetailResponse,
  type CreateDesignationRequest,
  type CreateDesignationResponse,
  type UpdateDesignationRequest,
  type UpdateDesignationResponse,
} from '../../services/hrm'

export class DesignationRepository {
  async getDesignations(): Promise<DesignationListResponse> {
    return await designationService.getDesignations()
  }

  async getDesignationDetail(uuid: string): Promise<DesignationDetailResponse> {
    return await designationService.getDesignationDetail(uuid)
  }

  async createDesignation(data: CreateDesignationRequest): Promise<CreateDesignationResponse> {
    return await designationService.createDesignation(data)
  }

  async updateDesignation(uuid: string, data: UpdateDesignationRequest): Promise<UpdateDesignationResponse> {
    return await designationService.updateDesignation(uuid, data)
  }

  async deleteDesignation(uuid: string): Promise<{ message: string }> {
    return await designationService.deleteDesignation(uuid)
  }
}

export const designationRepository = new DesignationRepository()