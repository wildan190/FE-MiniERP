import { apiClient } from '../api/ApiClient'
import type {
  Prospect,
  ProspectsListResponse,
  CreateProspectRequest,
  CreateProspectResponse,
  UpdateProspectStatusRequest,
  UpdateProspectStatusResponse,
} from './types'

export class ProspectService {
  async getProspects(page: number = 1): Promise<ProspectsListResponse> {
    try {
      const response = await apiClient.getClient().get<ProspectsListResponse>('/crm/prospects', {
        params: { page },
      })
      return response.data
    } catch (err: any) {
      if (err?.response?.status === 405) {
        try {
          const response = await apiClient.getClient().post<ProspectsListResponse>('/crm/prospects')
          return response.data
        } catch (e: any) {
          if (e?.response?.status === 422 || e?.response?.status === 405) {
            const response = await apiClient.getClient().post<ProspectsListResponse>('/crm/prospects', { page })
            return response.data
          }
          throw e
        }
      }
      throw err
    }
  }

  async createProspect(data: CreateProspectRequest): Promise<CreateProspectResponse> {
    const response = await apiClient.getClient().post<CreateProspectResponse>('/crm/prospects', data)
    return response.data
  }

  async updateProspectStatus(id: number, data: UpdateProspectStatusRequest): Promise<UpdateProspectStatusResponse> {
    const response = await apiClient.getClient().put<UpdateProspectStatusResponse>(`/crm/prospects/${id}/status`, data)
    return response.data
  }
}

export const prospectService = new ProspectService()
