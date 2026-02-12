import { apiClient } from '../api/ApiClient'
import type { 
  Prospect, 
  ProspectsListResponse, 
  CreateProspectRequest, 
  CreateProspectResponse,
  UpdateProspectStatusRequest,
  UpdateProspectStatusResponse,
  ProspectDetailResponse
} from './types'

export const prospectService = {
  async getProspects(page: number = 1): Promise<ProspectsListResponse> {
    const response = await apiClient.getClient().get<ProspectsListResponse>('/crm/prospects', {
      params: { page }
    })
    return response.data
  },

  async getProspectByUuid(uuid: string): Promise<Prospect> {
    const response = await apiClient.getClient().get<ProspectDetailResponse>(`/crm/prospects/${uuid}`)
    return response.data.data
  },

  async createProspect(data: CreateProspectRequest): Promise<CreateProspectResponse> {
    const response = await apiClient.getClient().post<CreateProspectResponse>('/crm/prospects', data)
    return response.data
  },

  async updateProspectStatus(uuid: string, data: UpdateProspectStatusRequest): Promise<UpdateProspectStatusResponse> {
    const response = await apiClient.getClient().put<UpdateProspectStatusResponse>(`/crm/prospects/${uuid}/status`, data)
    return response.data
  },

  async deleteProspect(uuid: string): Promise<{ message: string }> {
    const response = await apiClient.getClient().delete<{ message: string }>(`/crm/prospects/${uuid}`)
    return response.data
  }
}
