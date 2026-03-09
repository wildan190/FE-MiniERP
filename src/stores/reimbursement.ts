import { defineStore } from 'pinia'
import { reimbursementRepository } from '@/repositories/hrm/reimbursement.repository'
import type { 
  Reimbursement, 
  ReimbursementFilters, 
  CreateReimbursementRequest, 
  UpdateReimbursementStatusRequest,
  PaginationLink
} from '@/services/hrm/types/reimbursement.types'

export const useReimbursementStore = defineStore('reimbursement', {
  state: () => ({
    reimbursements: [] as Reimbursement[],
    loading: false,
    error: null as string | null,
    currentPage: 1,
    totalPages: 1,
    total: 0,
    perPage: 15,
    from: 0,
    to: 0,
    links: [] as PaginationLink[],
  }),

  actions: {
    async fetchReimbursements(filters: ReimbursementFilters = {}, page: number = 1) {
      this.loading = true
      this.error = null
      try {
        const response = await reimbursementRepository.getReimbursements({ ...filters, page })
        this.reimbursements = response.data.data
        this.currentPage = response.data.current_page
        this.totalPages = response.data.last_page
        this.total = response.data.total
        this.perPage = response.data.per_page
        this.from = response.data.from || 0
        this.to = response.data.to || 0
        this.links = response.data.links
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch reimbursements'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchMyClaims(filters: ReimbursementFilters = {}, page: number = 1) {
      this.loading = true
      this.error = null
      try {
        const response = await reimbursementRepository.getMyClaims({ ...filters, page })
        this.reimbursements = response.data.data
        this.currentPage = response.data.current_page
        this.totalPages = response.data.last_page
        this.total = response.data.total
        this.perPage = response.data.per_page
        this.from = response.data.from || 0
        this.to = response.data.to || 0
        this.links = response.data.links
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch your claims'
        throw error
      } finally {
        this.loading = false
      }
    },

    async submitClaim(data: CreateReimbursementRequest) {
      this.loading = true
      try {
        const response = await reimbursementRepository.submitClaim(data)
        return response.data.data
      } catch (error: any) {
        this.error = error.message || 'Failed to submit claim'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateStatus(uuid: string, data: UpdateReimbursementStatusRequest) {
      this.loading = true
      try {
        const response = await reimbursementRepository.updateStatus(uuid, data)
        const index = this.reimbursements.findIndex(r => r.uuid === uuid)
        if (index !== -1) {
          this.reimbursements[index] = response.data.data
        }
        return response.data.data
      } catch (error: any) {
        this.error = error.message || 'Failed to update status'
        throw error
      } finally {
        this.loading = false
      }
    },

    async markAsPaid(uuid: string) {
      this.loading = true
      try {
        const response = await reimbursementRepository.markAsPaid(uuid)
        const index = this.reimbursements.findIndex(r => r.uuid === uuid)
        if (index !== -1) {
          this.reimbursements[index] = response.data.data
        }
        return response.data.data
      } catch (error: any) {
        this.error = error.message || 'Failed to mark as paid'
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})
