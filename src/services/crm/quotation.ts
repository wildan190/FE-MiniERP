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
    // Fallback to filter full list since backend might not have this endpoint
    const all = (await this.getQuotations(1)).data.data
    return all.filter((q) => q.customer_id === customerId)
  },
}
