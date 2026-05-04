import {
  payrollService,
  type PayrollListResponse,
  type PayrollDetailResponse,
  type PayPayrollResponse,
} from '../../services/hrm/payroll'

export class PayrollRepository {
  async getPayrolls(params: {
    page?: number
    payroll_period_uuid?: string
    employee_uuid?: string
    status?: string
  }): Promise<PayrollListResponse> {
    return await payrollService.getPayrolls(params)
  }

  async getPayrollDetail(uuid: string): Promise<PayrollDetailResponse> {
    return await payrollService.getPayrollDetail(uuid)
  }

  async markAsPaid(uuid: string): Promise<PayPayrollResponse> {
    return await payrollService.markAsPaid(uuid)
  }

  async batchPay(uuids: string[]): Promise<{ message: string }> {
    return await payrollService.batchPay(uuids)
  }

  getPayslipUrl(uuid: string): string {
    return payrollService.getPayslipUrl(uuid)
  }

  async downloadPayslip(uuid: string, filename?: string): Promise<void> {
    return await payrollService.downloadPayslip(uuid, filename)
  }
}


export const payrollRepository = new PayrollRepository()
