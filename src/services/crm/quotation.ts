import { apiClient } from '../api/ApiClient'
import type {
  Quotation,
  QuotationListResponse,
  CreateQuotationRequest,
  CreateQuotationResponse,
} from './types'

export class QuotationService {
  async getQuotations(page: number = 1): Promise<QuotationListResponse> {
    try {
      const response = await apiClient.getClient().get<QuotationListResponse>('/crm/quotation', {
        params: { page },
      })
      return response.data
    } catch (err: any) {
      if (err?.response?.status === 405) {
        try {
          const response = await apiClient.getClient().post<QuotationListResponse>('/crm/quotation')
          return response.data
        } catch (e: any) {
          if (e?.response?.status === 422 || e?.response?.status === 405) {
            const response = await apiClient.getClient().post<QuotationListResponse>('/crm/quotation', { page })
            return response.data
          }
          throw e
        }
      }
      throw err
    }
  }

  async getCustomerQuotations(customerId: number): Promise<Quotation[]> {
    // If backend has an endpoint, prefer it; fallback to filter full list
    try {
      const resp = await apiClient.getClient().get<{ data: Quotation[] }>(`/crm/customers/${customerId}/quotations`)
      return resp.data.data
    } catch (e) {
      const all = (await this.getQuotations(1)).data.data
      return all.filter((q) => q.customer_id === customerId)
    }
  }

  async createQuotation(data: CreateQuotationRequest): Promise<CreateQuotationResponse> {
    const response = await apiClient.getClient().post<CreateQuotationResponse>('/crm/quotation', data)
    return response.data
  }
}

export const quotationService = new QuotationService()
