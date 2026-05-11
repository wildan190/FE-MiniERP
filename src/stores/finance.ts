import { defineStore } from 'pinia'
import { ref } from 'vue'
import { financeService } from '@/services'

export const useFinanceStore = defineStore('finance', () => {
  const dashboardData = ref<any>(null)
  const accounts = ref<any[]>([])
  const ledgerItems = ref<any[]>([])
  const reports = ref<any>({
    profitLoss: null,
    balanceSheet: null,
    cashFlow: null
  })
  const aiInsights = ref<any>(null)
  
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchDashboard() {
    isLoading.value = true
    error.value = null
    try {
      dashboardData.value = await financeService.getDashboardSummary()
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch finance dashboard'
    } finally {
      isLoading.value = false
    }
  }

  async function fetchAccounts() {
    isLoading.value = true
    try {
      accounts.value = await financeService.getAccounts()
    } catch (err: any) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  async function fetchLedgerItems(page = 1) {
    isLoading.value = true
    try {
      ledgerItems.value = await financeService.getLedgerItems(page)
    } catch (err: any) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  async function fetchProfitLoss(start?: string, end?: string) {
    isLoading.value = true
    try {
      reports.value.profitLoss = await financeService.getProfitLoss(start, end)
    } catch (err: any) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  async function fetchBalanceSheet(date?: string) {
    isLoading.value = true
    try {
      reports.value.balanceSheet = await financeService.getBalanceSheet(date)
    } catch (err: any) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  async function fetchCashFlow(start?: string, end?: string) {
    isLoading.value = true
    try {
      reports.value.cashFlow = await financeService.getCashFlow(start, end)
    } catch (err: any) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  async function fetchAIInsights() {
    isLoading.value = true
    try {
      aiInsights.value = await financeService.getAIInsights()
    } catch (err: any) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  return {
    dashboardData,
    accounts,
    ledgerItems,
    reports,
    aiInsights,
    isLoading,
    error,
    fetchDashboard,
    fetchAccounts,
    fetchLedgerItems,
    fetchProfitLoss,
    fetchBalanceSheet,
    fetchCashFlow,
    fetchAIInsights
  }
})
