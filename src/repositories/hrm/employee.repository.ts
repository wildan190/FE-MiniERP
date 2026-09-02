import {
  employeeService,
  type EmployeeListResponse,
  type CreateEmployeeRequest,
  type CreateEmployeeResponse,
  type UpdateEmployeeRequest,
  type UpdateEmployeeResponse,
  type EmployeeDetailResponse,
  type EnrollFaceResponse,
  type EmployeeDocumentListResponse,
  type CreateEmployeeDocumentResponse,
} from '../../services/hrm'

export class EmployeeRepository {
  async getEmployees(page: number = 1, search: string = ''): Promise<EmployeeListResponse> {
    return await employeeService.getEmployees(page, search)
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

  async getEmployeeDocuments(employeeUuid: string): Promise<EmployeeDocumentListResponse> {
    return await employeeService.getEmployeeDocuments(employeeUuid)
  }

  async createEmployeeDocument(employeeUuid: string, data: FormData): Promise<CreateEmployeeDocumentResponse> {
    return await employeeService.createEmployeeDocument(employeeUuid, data)
  }

  async deleteEmployeeDocument(documentUuid: string): Promise<{ message: string }> {
    return await employeeService.deleteEmployeeDocument(documentUuid)
  }

  async getMyProfile(): Promise<EmployeeDetailResponse> {
    return await employeeService.getMyProfile()
  }

  async enrollMyFace(data: FormData | File): Promise<EnrollFaceResponse> {
    return await employeeService.enrollMyFace(data)
  }

  async enrollFace(uuid: string, data: FormData | File): Promise<EnrollFaceResponse> {
    return await employeeService.enrollFace(uuid, data)
  }
}

export const employeeRepository = new EmployeeRepository()