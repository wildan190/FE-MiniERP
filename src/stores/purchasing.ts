import { defineStore } from 'pinia'
import { ref } from 'vue'
import { purchasingRepository } from '@/repositories/purchasing/purchasing.repository'

export const usePurchasingStore = defineStore('purchasing', () => {
  const suppliers = ref<any[]>([])
  const requests = ref<any[]>([])
  const orders = ref<any[]>([])
  const receipts = ref<any[]>([])
  const invoices = ref<any[]>([])
  const dashboardData = ref<any>(null)
  
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchDashboard() {
    isLoading.value = true
    try {
      const response = await purchasingRepository.getDashboard()
      dashboardData.value = response.data.data
    } catch (err: any) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  async function fetchSuppliers() {
    isLoading.value = true
    try {
      const response = await purchasingRepository.getSuppliers()
      const data = response.data?.data
      suppliers.value = Array.isArray(data) ? data : (data?.data || [])
    } catch (err: any) {
      error.value = err.message
      suppliers.value = []
    } finally {
      isLoading.value = false
    }
  }

  async function createSupplier(data: any) {
    isLoading.value = true
    try {
      await purchasingRepository.createSupplier(data)
      await fetchSuppliers()
    } catch (err: any) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  async function fetchRequests() {
    isLoading.value = true
    try {
      const response = await purchasingRepository.getRequests()
      requests.value = response.data.data.data || response.data.data
    } catch (err: any) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  async function createRequest(data: any) {
    isLoading.value = true
    try {
      await purchasingRepository.createRequest(data)
      await fetchRequests()
    } catch (err: any) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  async function fetchOrders() {
    isLoading.value = true
    try {
      const response = await purchasingRepository.getOrders()
      const data = response.data?.data
      orders.value = Array.isArray(data) ? data : (data?.data || [])
    } catch (err: any) {
      error.value = err.message
      orders.value = []
    } finally {
      isLoading.value = false
    }
  }

  async function createOrder(data: any) {
    isLoading.value = true
    try {
      await purchasingRepository.createOrder(data)
      await fetchOrders()
    } catch (err: any) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  async function fetchReceipts() {
    isLoading.value = true
    try {
      const response = await purchasingRepository.getReceipts()
      const data = response.data?.data
      receipts.value = Array.isArray(data) ? data : (data?.data || [])
    } catch (err: any) {
      error.value = err.message
      receipts.value = []
    } finally {
      isLoading.value = false
    }
  }

  async function createReceipt(data: any) {
    isLoading.value = true
    try {
      const response = await purchasingRepository.createReceipt(data)
      await fetchReceipts()
      await fetchOrders()
      return response.data
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function fetchInvoices() {
    isLoading.value = true
    try {
      const response = await purchasingRepository.getInvoices()
      const data = response.data?.data
      invoices.value = Array.isArray(data) ? data : (data?.data || [])
    } catch (err: any) {
      error.value = err.message
      invoices.value = []
    } finally {
      isLoading.value = false
    }
  }

  async function createInvoice(data: any) {
    isLoading.value = true
    try {
      const response = await purchasingRepository.createInvoice(data)
      await fetchInvoices()
      await fetchOrders()
      return response.data
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function updateRequestStatus(uuid: string, status: string) {
    isLoading.value = true
    try {
      await purchasingRepository.updateRequestStatus(uuid, status)
      await fetchRequests()
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function updateOrderStatus(uuid: string, status: string) {
    isLoading.value = true
    try {
      await purchasingRepository.updateOrderStatus(uuid, status)
      await fetchOrders()
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    suppliers,
    requests,
    orders,
    receipts,
    invoices,
    dashboardData,
    isLoading,
    error,
    fetchDashboard,
    fetchSuppliers,
    createSupplier,
    fetchRequests,
    createRequest,
    updateRequestStatus,
    fetchOrders,
    createOrder,
    updateOrderStatus,
    fetchReceipts,
    createReceipt,
    fetchInvoices,
    createInvoice
  }
})
