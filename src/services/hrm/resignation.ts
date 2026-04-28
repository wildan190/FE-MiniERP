import { apiClient } from '../api/ApiClient'
import type { 
  ResignationListResponse, 
  ResignationDetailResponse, 
  CreateResignationRequest,
  UpdateResignationStatusRequest
} from './types/resignation.types'

export class ResignationService {
  async getResignations(page: number = 1, filters: any = {}): Promise<ResignationListResponse> {
    const response = await apiClient.getClient().get('/hrm/resignations', {
      params: { page, ...filters }
    })
    return response.data
  }

  async getResignationDetail(uuid: string): Promise<ResignationDetailResponse> {
    const response = await apiClient.getClient().get(`/hrm/resignations/${uuid}`)
    return response.data
  }

  async submitResignation(data: CreateResignationRequest): Promise<ResignationDetailResponse> {
    const response = await apiClient.getClient().post('/hrm/resignations', data)
    return response.data
  }

  async updateStatus(uuid: string, data: UpdateResignationStatusRequest): Promise<ResignationDetailResponse> {
    const response = await apiClient.getClient().put(`/hrm/resignations/${uuid}/status`, data)
    return response.data
  }

  async deleteResignation(uuid: string): Promise<{ message: string }> {
    const response = await apiClient.getClient().delete(`/hrm/resignations/${uuid}`)
    return response.data
  }
}

export const resignationService = new ResignationService()
