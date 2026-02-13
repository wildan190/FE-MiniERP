import { prospectService, type ProspectsListResponse, type CreateProspectRequest, type CreateProspectResponse, type UpdateProspectStatusRequest, type UpdateProspectStatusResponse } from '@/services'

export class ProspectRepository {
  async getProspects(page: number = 1): Promise<ProspectsListResponse> {
    return await prospectService.getProspects(page)
  }

  async createProspect(data: CreateProspectRequest): Promise<CreateProspectResponse> {
    return await prospectService.createProspect(data)
  }

  async updateProspectStatus(uuid: string, data: UpdateProspectStatusRequest): Promise<UpdateProspectStatusResponse> {
    return await prospectService.updateProspectStatus(uuid, data)
  }
}

export const prospectRepository = new ProspectRepository()
