import { defineStore } from 'pinia'
import { ref } from 'vue'
import { purchasingRepository } from '@/repositories/purchasing/purchasing.repository'

export const usePurchasingStore = defineStore('purchasing', () => {
  const suppliers = ref<any[]>([])
  const requests = ref<any[]>([])
  const orders = ref<any[]>([])
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

  return {
    suppliers,
    requests,
    orders,
    invoices,
    dashboardData,
    isLoading,
    error,
    fetchDashboard,
    fetchSuppliers,
    createSupplier,
    fetchRequests,
    createRequest,
    fetchOrders,
    createOrder
  }
})
