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
    const id = Number(customerId)
    try {
      // 1. Try base list with query param (common pattern: /crm/quotation?customer_id=X)
      const response = await apiClient.getClient().get<QuotationListResponse>('/crm/quotation', {
        params: { customer_id: id }
      })
      
      // response.data.data is PaginatedResponse<Quotation>
      const paginatedData = response.data.data
      const quotations = paginatedData.data
      
      // If the response is filtered correctly, return it.
      if (quotations.length > 0 && quotations.every((q: Quotation) => Number(q.customer_id) === id)) {
        return quotations
      }
      
      // 2. Try specific singular customer endpoint (pattern: /crm/customers/{id}/quotation)
      const responseSub = await apiClient.getClient().get<{ data: Quotation[] | Quotation }>(`/crm/customers/${id}/quotation`)
      const subData = responseSub.data.data
      return Array.isArray(subData) ? subData : [subData]
    } catch (err) {
      // 3. Fallback to filter first page of full list
      try {
        const resp = await this.getQuotations(1)
        const all = resp.data.data // data field of PaginatedResponse
        return all.filter((q) => Number(q.customer_id) === id)
      } catch (err2) {
        console.error('Failed all attempts to fetch customer quotations:', err2)
        return []
      }
    }
  },
}
