import { defineStore } from 'pinia'
import { hrmReportRepository } from '../repositories/hrm/hrm-report.repository'
import type { TurnoverStatistics, LaborCostStatistics } from '../services/hrm/types/hrm-report.types'

export const useHrmReportStore = defineStore('hrmReport', {
  state: () => ({
    turnover: null as TurnoverStatistics | null,
    laborCost: null as LaborCostStatistics | null,
    loadingTurnover: false,
    loadingLaborCost: false,
    error: null as string | null,
  }),

  actions: {
    async fetchTurnoverStatistics(year?: number) {
      this.loadingTurnover = true
      this.error = null
      try {
        const response = await hrmReportRepository.getTurnoverStatistics(year)
        this.turnover = response.data
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Failed to fetch turnover statistics'
        throw err
      } finally {
        this.loadingTurnover = false
      }
    },

    async fetchLaborCostStatistics(year?: number) {
      this.loadingLaborCost = true
      this.error = null
      try {
        const response = await hrmReportRepository.getLaborCostStatistics(year)
        this.laborCost = response.data
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Failed to fetch labor cost statistics'
        throw err
      } finally {
        this.loadingLaborCost = false
      }
    },
  },
})
