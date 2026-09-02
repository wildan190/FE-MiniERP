import { apiClient } from '@/services/api/ApiClient'

export const approvalRepository = {
  getChains() {
    return apiClient.getClient().get('/system/approvals/chains')
  },

  createChain(data: any) {
    return apiClient.getClient().post('/system/approvals/chains', data)
  },

  getPendingRequests() {
    return apiClient.getClient().get('/system/approvals/pending')
  },

  approveRequest(uuid: string, comments?: string) {
    return apiClient.getClient().post(`/system/approvals/${uuid}/approve`, { comments })
  },

  rejectRequest(uuid: string, reason: string) {
    return apiClient.getClient().post(`/system/approvals/${uuid}/reject`, { reason })
  }
}
