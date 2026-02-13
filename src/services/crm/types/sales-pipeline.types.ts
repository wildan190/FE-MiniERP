import type { PaginatedResponse } from '../../types'
import type { Prospect } from './prospect.types'

export interface SalesPipeline {
  id: number
  prospect_id: number
  stage: string
  created_at: string
  updated_at: string
  uuid: string | null
  user_id: number | null
  notes: string | null
  prospect: Prospect
}

export interface CreateSalesPipelineRequest {
  prospect_id: string // UUID
  stage: string
  notes?: string
}

export interface CreateSalesPipelineResponse {
  message: string
  data: SalesPipeline
}

export type SalesPipelineListResponse = {
  message: string
  data: PaginatedResponse<SalesPipeline>
}

export interface SalesPipelineDetailResponse {
  message: string
  data: SalesPipeline
}
