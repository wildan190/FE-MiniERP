export interface TurnoverPeriod {
  start: string
  end: string
}

export interface TurnoverStatistics {
  period: TurnoverPeriod
  joined: number
  resigned: number
  terminated: number
  total_leavers: number
  net_change: number
}

export interface TurnoverResponse {
  message: string
  data: TurnoverStatistics
}

export interface MonthlyCost {
  month: number
  month_name: string
  total_cost: number
  employee_count: number
}

export interface DepartmentCost {
  department_id: number
  department_name: string
  total_cost: number
  employee_count: number
}

export interface LaborCostStatistics {
  year: string
  monthly_costs: MonthlyCost[]
  department_costs: DepartmentCost[]
  total_year_cost: number
}

export interface LaborCostResponse {
  message: string
  data: LaborCostStatistics
}
