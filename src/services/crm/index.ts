// Export all CRM types
export * from './types'

// Import services
import { customerService } from './customer'
import { leadService } from './lead'
import { prospectService } from './prospect'
import { salesPipelineService } from './salesPipeline'
import { quotationService } from './quotation'
import { orderService } from './order'
import { interactionService } from './interaction'

// Export individual services
export { customerService, leadService, prospectService, salesPipelineService, quotationService, orderService, interactionService }

// CRM Service Wrapper - lightweight convenience wrapper for views
export const crmServiceInstance = {
  // Customer methods
  getCustomers: async (page = 1) => (await customerService.getCustomers(page)).data.data,
  getCustomerById: async (id: number) => await customerService.getCustomerById(id),
  createCustomer: async (data: any) => await customerService.createCustomer(data),

  // Lead methods
  getLeads: async (page = 1) => (await leadService.getLeads(page)).data.data,
  createLead: async (data: any) => await leadService.createLead(data),

  // Prospect methods
  getProspects: async (page = 1) => (await prospectService.getProspects(page)).data.data,
  createProspect: async (data: any) => await prospectService.createProspect(data),
  updateProspectStatus: async (id: number, data: any) => await prospectService.updateProspectStatus(id, data),

  // Quotation methods
  getQuotations: async (page = 1) => (await quotationService.getQuotations(page)).data.data,
  getCustomerQuotations: async (customerId: number) => await quotationService.getCustomerQuotations(customerId),
  createQuotation: async (data: any) => await quotationService.createQuotation(data),

  // Order methods
  getOrders: async (page = 1) => await orderService.getOrders(page),
  getCustomerOrders: async (customerId: number) => await orderService.getCustomerOrders(customerId),

  // SalesPipeline methods
  getSalesPipelines: async (page = 1) => (await salesPipelineService.getSalesPipelines(page)).data.data,
  createSalesPipeline: async (data: any) => await salesPipelineService.createSalesPipeline(data),

  // Interaction methods
  getCustomerInteractions: async (customerId: number) => await interactionService.getCustomerInteractions(customerId),
}
