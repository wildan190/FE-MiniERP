import {
  designationService,
  type DesignationListResponse,
} from '../../services/hrm'

export class DesignationRepository {
  async getDesignations(): Promise<DesignationListResponse> {
    return await designationService.getDesignations()
  }
}

export const designationRepository = new DesignationRepository()