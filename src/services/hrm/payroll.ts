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
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api/platform';
    return `${baseUrl}/hrm/payrolls/${uuid}/payslip`
  }

  async downloadPayslip(uuid: string, filename: string = 'payslip.pdf'): Promise<void> {
    const response = await apiClient.getClient().get(`/hrm/payrolls/${uuid}/payslip`, {
      responseType: 'blob',
      headers: {
        'Accept': 'application/json'
      }
    })

    
    // Create blob link to download
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    
    // Clean up
    link.parentNode?.removeChild(link)
    window.URL.revokeObjectURL(url)
  }
}



export const payrollService = new PayrollService()
