import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apRepository } from '@/repositories/finance/ap.repository'

export const useApStore = defineStore('ap', () => {
  const dashboard = ref<any>(null)
  const vendors = ref<any[]>([])
  const bills = ref<any[]>([])
  const billsMeta = ref<any>(null)
  const currentBill = ref<any>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchDashboard() {
    isLoading.value = true
    try {
      const res = await apRepository.getDashboard()
      dashboard.value = res.data.data
    } catch (e: any) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  async function fetchVendors(params?: any) {
    const res = await apRepository.getVendors(params)
    vendors.value = res.data.data || []
  }

  async function createVendor(data: any) {
    const res = await apRepository.createVendor(data)
    await fetchVendors()
    return res.data.data
  }

  async function fetchBills(params?: any) {
    isLoading.value = true
    try {
      const res = await apRepository.getBills(params)
      bills.value = res.data.data?.data || res.data.data || []
      billsMeta.value = res.data.data?.meta || null
    } catch (e: any) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  async function createBill(data: any) {
    const res = await apRepository.createBill(data)
    return res.data.data
  }

  async function fetchBill(uuid: string) {
    const res = await apRepository.getBill(uuid)
    currentBill.value = res.data.data
    return currentBill.value
  }

  async function approveBill(uuid: string) {
    const res = await apRepository.approveBill(uuid)
    if (currentBill.value?.uuid === uuid) currentBill.value = res.data.data
    return res.data.data
  }

  async function payBill(uuid: string, paymentData: any) {
    const res = await apRepository.payBill(uuid, paymentData)
    await fetchBill(uuid)
    return res.data.data
  }

  async function reconcile(paymentUuid: string) {
    const res = await apRepository.reconcilePayment(paymentUuid)
    return res.data.data
  }

  return {
    dashboard, vendors, bills, billsMeta, currentBill,
    isLoading, error,
    fetchDashboard, fetchVendors, createVendor,
    fetchBills, createBill, fetchBill,
    approveBill, payBill, reconcile,
  }
})
