import { hrmReportService } from '../../services/hrm/hrm-report'
import type { TurnoverResponse, LaborCostResponse } from '../../services/hrm/types/hrm-report.types'

export class HrmReportRepository {
  async getTurnoverStatistics(year?: number): Promise<TurnoverResponse> {
    return await hrmReportService.getTurnoverStatistics(year)
  }

  async getLaborCostStatistics(year?: number): Promise<LaborCostResponse> {
    return await hrmReportService.getLaborCostStatistics(year)
  }
}

export const hrmReportRepository = new HrmReportRepository()
