import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { employeeRepository } from '@/repositories'
import type { Employee, EmployeeListResponse, CreateEmployeeRequest, UpdateEmployeeRequest, EmployeeDetailResponse } from '@/services/hrm'

export const useEmployeeStore = defineStore('employee', () => {
  const employees = ref<Employee[]>([])
  const currentEmployee = ref<Employee | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const currentPage = ref(1)
  const totalPages = ref(1)
  const totalEmployees = ref(0)
  const perPage = ref(15)

  // Computed
  const hasError = computed(() => !!error.value)
  const isEmpty = computed(() => employees.value.length === 0)

  // Actions
  async function fetchEmployees(page: number = 1) {
    isLoading.value = true
    error.value = null

    try {
      const response: EmployeeListResponse = await employeeRepository.getEmployees(page)
      employees.value = response.data.data
      currentPage.value = response.data.current_page
      totalPages.value = response.data.last_page
      totalEmployees.value = response.data.total
      perPage.value = response.data.per_page
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch employees'
      console.error('Error fetching employees:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchEmployeeDetail(uuid: string) {
    isLoading.value = true
    error.value = null

    try {
      const response: EmployeeDetailResponse = await employeeRepository.getEmployeeDetail(uuid)
      currentEmployee.value = response.data
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch employee details'
      console.error('Error fetching employee details:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function createEmployee(data: CreateEmployeeRequest) {
    isLoading.value = true
    error.value = null

    try {
      const response = await employeeRepository.createEmployee(data)
      // Add new employee to list
      employees.value.unshift(response.data)
      totalEmployees.value += 1
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create employee'
      console.error('Error creating employee:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function updateEmployee(uuid: string, data: UpdateEmployeeRequest) {
    isLoading.value = true
    error.value = null

    try {
      const response = await employeeRepository.updateEmployee(uuid, data)
      // Update employee in list if exists
      const index = employees.value.findIndex(emp => emp.uuid === uuid)
      if (index !== -1) {
        employees.value[index] = response.data
      }
      // Update current employee if it's the same one
      if (currentEmployee.value?.uuid === uuid) {
        currentEmployee.value = response.data
      }
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update employee'
      console.error('Error updating employee:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function fetchEmployeeDocuments(uuid: string) {
    isLoading.value = true
    error.value = null

    try {
      const response = await employeeRepository.getEmployeeDocuments(uuid)
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch employee documents'
      console.error('Error fetching employee documents:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function uploadEmployeeDocument(uuid: string, data: FormData) {
    isLoading.value = true
    error.value = null

    try {
      const response = await employeeRepository.createEmployeeDocument(uuid, data)
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to upload document'
      console.error('Error uploading document:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function deleteEmployeeDocument(documentUuid: string) {
    isLoading.value = true
    error.value = null

    try {
      const response = await employeeRepository.deleteEmployeeDocument(documentUuid)
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete document'
      console.error('Error deleting document:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  function clearCurrentEmployee() {
    currentEmployee.value = null
  }

  return {
    // State
    employees,
    currentEmployee,
    isLoading,
    error,
    currentPage,
    totalPages,
    totalEmployees,
    perPage,

    // Computed
    hasError,
    isEmpty,

    // Actions
    fetchEmployees,
    fetchEmployeeDetail,
    createEmployee,
    updateEmployee,
    fetchEmployeeDocuments,
    uploadEmployeeDocument,
    deleteEmployeeDocument,
    clearError,
    clearCurrentEmployee,
  }
})