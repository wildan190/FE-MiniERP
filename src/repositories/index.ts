import { authService, dashboardService, customerService, leadService, prospectService, salesPipelineService, quotationService, type LoginResponse, type DashboardResponse, type CRMDashboardResponse, type CustomersListResponse, type CreateCustomerRequest, type CreateCustomerResponse, type LeadsListResponse, type CreateLeadRequest, type CreateLeadResponse, type ProspectsListResponse, type CreateProspectRequest, type CreateProspectResponse, type UpdateProspectStatusRequest, type UpdateProspectStatusResponse, type SalesPipelineListResponse, type CreateSalesPipelineRequest, type CreateSalesPipelineResponse, type QuotationListResponse, type CreateQuotationRequest, type CreateQuotationResponse } from '@/services'

export class AuthRepository {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await authService.login(email, password)
    if (response.token) {
      authService.setToken(response.token)
    }
    return response
  }

  async logout(): Promise<void> {
    await authService.logout()
    authService.removeToken()
  }

  getToken(): string | null {
    return authService.getToken()
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }
}

export class DashboardRepository {
  async getDashboard(): Promise<DashboardResponse> {
    return await dashboardService.getDashboard()
  }

  async getCRMDashboard(): Promise<CRMDashboardResponse> {
    return await dashboardService.getCRMDashboard()
  }
}

export class CustomerRepository {
  async getCustomers(page: number = 1): Promise<CustomersListResponse> {
    return await customerService.getCustomers(page)
  }

  async createCustomer(data: CreateCustomerRequest): Promise<CreateCustomerResponse> {
    return await customerService.createCustomer(data)
  }
}

export class LeadRepository {
  async getLeads(page: number = 1): Promise<LeadsListResponse> {
    return await leadService.getLeads(page)
  }

  async createLead(data: CreateLeadRequest): Promise<CreateLeadResponse> {
    return await leadService.createLead(data)
  }
}

export class ProspectRepository {
  async getProspects(page: number = 1): Promise<ProspectsListResponse> {
    return await prospectService.getProspects(page)
  }

  async createProspect(data: CreateProspectRequest): Promise<CreateProspectResponse> {
    return await prospectService.createProspect(data)
  }

  async updateProspectStatus(id: number, data: UpdateProspectStatusRequest): Promise<UpdateProspectStatusResponse> {
    return await prospectService.updateProspectStatus(id, data)
  }
}

export class SalesPipelineRepository {
  async getSalesPipelines(page: number = 1): Promise<SalesPipelineListResponse> {
    return await salesPipelineService.getSalesPipelines(page)
  }

  async createSalesPipeline(data: CreateSalesPipelineRequest): Promise<CreateSalesPipelineResponse> {
    return await salesPipelineService.createSalesPipeline(data)
  }
}

export class QuotationRepository {
  async getQuotations(page: number = 1): Promise<QuotationListResponse> {
    return await quotationService.getQuotations(page)
  }

  async createQuotation(data: CreateQuotationRequest): Promise<CreateQuotationResponse> {
    return await quotationService.createQuotation(data)
  }
}

export const authRepository = new AuthRepository()
export const dashboardRepository = new DashboardRepository()
export const customerRepository = new CustomerRepository()
export const leadRepository = new LeadRepository()
export const prospectRepository = new ProspectRepository()
export const salesPipelineRepository = new SalesPipelineRepository()
export const quotationRepository = new QuotationRepository()
