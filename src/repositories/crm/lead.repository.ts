import { leadService, type LeadsListResponse, type CreateLeadRequest, type CreateLeadResponse, type Lead, type ConvertLeadResponse } from '@/services'

export class LeadRepository {
  async getLeads(page: number = 1): Promise<LeadsListResponse> {
    return await leadService.getLeads(page)
  }

  async getLeadByUuid(uuid: string): Promise<Lead> {
    return await leadService.getLeadByUuid(uuid)
  }

  async createLead(data: CreateLeadRequest): Promise<CreateLeadResponse> {
    return await leadService.createLead(data)
  }

  async updateLead(uuid: string, data: CreateLeadRequest): Promise<CreateLeadResponse> {
    return await leadService.updateLead(uuid, data)
  }

  async deleteLead(uuid: string): Promise<{ message: string }> {
    return await leadService.deleteLead(uuid)
  }

  async convertToProspect(uuid: string): Promise<ConvertLeadResponse> {
    return await leadService.convertLeadToProspect(uuid)
  }
}

export const leadRepository = new LeadRepository()
