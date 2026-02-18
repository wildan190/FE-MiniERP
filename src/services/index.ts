// Barrel export from modular structure for backward compatibility
export * from './types'
export * from './auth'
export * from './dashboard'
export * from './crm'

// Re-export service instances for convenience
export { authService } from './auth'
export { dashboardService } from './dashboard'
export {
  customerService,
  leadService,
  prospectService,
  salesPipelineService,
  quotationService,
  orderService,
  interactionService,
  crmServiceInstance,
} from './crm'
export * from './hrm'
