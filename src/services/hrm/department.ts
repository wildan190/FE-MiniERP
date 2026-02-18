import { apiClient } from '../api/ApiClient'
import type {
  DepartmentListResponse,
  CreateDepartmentRequest,
  CreateDepartmentResponse,
} from './types/department.types'

export class DepartmentService {
  async getDepartments(page: number = 1): Promise<DepartmentListResponse> {
    const response = await apiClient.getClient().get('/hrm/departments', {
      params: { page },
    })
    return response.data
  }

  async getDepartmentDetail(uuid: string): Promise<CreateDepartmentResponse> {
    const response = await apiClient.getClient().get(`/hrm/departments/${uuid}`)
    return response.data
  }

  async createDepartment(data: CreateDepartmentRequest): Promise<CreateDepartmentResponse> {
    const response = await apiClient.getClient().post('/hrm/departments', data)
    return response.data
  }

  async updateDepartment(
    uuid: string,
    data: CreateDepartmentRequest
  ): Promise<CreateDepartmentResponse> {
    const response = await apiClient.getClient().put(`/hrm/departments/${uuid}`, data)
    return response.data
  }

  async deleteDepartment(uuid: string): Promise<{ message: string }> {
    const response = await apiClient.getClient().delete(`/hrm/departments/${uuid}`)
    return response.data
  }
}

export const departmentService = new DepartmentService()
