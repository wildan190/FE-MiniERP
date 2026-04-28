import { 
  resignationService,
  type ResignationListResponse, 
  type ResignationDetailResponse, 
  type CreateResignationRequest,
  type UpdateResignationStatusRequest
} from '../../services/hrm'

export class ResignationRepository {
  async getResignations(page: number = 1, filters: any = {}): Promise<ResignationListResponse> {
    return await resignationService.getResignations(page, filters)
  }

  async getResignationDetail(uuid: string): Promise<ResignationDetailResponse> {
    return await resignationService.getResignationDetail(uuid)
  }

  async submitResignation(data: CreateResignationRequest): Promise<ResignationDetailResponse> {
    return await resignationService.submitResignation(data)
  }

  async updateStatus(uuid: string, data: UpdateResignationStatusRequest): Promise<ResignationDetailResponse> {
    return await resignationService.updateStatus(uuid, data)
  }

  async deleteResignation(uuid: string): Promise<{ message: string }> {
    return await resignationService.deleteResignation(uuid)
  }
}

export const resignationRepository = new ResignationRepository()
