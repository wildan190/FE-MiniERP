import { apiClient } from '../api/ApiClient'
import type {
  DesignationListResponse,
  CreateDesignationRequest,
  CreateDesignationResponse,
} from './types/designation.types'

export type {
  DesignationListResponse,
  CreateDesignationRequest,
  CreateDesignationResponse,
}

export class DesignationService {
  async getDesignations(): Promise<DesignationListResponse> {
    const response = await apiClient.getClient().get('/hrm/designations')
    return response.data
  }
}

export const designationService = new DesignationService()