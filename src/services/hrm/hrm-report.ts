import { apiClient } from '../api/ApiClient'
import type {
  TurnoverResponse,
  LaborCostResponse,
} from './types/hrm-report.types'

export type { TurnoverResponse, LaborCostResponse }

export class HrmReportService {
  async getTurnoverStatistics(year?: number): Promise<TurnoverResponse> {
    const params = year ? { year } : {}
    const response = await apiClient.getClient().get('/hrm/reports/turnover', { params })
    return response.data
  }

  async getLaborCostStatistics(year?: number): Promise<LaborCostResponse> {
    const params = year ? { year } : {}
    const response = await apiClient.getClient().get('/hrm/reports/labor-cost', { params })
    return response.data
  }
}

export const hrmReportService = new HrmReportService()
