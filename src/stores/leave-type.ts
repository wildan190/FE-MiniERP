import { defineStore } from 'pinia'
import { leaveTypeRepository } from '../repositories/hrm/leave-type.repository'
import type {
  LeaveType,
  CreateLeaveTypeRequest,
  UpdateLeaveTypeRequest,
} from '../services/hrm/types/leave-type.types'

export const useLeaveTypeStore = defineStore('leaveType', {
  state: () => ({
    leaveTypes: [] as LeaveType[],
    currentLeaveType: null as LeaveType | null,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchLeaveTypes() {
      this.loading = true
      this.error = null
      try {
        const response = await leaveTypeRepository.getLeaveTypes()
        this.leaveTypes = response.data
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Failed to fetch leave types'
        throw err
      } finally {
        this.loading = false
      }
    },

    async fetchLeaveTypeDetail(uuid: string) {
      this.loading = true
      this.error = null
      try {
        const response = await leaveTypeRepository.getLeaveTypeDetail(uuid)
        this.currentLeaveType = response.data
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Failed to fetch leave type details'
        throw err
      } finally {
        this.loading = false
      }
    },

    async createLeaveType(data: CreateLeaveTypeRequest) {
      this.loading = true
      this.error = null
      try {
        const response = await leaveTypeRepository.createLeaveType(data)
        this.leaveTypes.unshift(response.data)
        return response.data
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Failed to create leave type'
        throw err
      } finally {
        this.loading = false
      }
    },

    async updateLeaveType(uuid: string, data: UpdateLeaveTypeRequest) {
      this.loading = true
      this.error = null
      try {
        const response = await leaveTypeRepository.updateLeaveType(uuid, data)
        const index = this.leaveTypes.findIndex((lt) => lt.uuid === uuid)
        if (index !== -1) {
          this.leaveTypes[index] = response.data
        }
        if (this.currentLeaveType?.uuid === uuid) {
          this.currentLeaveType = response.data
        }
        return response.data
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Failed to update leave type'
        throw err
      } finally {
        this.loading = false
      }
    },

    async deleteLeaveType(uuid: string) {
      this.loading = true
      this.error = null
      try {
        await leaveTypeRepository.deleteLeaveType(uuid)
        this.leaveTypes = this.leaveTypes.filter((lt) => lt.uuid !== uuid)
        if (this.currentLeaveType?.uuid === uuid) {
          this.currentLeaveType = null
        }
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Failed to delete leave type'
        throw err
      } finally {
        this.loading = false
      }
    },

    clearCurrentLeaveType() {
      this.currentLeaveType = null
    },
  },
})
