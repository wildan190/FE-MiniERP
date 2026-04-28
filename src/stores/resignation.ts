import { defineStore } from 'pinia'
import { ref } from 'vue'
import { resignationRepository } from '../repositories/hrm/resignation.repository'
import type { 
  Resignation, 
  CreateResignationRequest, 
  UpdateResignationStatusRequest 
} from '../services/hrm/types/resignation.types'

export const useResignationStore = defineStore('resignation', () => {
  const resignations = ref<Resignation[]>([])
  const currentResignation = ref<Resignation | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 15
  })

  async function fetchResignations(page: number = 1, filters: any = {}) {
    isLoading.value = true
    error.value = null
    try {
      const response = await resignationRepository.getResignations(page, filters)
      resignations.value = response.data.data
      pagination.value = {
        currentPage: response.data.current_page,
        lastPage: response.data.last_page,
        total: response.data.total,
        perPage: response.data.per_page
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch resignations'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function fetchResignationDetail(uuid: string) {
    isLoading.value = true
    error.value = null
    try {
      const response = await resignationRepository.getResignationDetail(uuid)
      currentResignation.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch resignation detail'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function submitResignation(data: CreateResignationRequest) {
    isLoading.value = true
    try {
      const response = await resignationRepository.submitResignation(data)
      resignations.value.unshift(response.data)
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Failed to submit resignation'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function updateStatus(uuid: string, data: UpdateResignationStatusRequest) {
    isLoading.value = true
    try {
      const response = await resignationRepository.updateStatus(uuid, data)
      if (currentResignation.value?.uuid === uuid) {
        currentResignation.value = response.data
      }
      const index = resignations.value.findIndex(r => r.uuid === uuid)
      if (index !== -1) {
        resignations.value[index] = response.data
      }
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Failed to update resignation status'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    resignations,
    currentResignation,
    isLoading,
    error,
    pagination,
    fetchResignations,
    fetchResignationDetail,
    submitResignation,
    updateStatus
  }
})
