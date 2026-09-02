import { defineStore } from 'pinia'
import { ref } from 'vue'
import { arRepository } from '@/repositories/finance/ar.repository'

export const useArStore = defineStore('ar', () => {
  const dashboard = ref<any>(null)
  const customers = ref<any[]>([])
  const invoices = ref<any[]>([])
  const invoicesPagination = ref<any>(null)
  const currentInvoice = ref<any>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchDashboard() {
    isLoading.value = true
    try {
      const res = await arRepository.getDashboard()
      dashboard.value = res.data.data
    } catch (e: any) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  async function fetchCustomers() {
    try {
      const res = await arRepository.getCustomers()
      customers.value = res.data.data || []
    } catch (e: any) {
      error.value = e.message
    }
  }

  async function fetchInvoices(params: any = {}) {
    isLoading.value = true
    try {
      const res = await arRepository.getInvoices(params)
      invoices.value = res.data.data.data || res.data.data || []
      invoicesPagination.value = {
        current_page: res.data.data.current_page,
        last_page: res.data.data.last_page,
        total: res.data.data.total,
        from: res.data.data.from,
        to: res.data.data.to,
        per_page: res.data.data.per_page,
      }
    } catch (e: any) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  async function fetchInvoice(uuid: string) {
    isLoading.value = true
    try {
      const res = await arRepository.getInvoice(uuid)
      currentInvoice.value = res.data.data
      return currentInvoice.value
    } catch (e: any) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  async function createInvoice(data: any) {
    const res = await arRepository.createInvoice(data)
    await fetchInvoices()
    await fetchDashboard()
    return res.data.data
  }

  async function sendInvoice(uuid: string) {
    const res = await arRepository.sendInvoice(uuid)
    if (currentInvoice.value?.uuid === uuid) {
      currentInvoice.value = res.data.data
    }
    await fetchInvoices()
    await fetchDashboard()
    return res.data.data
  }

  async function cancelInvoice(uuid: string, reason: string) {
    const res = await arRepository.cancelInvoice(uuid, reason)
    await fetchInvoices()
    await fetchDashboard()
    return res.data.data
  }

  async function recordPayment(invoiceUuid: string, data: any) {
    const res = await arRepository.recordPayment(invoiceUuid, data)
    await fetchInvoices()
    await fetchDashboard()
    if (currentInvoice.value?.uuid === invoiceUuid) {
      await fetchInvoice(invoiceUuid)
    }
    return res.data.data
  }

  return {
    dashboard,
    customers,
    invoices,
    invoicesPagination,
    currentInvoice,
    isLoading,
    error,
    fetchDashboard,
    fetchCustomers,
    fetchInvoices,
    fetchInvoice,
    createInvoice,
    sendInvoice,
    cancelInvoice,
    recordPayment,
  }
})
