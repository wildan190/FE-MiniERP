import { defineStore } from 'pinia'
import { leaveRequestRepository } from '../repositories/hrm/leave-request.repository'
import type {
  LeaveRequest,
  LeaveBalance,
  CreateLeaveRequestRequest,
  UpdateLeaveRequestStatusRequest,
} from '../services/hrm/types/leave-request.types'

export const useLeaveRequestStore = defineStore('leaveRequest', {
  state: () => ({
    leaveRequests: [] as LeaveRequest[],
    myLeaveBalance: [] as LeaveBalance[],
    loading: false,
    error: null as string | null,
    currentPage: 1,
    totalPages: 1,
    total: 0,
    perPage: 15,
  }),

  actions: {
    async fetchLeaveRequests(page: number = 1) {
      this.loading = true
      this.error = null
      try {
        const response = await leaveRequestRepository.getLeaveRequests(page)
        this.leaveRequests = response.data.data
        this.currentPage = response.data.current_page
        this.totalPages = response.data.last_page
        this.total = response.data.total
        this.perPage = response.data.per_page
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Failed to fetch leave requests'
        throw err
      } finally {
        this.loading = false
      }
    },

    async createLeaveRequest(data: CreateLeaveRequestRequest) {
      this.loading = true
      this.error = null
      try {
        const response = await leaveRequestRepository.createLeaveRequest(data)
        return response.data
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Failed to create leave request'
        throw err
      } finally {
        this.loading = false
      }
    },

    async updateLeaveRequestStatus(uuid: string, data: UpdateLeaveRequestStatusRequest) {
      this.loading = true
      this.error = null
      try {
        const response = await leaveRequestRepository.updateLeaveRequestStatus(uuid, data)
        const index = this.leaveRequests.findIndex((lr) => lr.uuid === uuid)
        if (index !== -1) {
          this.leaveRequests[index] = response.data
        }
        return response.data
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Failed to update leave request status'
        throw err
      } finally {
        this.loading = false
      }
    },

    async fetchMyLeaveBalance() {
      this.loading = true
      this.error = null
      try {
        const response = await leaveRequestRepository.getMyLeaveBalance()
        this.myLeaveBalance = response.data
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Failed to fetch leave balance'
        throw err
      } finally {
        this.loading = false
      }
    },
  },
})
