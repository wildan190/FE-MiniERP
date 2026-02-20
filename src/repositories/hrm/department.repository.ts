import {
  departmentService,
  type DepartmentListResponse,
  type CreateDepartmentRequest,
  type CreateDepartmentResponse,
} from '../../services/hrm'

export class DepartmentRepository {
  async getDepartments(page: number = 1): Promise<DepartmentListResponse> {
    return await departmentService.getDepartments(page)
  }

  async getDepartmentDetail(uuid: string): Promise<CreateDepartmentResponse> {
    return await departmentService.getDepartmentDetail(uuid)
  }

  async createDepartment(data: CreateDepartmentRequest): Promise<CreateDepartmentResponse> {
    return await departmentService.createDepartment(data)
  }

  async updateDepartment(
    uuid: string,
    data: CreateDepartmentRequest
  ): Promise<CreateDepartmentResponse> {
    return await departmentService.updateDepartment(uuid, data)
  }

  async deleteDepartment(uuid: string): Promise<{ message: string }> {
    return await departmentService.deleteDepartment(uuid)
  }
}

export const departmentRepository = new DepartmentRepository()
