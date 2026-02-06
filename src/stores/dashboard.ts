import { defineStore } from 'pinia'
import { ref } from 'vue'
import { dashboardRepository } from '@/repositories'
import type { DashboardResponse, CRMDashboardResponse } from '@/services'

export const useDashboardStore = defineStore('dashboard', () => {
  const dashboardData = ref<DashboardResponse | null>(null)
  const crmDashboardData = ref<CRMDashboardResponse | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchDashboard() {
    isLoading.value = true
    error.value = null

    try {
      const data = await dashboardRepository.getDashboard()
      dashboardData.value = data
      return data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch dashboard'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function fetchCRMDashboard() {
    isLoading.value = true
    error.value = null

    try {
      const data = await dashboardRepository.getCRMDashboard()
      crmDashboardData.value = data
      return data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch CRM dashboard'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    dashboardData,
    crmDashboardData,
    isLoading,
    error,
    fetchDashboard,
    fetchCRMDashboard,
    clearError,
  }
})
