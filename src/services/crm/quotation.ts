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

  async getCustomerQuotations(customerId: number | string): Promise<Quotation[]> {
    try {
      // Fetch quotations with customer_id query param
      const response = await apiClient.getClient().get<QuotationListResponse>('/crm/quotation', {
        params: { customer_id: customerId }
      })
      
      const paginatedData = response.data.data
      const quotations = paginatedData.data || []
      
      // Return filtered quotations
      return quotations.filter((q: Quotation) => 
        String(q.customer_id) === String(customerId) || 
        q.customer?.uuid === String(customerId) ||
        String(q.customer?.id) === String(customerId)
      )
    } catch (err) {
      console.error('Failed to fetch customer quotations:', err)
      return []
    }
  },
}
