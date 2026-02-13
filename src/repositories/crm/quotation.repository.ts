import { quotationService, type QuotationListResponse, type CreateQuotationRequest, type CreateQuotationResponse } from '@/services'

export class QuotationRepository {
  async getQuotations(page: number = 1): Promise<QuotationListResponse> {
    return await quotationService.getQuotations(page)
  }

  async createQuotation(data: CreateQuotationRequest): Promise<CreateQuotationResponse> {
    return await quotationService.createQuotation(data)
  }
}

export const quotationRepository = new QuotationRepository()
