import { apiClient } from '@/services/api/ApiClient'

export const inventoryRepository = {
  getDashboard() {
    return apiClient.getClient().get('/inventory/dashboard')
  },

  getWarehouses() {
    return apiClient.getClient().get('/inventory/warehouses')
  },

  createWarehouse(data: any) {
    return apiClient.getClient().post('/inventory/warehouses', data)
  },

  updateWarehouse(uuid: string, data: any) {
    return apiClient.getClient().put(`/inventory/warehouses/${uuid}`, data)
  },

  getProducts(params?: any) {
    return apiClient.getClient().get('/inventory/products', { params })
  },

  getCategories() {
    return apiClient.getClient().get('/inventory/categories')
  },

  createProduct(data: any) {
    return apiClient.getClient().post('/inventory/products', data)
  },

  updateProduct(uuid: string, data: any) {
    return apiClient.getClient().put(`/inventory/products/${uuid}`, data)
  },

  getMovements(params?: any) {
    return apiClient.getClient().get('/inventory/movements', { params })
  },

  recordMovement(data: any) {
    return apiClient.getClient().post('/inventory/movements', data)
  },

  getTransfers(params?: any) {
    return apiClient.getClient().get('/inventory/transfers', { params })
  },

  createTransfer(data: any) {
    return apiClient.getClient().post('/inventory/transfers', data)
  },

  updateTransferStatus(uuid: string, status: string) {
    return apiClient.getClient().put(`/inventory/transfers/${uuid}/status`, { status })
  }
}
