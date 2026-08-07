import { apiClient } from '@/services/api/ApiClient'

export const apRepository = {
  getDashboard() {
    return apiClient.getClient().get('/finance/ap/dashboard')
  },

  getIrisBalance() {
    return apiClient.getClient().get('/finance/ap/iris/balance')
  },

  // Vendors
  getVendors(params?: { search?: string }) {
    return apiClient.getClient().get('/finance/ap/vendors', { params })
  },

  createVendor(data: any) {
    return apiClient.getClient().post('/finance/ap/vendors', data)
  },

  // Bills
  getBills(params?: { status?: string; vendor_uuid?: string; per_page?: number; page?: number }) {
    return apiClient.getClient().get('/finance/ap/bills', { params })
  },

  createBill(data: any) {
    return apiClient.getClient().post('/finance/ap/bills', data)
  },

  getBill(uuid: string) {
    return apiClient.getClient().get(`/finance/ap/bills/${uuid}`)
  },

  approveBill(uuid: string) {
    return apiClient.getClient().post(`/finance/ap/bills/${uuid}/approve`)
  },

  payBill(uuid: string, data: { amount: number; payment_method?: string; notes?: string }) {
    return apiClient.getClient().post(`/finance/ap/bills/${uuid}/pay`, data)
  },

  // Payments
  reconcilePayment(paymentUuid: string) {
    return apiClient.getClient().post(`/finance/ap/payments/${paymentUuid}/reconcile`)
  }
}
