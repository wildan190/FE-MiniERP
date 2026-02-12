import { apiClient } from '../api/ApiClient'
import type { Lead, LeadsListResponse, CreateLeadRequest, CreateLeadResponse, ConvertLeadResponse, LeadDetailResponse } from './types'

export const leadService = {
  async getLeads(page: number = 1): Promise<LeadsListResponse> {
    const response = await apiClient.getClient().get<LeadsListResponse>('/crm/leads', {
      params: { page },
    })
    return response.data
  },

  async getLeadByUuid(uuid: string): Promise<Lead> {
    const response = await apiClient.getClient().get<LeadDetailResponse>(`/crm/leads/${uuid}`)
    return response.data.data
  },

  async createLead(data: CreateLeadRequest): Promise<CreateLeadResponse> {
    const response = await apiClient.getClient().post<CreateLeadResponse>('/crm/leads', data)
    return response.data
  },

  async updateLead(uuid: string, data: CreateLeadRequest): Promise<CreateLeadResponse> {
    const response = await apiClient.getClient().put<CreateLeadResponse>(`/crm/leads/${uuid}`, data)
    return response.data
  },

  async deleteLead(uuid: string): Promise<{ message: string }> {
    const response = await apiClient.getClient().delete<{ message: string }>(`/crm/leads/${uuid}`)
    return response.data
  },

  async convertLeadToProspect(uuid: string): Promise<ConvertLeadResponse> {
    const response = await apiClient.getClient().post<ConvertLeadResponse>(`/crm/leads/${uuid}/convert`)
    return response.data
  }
}
