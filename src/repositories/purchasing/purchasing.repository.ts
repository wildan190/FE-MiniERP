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

  getInvoices() {
    return apiClient.getClient().get('/purchasing/invoices')
  }
}
