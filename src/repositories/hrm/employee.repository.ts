import {
  employeeService,
  type EmployeeListResponse,
  type CreateEmployeeRequest,
  type CreateEmployeeResponse,
  type UpdateEmployeeRequest,
  type UpdateEmployeeResponse,
  type EmployeeDetailResponse,
} from '../../services/hrm'

export class EmployeeRepository {
  async getEmployees(page: number = 1): Promise<EmployeeListResponse> {
    return await employeeService.getEmployees(page)
  }

  async getEmployeeDetail(uuid: string): Promise<EmployeeDetailResponse> {
    return await employeeService.getEmployeeDetail(uuid)
  }

  async createEmployee(data: CreateEmployeeRequest): Promise<CreateEmployeeResponse> {
    return await employeeService.createEmployee(data)
  }

  async updateEmployee(uuid: string, data: UpdateEmployeeRequest): Promise<UpdateEmployeeResponse> {
    return await employeeService.updateEmployee(uuid, data)
  }
}

export const employeeRepository = new EmployeeRepository()