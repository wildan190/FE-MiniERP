import { apiClient } from '@/services/api/ApiClient'

export const purchasingRepository = {
  getDashboard() {
    return apiClient.getClient().get('/purchasing/dashboard')
  },

  getSuppliers() {
    return apiClient.getClient().get('/purchasing/suppliers')
  },

  createSupplier(data: any) {
    return apiClient.getClient().post('/purchasing/suppliers', data)
  },

  getRequests() {
    return apiClient.getClient().get('/purchasing/requests')
  },

  createRequest(data: any) {
    return apiClient.getClient().post('/purchasing/requests', data)
  },

  getOrders() {
    return apiClient.getClient().get('/purchasing/orders')
  },

  createOrder(data: any) {
    return apiClient.getClient().post('/purchasing/orders', data)
  },

  updateRequestStatus(uuid: string, status: string) {
    return apiClient.getClient().patch(`/purchasing/requests/${uuid}/status`, { status })
  },

  updateOrderStatus(uuid: string, status: string) {
    return apiClient.getClient().patch(`/purchasing/orders/${uuid}/status`, { status })
  },

  getReceipts() {
    return apiClient.getClient().get('/purchasing/goods-receipts')
  },

  createReceipt(data: any) {
    return apiClient.getClient().post('/purchasing/goods-receipts', data)
  },

  getInvoices() {
    return apiClient.getClient().get('/purchasing/invoices')
  },

  createInvoice(data: any) {
    return apiClient.getClient().post('/purchasing/invoices', data)
  }
}
