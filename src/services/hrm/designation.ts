import { apiClient } from '../api/ApiClient'
import type {
  DesignationListResponse,
  DesignationDetailResponse,
  CreateDesignationRequest,
  CreateDesignationResponse,
  UpdateDesignationRequest,
  UpdateDesignationResponse,
} from './types/designation.types'

export type {
  DesignationListResponse,
  DesignationDetailResponse,
  CreateDesignationRequest,
  CreateDesignationResponse,
  UpdateDesignationRequest,
  UpdateDesignationResponse,
}

export class DesignationService {
  async getDesignations(): Promise<DesignationListResponse> {
    const response = await apiClient.getClient().get('/hrm/designations')
    return response.data
  }

  async getDesignationDetail(uuid: string): Promise<DesignationDetailResponse> {
    const response = await apiClient.getClient().get(`/hrm/designations/${uuid}`)
    return response.data
  }

  async createDesignation(data: CreateDesignationRequest): Promise<CreateDesignationResponse> {
    const response = await apiClient.getClient().post('/hrm/designations', data)
    return response.data
  }

  async updateDesignation(uuid: string, data: UpdateDesignationRequest): Promise<UpdateDesignationResponse> {
    const response = await apiClient.getClient().put(`/hrm/designations/${uuid}`, data)
    return response.data
  }

  async deleteDesignation(uuid: string): Promise<{ message: string }> {
    const response = await apiClient.getClient().delete(`/hrm/designations/${uuid}`)
    return response.data
  }
}

export const designationService = new DesignationService()