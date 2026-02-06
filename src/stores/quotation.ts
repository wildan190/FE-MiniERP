import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { quotationRepository } from '@/repositories'
import type { Quotation, QuotationListResponse, CreateQuotationRequest } from '@/services'

export const useQuotationStore = defineStore('quotation', () => {
  const quotations = ref<Quotation[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const currentPage = ref(1)
  const totalPages = ref(1)
  const totalQuotations = ref(0)
  const perPage = ref(10)

  // Computed
  const hasError = computed(() => !!error.value)
  const isEmpty = computed(() => quotations.value.length === 0)

  // Actions
  async function fetchQuotations(page: number = 1) {
    isLoading.value = true
    error.value = null

    try {
      const response = await quotationRepository.getQuotations(page)
      quotations.value = response.data.data
      currentPage.value = response.data.current_page
      totalPages.value = response.data.last_page
      totalQuotations.value = response.data.total
      perPage.value = response.data.per_page
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch quotations'
      console.error('Error fetching quotations:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function createQuotation(data: CreateQuotationRequest) {
    isLoading.value = true
    error.value = null

    try {
      const response = await quotationRepository.createQuotation(data)
      // Add new quotation to list
      quotations.value.unshift(response.data)
      totalQuotations.value += 1
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create quotation'
      console.error('Error creating quotation:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  function resetStore() {
    quotations.value = []
    currentPage.value = 1
    totalPages.value = 1
    totalQuotations.value = 0
    error.value = null
    isLoading.value = false
  }

  return {
    // State
    quotations,
    isLoading,
    error,
    currentPage,
    totalPages,
    totalQuotations,
    perPage,
    // Computed
    hasError,
    isEmpty,
    // Actions
    fetchQuotations,
    createQuotation,
    clearError,
    resetStore,
  }
})
