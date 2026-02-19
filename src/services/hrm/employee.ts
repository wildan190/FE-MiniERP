import { apiClient } from '../api/ApiClient'
import type {
  EmployeeListResponse,
  CreateEmployeeRequest,
  CreateEmployeeResponse,
  UpdateEmployeeRequest,
  UpdateEmployeeResponse,
  EmployeeDetailResponse,
} from './types/employee.types'

export class EmployeeService {
  async getEmployees(page: number = 1): Promise<EmployeeListResponse> {
    const response = await apiClient.getClient().get('/hrm/employees', {
      params: { page },
    })
    return response.data
  }

  async getEmployeeDetail(uuid: string): Promise<EmployeeDetailResponse> {
    const response = await apiClient.getClient().get(`/hrm/employees/${uuid}`)
    return response.data
  }

  async createEmployee(data: CreateEmployeeRequest): Promise<CreateEmployeeResponse> {
    const response = await apiClient.getClient().post('/hrm/employees', data)
    return response.data
  }

  async updateEmployee(uuid: string, data: UpdateEmployeeRequest): Promise<UpdateEmployeeResponse> {
    const response = await apiClient.getClient().put(`/hrm/employees/${uuid}`, data)
    return response.data
  }
}

export const employeeService = new EmployeeService()