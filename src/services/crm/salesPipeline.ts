import { apiClient } from '../api/ApiClient'
import type {
  SalesPipeline,
  SalesPipelineListResponse,
  CreateSalesPipelineRequest,
  CreateSalesPipelineResponse,
} from './types'

export class SalesPipelineService {
  async getSalesPipelines(page: number = 1): Promise<SalesPipelineListResponse> {
    try {
      const response = await apiClient.getClient().get<SalesPipelineListResponse>('/crm/sales-pipeline', {
        params: { page },
      })
      return response.data
    } catch (err: any) {
      if (err?.response?.status === 405) {
        try {
          const response = await apiClient.getClient().post<SalesPipelineListResponse>('/crm/sales-pipeline')
          return response.data
        } catch (e: any) {
          if (e?.response?.status === 422 || e?.response?.status === 405) {
            const response = await apiClient.getClient().post<SalesPipelineListResponse>('/crm/sales-pipeline', { page })
            return response.data
          }
          throw e
        }
      }
      throw err
    }
  }

  async createSalesPipeline(data: CreateSalesPipelineRequest): Promise<CreateSalesPipelineResponse> {
    const response = await apiClient.getClient().post<CreateSalesPipelineResponse>('/crm/sales-pipeline', data)
    return response.data
  }
}

export const salesPipelineService = new SalesPipelineService()
