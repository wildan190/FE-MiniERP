import { defineStore } from 'pinia'
import { shiftRepository } from '../repositories/hrm/shift.repository'
import type { Shift, CreateShiftRequest, UpdateShiftRequest } from '../services/hrm/types/shift.types'
import type { PaginationLink } from '../services/types'

export const useShiftStore = defineStore('shift', {
  state: () => ({
    shifts: [] as Shift[],
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
    async fetchShifts(page: number = 1) {
      this.loading = true
      this.error = null
      try {
        const response = await shiftRepository.getShifts(page)
        this.shifts = response.data.data
        this.currentPage = response.data.current_page
        this.totalPages = response.data.last_page
        this.total = response.data.total
        this.perPage = response.data.per_page
        this.from = response.data.from || 0
        this.to = response.data.to || 0
        this.links = response.data.links
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Failed to fetch shifts'
        throw err
      } finally {
        this.loading = false
      }
    },

    async createShift(data: CreateShiftRequest) {
      this.loading = true
      this.error = null
      try {
        const response = await shiftRepository.createShift(data)
        await this.fetchShifts(this.currentPage)
        return response.data
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Failed to create shift'
        throw err
      } finally {
        this.loading = false
      }
    },

    async updateShift(uuid: string, data: UpdateShiftRequest) {
      this.loading = true
      this.error = null
      try {
        const response = await shiftRepository.updateShift(uuid, data)
        const index = this.shifts.findIndex((s) => s.uuid === uuid)
        if (index !== -1) {
          this.shifts[index] = response.data
        }
        return response.data
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Failed to update shift'
        throw err
      } finally {
        this.loading = false
      }
    },

    async deleteShift(uuid: string) {
      this.loading = true
      this.error = null
      try {
        await shiftRepository.deleteShift(uuid)
        await this.fetchShifts(this.currentPage)
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Failed to delete shift'
        throw err
      } finally {
        this.loading = false
      }
    },
  },
})
