import {
  salesPipelineService,
  type SalesPipelineListResponse,
  type SalesPipelineDetailResponse,
  type CreateSalesPipelineRequest,
  type CreateSalesPipelineResponse,
} from '@/services'

export class SalesPipelineRepository {
  async getSalesPipelines(page: number = 1): Promise<SalesPipelineListResponse> {
    return await salesPipelineService.getSalesPipelines(page)
  }

  async getSalesPipelineDetail(uuid: string): Promise<SalesPipelineDetailResponse> {
    return await salesPipelineService.getSalesPipelineDetail(uuid)
  }

  async createSalesPipeline(data: CreateSalesPipelineRequest): Promise<CreateSalesPipelineResponse> {
    return await salesPipelineService.createSalesPipeline(data)
  }
}

export const salesPipelineRepository = new SalesPipelineRepository()
