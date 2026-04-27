import { apiClient } from '../api/ApiClient'
import type {
  PayrollPeriodListResponse,
  CreatePayrollPeriodRequest,
  CreatePayrollPeriodResponse,
  GeneratePayrollRequest,
  GeneratePayrollResponse,
} from './types/payroll-period.types'

export type {
  PayrollPeriodListResponse,
  CreatePayrollPeriodRequest,
  CreatePayrollPeriodResponse,
  GeneratePayrollRequest,
  GeneratePayrollResponse,
}

export class PayrollPeriodService {
  async getPayrollPeriods(): Promise<PayrollPeriodListResponse> {
    const response = await apiClient.getClient().get('/hrm/payroll-periods')
    return response.data
  }

  async createPayrollPeriod(data: CreatePayrollPeriodRequest): Promise<CreatePayrollPeriodResponse> {
    const response = await apiClient.getClient().post('/hrm/payroll-periods', data)
    return response.data
  }

  async generatePayroll(data: GeneratePayrollRequest): Promise<GeneratePayrollResponse> {
    const response = await apiClient.getClient().post('/hrm/payroll-periods/generate', data)
    return response.data
  }
}

export const payrollPeriodService = new PayrollPeriodService()
