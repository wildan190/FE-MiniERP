import { apiClient } from './api/ApiClient'
import type { DashboardResponse, CRMDashboardResponse } from './types'

export class DashboardService {
  async getDashboard(): Promise<DashboardResponse> {
    const response = await apiClient.getClient().get<DashboardResponse>('/dashboard')
    return response.data
  }

  async getCRMDashboard(): Promise<CRMDashboardResponse> {
    const response = await apiClient.getClient().get<CRMDashboardResponse>('/crm/dashboard')
    return response.data
  }
}

export const dashboardService = new DashboardService()
