import { apiClient } from '../api/ApiClient'
import type {
  Quotation,
  QuotationListResponse,
  CreateQuotationRequest,
  CreateQuotationResponse,
  QuotationDetailResponse,
} from './types'

export const quotationService = {
  async getQuotations(page = 1): Promise<QuotationListResponse> {
    const response = await apiClient.getClient().get<QuotationListResponse>(
      `/crm/quotation?page=${page}`
    )
    return response.data
  },

  async getQuotationById(uuid: string): Promise<QuotationDetailResponse> {
    const response = await apiClient.getClient().get<QuotationDetailResponse>(
      `/crm/quotation/${uuid}`
    )
    return response.data
  },

  async createQuotation(data: CreateQuotationRequest): Promise<CreateQuotationResponse> {
    const response = await apiClient.getClient().post<CreateQuotationResponse>(
      '/crm/quotation',
      data
    )
    return response.data
  },

  async updateQuotation(
    uuid: string,
    data: CreateQuotationRequest
  ): Promise<CreateQuotationResponse> {
    const response = await apiClient.getClient().put<CreateQuotationResponse>(
      `/crm/quotation/${uuid}`,
      data
    )
    return response.data
  },

  async deleteQuotation(uuid: string): Promise<{ message: string }> {
    const response = await apiClient.getClient().delete<{ message: string }>(
      `/crm/quotation/${uuid}`
    )
    return response.data
  },

  async getCustomerQuotations(customerId: number): Promise<Quotation[]> {
    try {
      // Try specific customer endpoint first (pattern: /crm/customers/{id}/quotations)
      const response = await apiClient.getClient().get<{ data: Quotation[] }>(`/crm/customers/${customerId}/quotations`)
      return response.data.data
    } catch (err) {
      try {
        // Try singular if plural fails
        const response = await apiClient.getClient().get<{ data: Quotation[] }>(`/crm/customers/${customerId}/quotation`)
        return response.data.data
      } catch (err2) {
        // Fallback to filter full list if direct endpoints fail
        const all = (await this.getQuotations(1)).data.data
        return all.filter((q) => Number(q.customer_id) === Number(customerId))
      }
    }
  },
}
