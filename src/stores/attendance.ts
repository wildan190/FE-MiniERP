import { defineStore } from 'pinia'
import { attendanceRepository } from '../repositories/hrm/attendance.repository'
import type {
  Attendance,
  AttendanceFilters,
  ClockInRequest,
  ClockOutRequest,
} from '../services/hrm/types/attendance.types'

export const useAttendanceStore = defineStore('attendance', {
  state: () => ({
    attendances: [] as Attendance[],
    loading: false,
    error: null as string | null,
    currentPage: 1,
    totalPages: 1,
    total: 0,
    perPage: 15,
  }),

  actions: {
    async fetchAttendances(filters: AttendanceFilters = {}, page: number = 1) {
      this.loading = true
      this.error = null
      try {
        const response = await attendanceRepository.getAttendances(filters, page)
        this.attendances = response.data.data
        this.currentPage = response.data.current_page
        this.totalPages = response.data.last_page
        this.total = response.data.total
        this.perPage = response.data.per_page
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Failed to fetch attendances'
        throw err
      } finally {
        this.loading = false
      }
    },

    async clockIn(data: ClockInRequest) {
      this.loading = true
      this.error = null
      try {
        const response = await attendanceRepository.clockIn(data)
        // Optionally refresh the list or add the new record
        return response.data
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Failed to clock in'
        throw err
      } finally {
        this.loading = false
      }
    },

    async clockOut(data: ClockOutRequest) {
      this.loading = true
      this.error = null
      try {
        const response = await attendanceRepository.clockOut(data)
        // Update the existing record in the list if it's there
        const index = this.attendances.findIndex((a) => a.id === response.data.id)
        if (index !== -1) {
          this.attendances[index] = response.data
        }
        return response.data
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Failed to clock out'
        throw err
      } finally {
        this.loading = false
      }
    },
  },
})
