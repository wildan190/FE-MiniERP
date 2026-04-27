export interface PayrollPeriod {
  id: number
  name: string
  start_date: string
  end_date: string
  status: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  uuid: string
}

export interface PayrollPeriodListResponse {
  message: string
  data: PayrollPeriod[]
}

export interface CreatePayrollPeriodRequest {
  name: string
  start_date: string
  end_date: string
}

export interface CreatePayrollPeriodResponse {
  message: string
  data: PayrollPeriod
}

export interface GeneratePayrollRequest {
  payroll_period_uuid: string
}

export interface GeneratePayrollResponse {
  message: string
}
