import { defineStore } from 'pinia'
import { designationRepository } from '../repositories/hrm/designation.repository'
import type { 
  Designation, 
  CreateDesignationRequest, 
  UpdateDesignationRequest 
} from '../services/hrm'

export const useDesignationStore = defineStore('designation', {
  state: () => ({
    designations: [] as Designation[],
    currentDesignation: null as Designation | null,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchDesignations() {
      this.loading = true
      this.error = null
      try {
        const response = await designationRepository.getDesignations()
        this.designations = response.data
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Failed to fetch designations'
        throw err
      } finally {
        this.loading = false
      }
    },

    async fetchDesignationDetail(uuid: string) {
      this.loading = true
      this.error = null
      try {
        const response = await designationRepository.getDesignationDetail(uuid)
        this.currentDesignation = response.data
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Failed to fetch designation details'
        throw err
      } finally {
        this.loading = false
      }
    },

    async createDesignation(data: CreateDesignationRequest) {
      this.loading = true
      this.error = null
      try {
        const response = await designationRepository.createDesignation(data)
        this.designations.unshift(response.data)
        return response.data
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Failed to create designation'
        throw err
      } finally {
        this.loading = false
      }
    },

    async updateDesignation(uuid: string, data: UpdateDesignationRequest) {
      this.loading = true
      this.error = null
      try {
        const response = await designationRepository.updateDesignation(uuid, data)
        const index = this.designations.findIndex((d) => d.uuid === uuid)
        if (index !== -1) {
          this.designations[index] = response.data
        }
        if (this.currentDesignation?.uuid === uuid) {
          this.currentDesignation = response.data
        }
        return response.data
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Failed to update designation'
        throw err
      } finally {
        this.loading = false
      }
    },

    async deleteDesignation(uuid: string) {
      this.loading = true
      this.error = null
      try {
        await designationRepository.deleteDesignation(uuid)
        this.designations = this.designations.filter((d) => d.uuid !== uuid)
        if (this.currentDesignation?.uuid === uuid) {
          this.currentDesignation = null
        }
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Failed to delete designation'
        throw err
      } finally {
        this.loading = false
      }
    },
    
    clearCurrentDesignation() {
      this.currentDesignation = null
    }
  },
})
