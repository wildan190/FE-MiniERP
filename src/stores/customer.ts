import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { customerRepository } from '@/repositories'
import type { Customer, CustomersListResponse, CreateCustomerRequest } from '@/services'

export const useCustomerStore = defineStore('customer', () => {
  const customers = ref<Customer[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const currentPage = ref(1)
  const totalPages = ref(1)
  const totalCustomers = ref(0)
  const perPage = ref(10)

  // Computed
  const hasError = computed(() => !!error.value)
  const isEmpty = computed(() => customers.value.length === 0)

  // Actions
  async function fetchCustomers(page: number = 1) {
    isLoading.value = true
    error.value = null

    try {
      const response = await customerRepository.getCustomers(page)
      customers.value = response.data.data
      currentPage.value = response.data.current_page
      totalPages.value = response.data.last_page
      totalCustomers.value = response.data.total
      perPage.value = response.data.per_page
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch customers'
      console.error('Error fetching customers:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function createCustomer(data: CreateCustomerRequest) {
    isLoading.value = true
    error.value = null

    try {
      const response = await customerRepository.createCustomer(data)
      // Add new customer to list
      customers.value.unshift(response.data)
      totalCustomers.value += 1
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create customer'
      console.error('Error creating customer:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  function resetStore() {
    customers.value = []
    currentPage.value = 1
    totalPages.value = 1
    totalCustomers.value = 0
    error.value = null
    isLoading.value = false
  }

  return {
    // State
    customers,
    isLoading,
    error,
    currentPage,
    totalPages,
    totalCustomers,
    perPage,
    // Computed
    hasError,
    isEmpty,
    // Actions
    fetchCustomers,
    createCustomer,
    clearError,
    resetStore,
  }
})
