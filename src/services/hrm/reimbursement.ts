import { apiClient } from '../api/ApiClient'
import type { 
  ReimbursementFilters, 
  ReimbursementListResponse, 
  ReimbursementResponse, 
  CreateReimbursementRequest,
  UpdateReimbursementStatusRequest
} from './types/reimbursement.types'

export class ReimbursementService {
  static async getReimbursements(filters: ReimbursementFilters = {}): Promise<ReimbursementListResponse> {
    const response = await apiClient.getClient().get('/hrm/reimbursements', { params: filters })
    return response.data
  }

  static async getMyClaims(filters: ReimbursementFilters = {}): Promise<ReimbursementListResponse> {
    const response = await apiClient.getClient().get('/hrm/reimbursements/my-claims', { params: filters })
    return response.data
  }

  static async submitClaim(data: CreateReimbursementRequest): Promise<ReimbursementResponse> {
    const formData = new FormData()
    formData.append('type', data.type)
    formData.append('amount', data.amount.toString())
    if (data.description) formData.append('description', data.description)
    if (data.proof_file) formData.append('proof_file', data.proof_file)

    const response = await apiClient.getClient().post('/hrm/reimbursements', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  }

  static async updateStatus(uuid: string, data: UpdateReimbursementStatusRequest): Promise<ReimbursementResponse> {
    const response = await apiClient.getClient().put(`/hrm/reimbursements/${uuid}/status`, data)
    return response.data
  }

  static async markAsPaid(uuid: string): Promise<ReimbursementResponse> {
    const response = await apiClient.getClient().put(`/hrm/reimbursements/${uuid}/status`, { status: 'paid' })
    return response.data
  }

  static async getDetail(uuid: string): Promise<ReimbursementResponse> {
    const response = await apiClient.getClient().get(`/hrm/reimbursements/${uuid}`)
    return response.data
  }
}
