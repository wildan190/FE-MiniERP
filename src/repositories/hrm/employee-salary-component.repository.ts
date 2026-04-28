import {
  employeeSalaryComponentService,
  type EmployeeSalaryComponentListResponse,
  type EmployeeSalaryComponentResponse,
  type AssignSalaryComponentRequest,
  type UpdateSalaryComponentRequest,
} from '../../services/hrm/employee-salary-component'

export class EmployeeSalaryComponentRepository {
  async getEmployeeSalaryComponents(employeeUuid: string): Promise<EmployeeSalaryComponentListResponse> {
    return await employeeSalaryComponentService.getEmployeeSalaryComponents(employeeUuid)
  }

  async assignSalaryComponent(
    employeeUuid: string,
    data: AssignSalaryComponentRequest
  ): Promise<EmployeeSalaryComponentResponse> {
    return await employeeSalaryComponentService.assignSalaryComponent(employeeUuid, data)
  }

  async updateSalaryComponent(
    employeeUuid: string,
    componentUuid: string,
    data: UpdateSalaryComponentRequest
  ): Promise<EmployeeSalaryComponentResponse> {
    return await employeeSalaryComponentService.updateSalaryComponent(employeeUuid, componentUuid, data)
  }

  async removeSalaryComponent(employeeUuid: string, componentUuid: string): Promise<void> {
    return await employeeSalaryComponentService.removeSalaryComponent(employeeUuid, componentUuid)
  }
}

export const employeeSalaryComponentRepository = new EmployeeSalaryComponentRepository()
