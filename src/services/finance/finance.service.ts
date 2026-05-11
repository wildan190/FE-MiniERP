import { financeRepository } from '@/repositories'

export const financeService = {
  async getDashboardSummary() {
    const response = await financeRepository.getDashboard()
    return response.data.data
  },

  async getAccounts() {
    const response = await financeRepository.getAccounts()
    return response.data.data
  },

  async getLedgerItems(page = 1) {
    const response = await financeRepository.getLedgerItems(page)
    // Ledger items might be paginated, check if success wraps it
    return response.data.data || response.data
  },

  async getProfitLoss(startDate?: string, endDate?: string) {
    const response = await financeRepository.getProfitLoss({ start_date: startDate, end_date: endDate })
    return response.data.data
  },

  async getBalanceSheet(date?: string) {
    const response = await financeRepository.getBalanceSheet({ date })
    return response.data.data
  },

  async getCashFlow(startDate?: string, endDate?: string) {
    const response = await financeRepository.getCashFlow({ start_date: startDate, end_date: endDate })
    return response.data.data
  },

  async getAIInsights() {
    const [revenue, forecast, risk] = await Promise.all([
      financeRepository.getRevenueAnalysis(),
      financeRepository.getCashForecast(),
      financeRepository.getRiskAssessment()
    ])
    
    return {
      revenue: revenue.data.data,
      forecast: forecast.data.data,
      risk: risk.data.data
    }
  },

  async getBudgetVariance(accountUuid: string) {
    const response = await financeRepository.getBudgetVariance(accountUuid)
    return response.data.data
  },

  async suggestAccount(description: string, amount: number) {
    const response = await financeRepository.suggestAccount({ description, amount })
    return response.data.data
  }
}
