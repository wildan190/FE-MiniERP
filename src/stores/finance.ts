import { defineStore } from 'pinia'
import { ref } from 'vue'
import { financeService } from '@/services'

export const useFinanceStore = defineStore('finance', () => {
  const dashboardData = ref<any>(null)
  const accounts = ref<any[]>([])
  const ledgerItems = ref<any>(null)
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

  async function createAccount(data: { code: string; name: string; type: string; parent_uuid?: string | null; is_reconcilable?: boolean }) {
    const newAccount = await financeService.createAccount(data)
    if (newAccount) accounts.value = [...accounts.value, newAccount]
    return newAccount
  }

  async function updateAccount(uuid: string, data: any) {
    const updated = await financeService.updateAccount(uuid, data)
    if (updated) {
      const idx = accounts.value.findIndex((a: any) => a.uuid === uuid)
      if (idx !== -1) accounts.value[idx] = updated
    }
    return updated
  }

  async function deleteAccount(uuid: string) {
    await financeService.deleteAccount(uuid)
    accounts.value = accounts.value.filter((a: any) => a.uuid !== uuid)
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

  async function suggestAccount(description: string, amount: number) {
    return await financeService.suggestAccount(description, amount)
  }

  async function approveRecord(uuid: string) {
    isLoading.value = true
    try {
      const res = await financeService.approveRecord(uuid)
      await fetchDashboard()
      return res
    } finally {
      isLoading.value = false
    }
  }

  async function rejectRecord(uuid: string, reason: string) {
    isLoading.value = true
    try {
      const res = await financeService.rejectRecord(uuid, reason)
      await fetchDashboard()
      return res
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
    createAccount,
    updateAccount,
    deleteAccount,
    fetchLedgerItems,
    fetchProfitLoss,
    fetchBalanceSheet,
    fetchCashFlow,
    fetchAIInsights,
    suggestAccount,
    approveRecord,
    rejectRecord
  }
})
