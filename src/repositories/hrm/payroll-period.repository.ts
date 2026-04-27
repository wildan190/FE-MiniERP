import {
  payrollPeriodService,
  type PayrollPeriodListResponse,
  type CreatePayrollPeriodRequest,
  type CreatePayrollPeriodResponse,
  type GeneratePayrollRequest,
  type GeneratePayrollResponse,
} from '../../services/hrm/payroll-period'

export class PayrollPeriodRepository {
  async getPayrollPeriods(): Promise<PayrollPeriodListResponse> {
    return await payrollPeriodService.getPayrollPeriods()
  }

  async createPayrollPeriod(data: CreatePayrollPeriodRequest): Promise<CreatePayrollPeriodResponse> {
    return await payrollPeriodService.createPayrollPeriod(data)
  }

  async generatePayroll(data: GeneratePayrollRequest): Promise<GeneratePayrollResponse> {
    return await payrollPeriodService.generatePayroll(data)
  }
}

export const payrollPeriodRepository = new PayrollPeriodRepository()
