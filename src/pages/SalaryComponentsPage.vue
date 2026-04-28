<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Salary Components</h1>
          <p class="text-gray-600 mt-1">Manage earnings and deductions for payroll</p>
        </div>
        <button
          @click="openCreateModal"
          class="hidden md:flex px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium items-center gap-2"
        >
          <Plus class="h-5 w-5" />
          New Component
        </button>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card>
          <div class="text-center">
            <p class="text-gray-600 text-sm">Total Components</p>
            <div v-if="isLoading" class="flex justify-center mt-2">
              <Skeleton width="4rem" height="2rem" />
            </div>
            <p v-else class="text-3xl font-bold text-gray-900 mt-2">{{ salaryComponents.length }}</p>
          </div>
        </Card>
      </div>

      <!-- Table -->
      <div class="space-y-4">
        <div>
          <SalaryComponentTable :components="salaryComponents" :loading="isLoading" />
        </div>
      </div>

      <!-- Create Modal -->
      <CreateSalaryComponentModal
        :is-open="isCreateModalOpen"
        :loading="isSubmitting"
        :errors="submitErrors"
        :error-message="submitErrorMessage"
        @close="closeCreateModal"
        @submit="handleCreate"
      />

      <!-- Mobile Floating Actions -->
      <MobileActions
        :primary-action="{
          label: 'New Component',
          icon: Plus,
          onClick: openCreateModal,
        }"
      />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'
import AppLayout from '../layouts/AppLayout.vue'
import Card from '../components/common/Card.vue'
import Skeleton from '../components/common/Skeleton.vue'
import SalaryComponentTable from '../components/hrm/SalaryComponentTable.vue'
import CreateSalaryComponentModal from '../components/hrm/CreateSalaryComponentModal.vue'
import MobileActions from '../components/common/MobileActions.vue'
import { Plus } from 'lucide-vue-next'

import { salaryComponentRepository } from '../repositories/hrm/salary-component.repository'
import type { 
  SalaryComponent, 
  CreateSalaryComponentRequest 
} from '../services/hrm/types/salary-component.types'

const salaryComponents = ref<SalaryComponent[]>([])
const isLoading = ref(false)

const isSubmitting = ref(false)
const isCreateModalOpen = ref(false)
const submitErrors = ref<Record<string, string[]> | null>(null)
const submitErrorMessage = ref<string | null>(null)

const loadData = async () => {
  isLoading.value = true
  try {
    const response = await salaryComponentRepository.getSalaryComponents()
    salaryComponents.value = response.data
  } catch (error) {
    console.error('Failed to load salary components:', error)
    Swal.fire({
      title: 'Error!',
      text: 'Failed to load salary components. Please try again later.',
      icon: 'error',
      confirmButtonColor: '#4f46e5',
    })
  } finally {
    isLoading.value = false
  }
}

// Create Modal
const openCreateModal = () => {
  submitErrors.value = null
  submitErrorMessage.value = null
  isCreateModalOpen.value = true
}

const closeCreateModal = () => {
  isCreateModalOpen.value = false
}

const handleCreate = async (data: CreateSalaryComponentRequest) => {
  isSubmitting.value = true
  submitErrors.value = null
  submitErrorMessage.value = null

  try {
    await salaryComponentRepository.createSalaryComponent(data)
    await Swal.fire({
      title: 'Success!',
      text: 'Salary component created successfully',
      icon: 'success',
      confirmButtonColor: '#10b981',
    })
    closeCreateModal()
    loadData()
  } catch (error: any) {
    console.error('Failed to create salary component:', error)
    if (error.response?.status === 422) {
      submitErrors.value = error.response.data.errors
      submitErrorMessage.value = 'Please correct the errors below.'
    } else {
      submitErrorMessage.value =
        error.response?.data?.message || 'Failed to create salary component. Please try again.'
      Swal.fire({
        title: 'Error!',
        text: submitErrorMessage.value || 'Failed to create salary component',
        icon: 'error',
        confirmButtonColor: '#ef4444',
      })
    }
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>
