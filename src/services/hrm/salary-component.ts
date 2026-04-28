import { apiClient } from '../api/ApiClient'
import type {
  SalaryComponentListResponse,
  CreateSalaryComponentRequest,
  CreateSalaryComponentResponse,
} from './types/salary-component.types'

export type {
  SalaryComponentListResponse,
  CreateSalaryComponentRequest,
  CreateSalaryComponentResponse,
}

export class SalaryComponentService {
  async getSalaryComponents(): Promise<SalaryComponentListResponse> {
    const response = await apiClient.getClient().get('/hrm/salary-components')
    return response.data
  }

  async createSalaryComponent(data: CreateSalaryComponentRequest): Promise<CreateSalaryComponentResponse> {
    const response = await apiClient.getClient().post('/hrm/salary-components', data)
    return response.data
  }
}

export const salaryComponentService = new SalaryComponentService()
