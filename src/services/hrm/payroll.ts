import { apiClient } from '../api/ApiClient'
import type {
  PayrollListResponse,
  PayrollDetailResponse,
  PayPayrollResponse,
} from './types/payroll.types'

export type {
  PayrollListResponse,
  PayrollDetailResponse,
  PayPayrollResponse,
}

export class PayrollService {
  async getPayrolls(params: {
    page?: number
    payroll_period_uuid?: string
    employee_uuid?: string
    status?: string
  }): Promise<PayrollListResponse> {
    const response = await apiClient.getClient().get('/hrm/payrolls', { params })
    return response.data
  }

  async getPayrollDetail(uuid: string): Promise<PayrollDetailResponse> {
    const response = await apiClient.getClient().get(`/hrm/payrolls/${uuid}`)
    return response.data
  }

  async markAsPaid(uuid: string): Promise<PayPayrollResponse> {
    const response = await apiClient.getClient().post(`/hrm/payrolls/${uuid}/pay`)
    return response.data
  }

  async batchPay(uuids: string[]): Promise<{ message: string }> {
    const response = await apiClient.getClient().post('/hrm/payrolls/batch-pay', {
      payroll_uuids: uuids,
    })
    return response.data
  }

  getPayslipUrl(uuid: string): string {
    return `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/platform/hrm/payrolls/${uuid}/payslip`
  }
}

export const payrollService = new PayrollService()
