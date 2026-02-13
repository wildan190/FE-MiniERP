import { dashboardService, type DashboardResponse, type CRMDashboardResponse } from '@/services'

export class DashboardRepository {
  async getDashboard(): Promise<DashboardResponse> {
    return await dashboardService.getDashboard()
  }

  async getCRMDashboard(): Promise<CRMDashboardResponse> {
    return await dashboardService.getCRMDashboard()
  }
}

export const dashboardRepository = new DashboardRepository()
