import { apiClient } from '../api/ApiClient'
import type { Lead, LeadsListResponse, CreateLeadRequest, CreateLeadResponse } from './types'

export class LeadService {
  async getLeads(page: number = 1): Promise<LeadsListResponse> {
    try {
      const response = await apiClient.getClient().get<LeadsListResponse>('/crm/leads', {
        params: { page },
      })
      return response.data
    } catch (err: any) {
      // Some backends accept POST for list endpoints; fallback to POST on 405
      if (err?.response?.status === 405) {
        try {
          const response = await apiClient.getClient().post<LeadsListResponse>('/crm/leads')
          return response.data
        } catch (e: any) {
          if (e?.response?.status === 422 || e?.response?.status === 405) {
            const response = await apiClient.getClient().post<LeadsListResponse>('/crm/leads', { page })
            return response.data
          }
          throw e
        }
      }
      throw err
    }
  }

  async createLead(data: CreateLeadRequest): Promise<CreateLeadResponse> {
    const response = await apiClient.getClient().post<CreateLeadResponse>('/crm/leads', data)
    return response.data
  }
}

export const leadService = new LeadService()
