import type { PaginatedResponse } from '../../types'

export interface SalesPipeline {
  id: number
  prospect_id: number
  stage: string
  created_at: string
  updated_at: string
}

export interface CreateSalesPipelineRequest {
  prospect_id: number
  stage: string
}

export interface CreateSalesPipelineResponse {
  message: string
  data: SalesPipeline
}

export type SalesPipelineListResponse = {
  message: string
  data: PaginatedResponse<SalesPipeline>
}
