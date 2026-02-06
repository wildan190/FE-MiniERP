import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { leadRepository } from '@/repositories'
import type { Lead, LeadsListResponse, CreateLeadRequest } from '@/services'

export const useLeadStore = defineStore('lead', () => {
  const leads = ref<Lead[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const currentPage = ref(1)
  const totalPages = ref(1)
  const totalLeads = ref(0)
  const perPage = ref(10)

  // Computed
  const hasError = computed(() => !!error.value)
  const isEmpty = computed(() => leads.value.length === 0)

  // Actions
  async function fetchLeads(page: number = 1) {
    isLoading.value = true
    error.value = null

    try {
      const response = await leadRepository.getLeads(page)
      leads.value = response.data.data
      currentPage.value = response.data.current_page
      totalPages.value = response.data.last_page
      totalLeads.value = response.data.total
      perPage.value = response.data.per_page
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch leads'
      console.error('Error fetching leads:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function createLead(data: CreateLeadRequest) {
    isLoading.value = true
    error.value = null

    try {
      const response = await leadRepository.createLead(data)
      // Add new lead to list
      leads.value.unshift(response.data)
      totalLeads.value += 1
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create lead'
      console.error('Error creating lead:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  function resetStore() {
    leads.value = []
    currentPage.value = 1
    totalPages.value = 1
    totalLeads.value = 0
    error.value = null
    isLoading.value = false
  }

  return {
    // State
    leads,
    isLoading,
    error,
    currentPage,
    totalPages,
    totalLeads,
    perPage,
    // Computed
    hasError,
    isEmpty,
    // Actions
    fetchLeads,
    createLead,
    clearError,
    resetStore,
  }
})
