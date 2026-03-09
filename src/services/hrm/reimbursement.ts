import apiClient from '../api'
import type { 
  ReimbursementFilters, 
  ReimbursementListResponse, 
  ReimbursementResponse, 
  CreateReimbursementRequest,
  UpdateReimbursementStatusRequest
} from './types/reimbursement.types'

export class ReimbursementService {
  static async getReimbursements(filters: ReimbursementFilters = {}): Promise<ReimbursementListResponse> {
    return apiClient.get('/platform/hrm/reimbursements', { params: filters })
  }

  static async getMyClaims(filters: ReimbursementFilters = {}): Promise<ReimbursementListResponse> {
    return apiClient.get('/platform/hrm/reimbursements/my-claims', { params: filters })
  }

  static async submitClaim(data: CreateReimbursementRequest): Promise<ReimbursementResponse> {
    const formData = new FormData()
    formData.append('type', data.type)
    formData.append('amount', data.amount.toString())
    if (data.description) formData.append('description', data.description)
    if (data.proof_file) formData.append('proof_file', data.proof_file)

    return apiClient.post('/platform/hrm/reimbursements', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }

  static async updateStatus(uuid: string, data: UpdateReimbursementStatusRequest): Promise<ReimbursementResponse> {
    return apiClient.put(`/platform/hrm/reimbursements/${uuid}/status`, data)
  }

  static async markAsPaid(uuid: string): Promise<ReimbursementResponse> {
    return apiClient.put(`/platform/hrm/reimbursements/${uuid}/status`, { status: 'paid' })
  }

  static async getDetail(uuid: string): Promise<ReimbursementResponse> {
    return apiClient.get(`/platform/hrm/reimbursements/${uuid}`)
  }
}
