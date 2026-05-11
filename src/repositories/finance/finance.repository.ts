import { apiClient } from '@/services/api/ApiClient'

export const financeRepository = {
  getDashboard() {
    return apiClient.getClient().get('/finance/dashboard')
  },

  getAccounts() {
    return apiClient.getClient().get('/finance/ledger/accounts')
  },

  getLedgerItems(page = 1) {
    return apiClient.getClient().get(`/finance/ledger/items?page=${page}`)
  },

  getProfitLoss(params: { start_date?: string; end_date?: string } = {}) {
    return apiClient.getClient().get('/finance/reporting/profit-loss', { params })
  },

  getBalanceSheet(params: { date?: string } = {}) {
    return apiClient.getClient().get('/finance/reporting/balance-sheet', { params })
  },

  getCashFlow(params: { start_date?: string; end_date?: string } = {}) {
    return apiClient.getClient().get('/finance/reporting/cash-flow', { params })
  },

  getBudgetVariance(accountUuid: string) {
    return apiClient.getClient().get(`/finance/ai/budget-variance/${accountUuid}`)
  },

  suggestAccount(data: { description: string; amount: number }) {
    return apiClient.getClient().post('/finance/ai/suggest-account', data)
  },

  getRevenueAnalysis() {
    return apiClient.getClient().get('/finance/fpa/revenue-analysis')
  },

  getCashForecast() {
    return apiClient.getClient().get('/finance/forecasting/cash-forecast')
  },

  getRiskAssessment() {
    return apiClient.getClient().get('/finance/supply-chain/risk-assessment')
  }
}
