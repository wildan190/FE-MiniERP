import {
  salaryComponentService,
  type SalaryComponentListResponse,
  type CreateSalaryComponentRequest,
  type CreateSalaryComponentResponse,
} from '../../services/hrm/salary-component'

export class SalaryComponentRepository {
  async getSalaryComponents(): Promise<SalaryComponentListResponse> {
    return await salaryComponentService.getSalaryComponents()
  }

  async createSalaryComponent(data: CreateSalaryComponentRequest): Promise<CreateSalaryComponentResponse> {
    return await salaryComponentService.createSalaryComponent(data)
  }
}

export const salaryComponentRepository = new SalaryComponentRepository()
