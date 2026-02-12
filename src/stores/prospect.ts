import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { prospectService } from '@/services/crm/prospect'
import type { Prospect, ProspectsListResponse, CreateProspectRequest, UpdateProspectStatusRequest } from '@/services'

export const useProspectStore = defineStore('prospect', () => {
  const prospects = ref<Prospect[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const currentPage = ref(1)
  const totalPages = ref(1)
  const totalProspects = ref(0)
  const perPage = ref(10)

  // Computed
  const hasError = computed(() => !!error.value)
  const isEmpty = computed(() => prospects.value.length === 0)

  // Actions
  async function fetchProspects(page: number = 1) {
    isLoading.value = true
    error.value = null

    try {
      const response = await prospectService.getProspects(page)
      prospects.value = response.data.data
      currentPage.value = response.data.current_page
      totalPages.value = response.data.last_page
      totalProspects.value = response.data.total
      perPage.value = response.data.per_page
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch prospects'
      console.error('Error fetching prospects:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function getProspectByUuid(uuid: string) {
    isLoading.value = true
    error.value = null
    try {
      return await prospectService.getProspectByUuid(uuid)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch prospect'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function createProspect(data: CreateProspectRequest) {
    isLoading.value = true
    error.value = null

    try {
      const response = await prospectService.createProspect(data)
      // Add new prospect to list
      prospects.value.unshift(response.data)
      totalProspects.value += 1
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create prospect'
      console.error('Error creating prospect:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function updateProspectStatus(uuid: string, data: UpdateProspectStatusRequest) {
    isLoading.value = true
    error.value = null

    try {
      const response = await prospectService.updateProspectStatus(uuid, data)
      // Update prospect in list
      const index = prospects.value.findIndex((p) => p.uuid === uuid)
      if (index !== -1) {
        prospects.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update prospect status'
      console.error('Error updating prospect status:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  function resetStore() {
    prospects.value = []
    currentPage.value = 1
    totalPages.value = 1
    totalProspects.value = 0
    error.value = null
    isLoading.value = false
  }

  return {
    // State
    prospects,
    isLoading,
    error,
    currentPage,
    totalPages,
    totalProspects,
    perPage,
    // Computed
    hasError,
    isEmpty,
    // Actions
    fetchProspects,
    getProspectByUuid,
    createProspect,
    updateProspectStatus,
    clearError,
    resetStore,
  }
})
