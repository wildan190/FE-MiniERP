import { ReimbursementService } from '../../services/hrm/reimbursement'
import type { 
  ReimbursementFilters, 
  CreateReimbursementRequest,
  UpdateReimbursementStatusRequest
} from '../../services/hrm/types/reimbursement.types'

export const reimbursementRepository = {
  getReimbursements(filters: ReimbursementFilters = {}) {
    return ReimbursementService.getReimbursements(filters)
  },

  getMyClaims(filters: ReimbursementFilters = {}) {
    return ReimbursementService.getMyClaims(filters)
  },

  submitClaim(data: CreateReimbursementRequest) {
    return ReimbursementService.submitClaim(data)
  },

  updateStatus(uuid: string, data: UpdateReimbursementStatusRequest) {
    return ReimbursementService.updateStatus(uuid, data)
  },

  markAsPaid(uuid: string) {
    return ReimbursementService.markAsPaid(uuid)
  },

  getDetail(uuid: string) {
    return ReimbursementService.getDetail(uuid)
  }
}
