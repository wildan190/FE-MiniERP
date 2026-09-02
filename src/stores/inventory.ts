import { defineStore } from 'pinia'
import { ref } from 'vue'
import { inventoryRepository } from '@/repositories/inventory/inventory.repository'

export const useInventoryStore = defineStore('inventory', () => {
  const dashboardData = ref<any>(null)
  const warehouses = ref<any[]>([])
  const products = ref<any[]>([])
  const productsMeta = ref<any>(null)
  const categories = ref<any[]>([])
  const movements = ref<any[]>([])
  const movementsMeta = ref<any>(null)
  const transfers = ref<any[]>([])
  const transfersMeta = ref<any>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchDashboard() {
    isLoading.value = true
    try {
      const res = await inventoryRepository.getDashboard()
      dashboardData.value = res.data.data
    } catch (e: any) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  async function fetchWarehouses() {
    isLoading.value = true
    try {
      const res = await inventoryRepository.getWarehouses()
      warehouses.value = res.data.data || []
    } catch (e: any) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  async function createWarehouse(data: any) {
    const res = await inventoryRepository.createWarehouse(data)
    await fetchWarehouses()
    return res.data
  }

  async function fetchProducts(params?: any) {
    isLoading.value = true
    try {
      const res = await inventoryRepository.getProducts(params)
      const resData = res.data.data
      if (Array.isArray(resData)) {
        products.value = resData
        productsMeta.value = null
      } else {
        products.value = resData?.data || []
        productsMeta.value = resData
      }
    } catch (e: any) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  async function fetchCategories() {
    const res = await inventoryRepository.getCategories()
    categories.value = res.data.data || []
  }

  async function createProduct(data: any) {
    const res = await inventoryRepository.createProduct(data)
    await fetchProducts()
    return res.data
  }

  async function updateProduct(uuid: string, data: any) {
    const res = await inventoryRepository.updateProduct(uuid, data)
    await fetchProducts()
    return res.data
  }

  async function fetchMovements(params?: any) {
    isLoading.value = true
    try {
      const res = await inventoryRepository.getMovements(params)
      const resData = res.data.data
      if (Array.isArray(resData)) {
        movements.value = resData
        movementsMeta.value = null
      } else {
        movements.value = resData?.data || []
        movementsMeta.value = resData
      }
    } catch (e: any) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  async function recordMovement(data: any) {
    const res = await inventoryRepository.recordMovement(data)
    await fetchMovements()
    await fetchDashboard()
    return res.data
  }

  async function fetchTransfers(params?: any) {
    isLoading.value = true
    try {
      const res = await inventoryRepository.getTransfers(params)
      const resData = res.data.data
      if (Array.isArray(resData)) {
        transfers.value = resData
        transfersMeta.value = null
      } else {
        transfers.value = resData?.data || []
        transfersMeta.value = resData
      }
    } catch (e: any) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  async function createTransfer(data: any) {
    const res = await inventoryRepository.createTransfer(data)
    await fetchTransfers()
    return res.data
  }

  async function updateTransferStatus(uuid: string, status: string) {
    const res = await inventoryRepository.updateTransferStatus(uuid, status)
    await fetchTransfers()
    await fetchDashboard()
    return res.data
  }

  return {
    dashboardData,
    warehouses,
    products,
    productsMeta,
    categories,
    movements,
    movementsMeta,
    transfers,
    transfersMeta,
    isLoading,
    error,
    fetchDashboard,
    fetchWarehouses,
    createWarehouse,
    fetchProducts,
    fetchCategories,
    createProduct,
    updateProduct,
    fetchMovements,
    recordMovement,
    fetchTransfers,
    createTransfer,
    updateTransferStatus,
  }
})
