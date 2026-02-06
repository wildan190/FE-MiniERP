import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { salesPipelineRepository } from '@/repositories'
import type { SalesPipeline, SalesPipelineListResponse, CreateSalesPipelineRequest } from '@/services'

export const useSalesPipelineStore = defineStore('salesPipeline', () => {
  const pipelines = ref<SalesPipeline[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const currentPage = ref(1)
  const totalPages = ref(1)
  const totalPipelines = ref(0)
  const perPage = ref(10)

  // Computed
  const hasError = computed(() => !!error.value)
  const isEmpty = computed(() => pipelines.value.length === 0)

  // Actions
  async function fetchSalesPipelines(page: number = 1) {
    isLoading.value = true
    error.value = null

    try {
      const response = await salesPipelineRepository.getSalesPipelines(page)
      pipelines.value = response.data.data
      currentPage.value = response.data.current_page
      totalPages.value = response.data.last_page
      totalPipelines.value = response.data.total
      perPage.value = response.data.per_page
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch sales pipelines'
      console.error('Error fetching sales pipelines:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function createSalesPipeline(data: CreateSalesPipelineRequest) {
    isLoading.value = true
    error.value = null

    try {
      const response = await salesPipelineRepository.createSalesPipeline(data)
      // Add new pipeline to list
      pipelines.value.unshift(response.data)
      totalPipelines.value += 1
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create sales pipeline'
      console.error('Error creating sales pipeline:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  function resetStore() {
    pipelines.value = []
    currentPage.value = 1
    totalPages.value = 1
    totalPipelines.value = 0
    error.value = null
    isLoading.value = false
  }

  return {
    // State
    pipelines,
    isLoading,
    error,
    currentPage,
    totalPages,
    totalPipelines,
    perPage,
    // Computed
    hasError,
    isEmpty,
    // Actions
    fetchSalesPipelines,
    createSalesPipeline,
    clearError,
    resetStore,
  }
})
