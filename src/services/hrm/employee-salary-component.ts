import { apiClient } from '../api/ApiClient'
import type {
  EmployeeSalaryComponentListResponse,
  EmployeeSalaryComponentResponse,
  AssignSalaryComponentRequest,
  UpdateSalaryComponentRequest,
} from './types/employee-salary-component.types'

export type {
  EmployeeSalaryComponentListResponse,
  EmployeeSalaryComponentResponse,
  AssignSalaryComponentRequest,
  UpdateSalaryComponentRequest,
}

export class EmployeeSalaryComponentService {
  async getEmployeeSalaryComponents(employeeUuid: string): Promise<EmployeeSalaryComponentListResponse> {
    const response = await apiClient.getClient().get(`/hrm/employees/${employeeUuid}/salary-components`)
    return response.data
  }

  async assignSalaryComponent(
    employeeUuid: string,
    data: AssignSalaryComponentRequest
  ): Promise<EmployeeSalaryComponentResponse> {
    const response = await apiClient.getClient().post(`/hrm/employees/${employeeUuid}/salary-components`, data)
    return response.data
  }

  async updateSalaryComponent(
    employeeUuid: string,
    componentUuid: string,
    data: UpdateSalaryComponentRequest
  ): Promise<EmployeeSalaryComponentResponse> {
    const response = await apiClient.getClient().put(
      `/hrm/employees/${employeeUuid}/salary-components/${componentUuid}`,
      data
    )
    return response.data
  }

  async removeSalaryComponent(employeeUuid: string, componentUuid: string): Promise<void> {
    await apiClient.getClient().delete(`/hrm/employees/${employeeUuid}/salary-components/${componentUuid}`)
  }
}

export const employeeSalaryComponentService = new EmployeeSalaryComponentService()
