<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Payroll Periods</h1>
          <p class="text-gray-600 mt-1">Manage payroll periods and generate payrolls</p>
        </div>
        <div class="flex gap-3">
          <button
            @click="openGenerateModal"
            class="hidden md:flex px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium items-center gap-2"
          >
            <Settings class="h-5 w-5" />
            Generate Payroll
          </button>
          <button
            @click="openCreateModal"
            class="hidden md:flex px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium items-center gap-2"
          >
            <Plus class="h-5 w-5" />
            New Period
          </button>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card>
          <div class="text-center">
            <p class="text-gray-600 text-sm">Total Periods</p>
            <div v-if="isLoading" class="flex justify-center mt-2">
              <Skeleton width="4rem" height="2rem" />
            </div>
            <p v-else class="text-3xl font-bold text-gray-900 mt-2">{{ payrollPeriods.length }}</p>
          </div>
        </Card>
      </div>

      <!-- Table -->
      <div class="space-y-4">
        <div>
          <PayrollPeriodTable :payroll-periods="payrollPeriods" :loading="isLoading" />
        </div>
      </div>

      <!-- Create Modal -->
      <CreatePayrollPeriodModal
        :is-open="isCreateModalOpen"
        :loading="isSubmitting"
        :errors="submitErrors"
        :error-message="submitErrorMessage"
        @close="closeCreateModal"
        @submit="handleCreate"
      />

      <!-- Generate Modal -->
      <GeneratePayrollModal
        :is-open="isGenerateModalOpen"
        :loading="isGenerating"
        :payroll-periods="payrollPeriods"
        :errors="generateErrors"
        :error-message="generateErrorMessage"
        @close="closeGenerateModal"
        @submit="handleGenerate"
      />

      <!-- Mobile Floating Actions -->
      <MobileActions
        :primary-action="{
          label: 'New Period',
          icon: Plus,
          onClick: openCreateModal,
        }"
        :secondary-actions="[
          {
            label: 'Generate Payroll',
            icon: Settings,
            onClick: openGenerateModal,
          }
        ]"
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
import PayrollPeriodTable from '../components/hrm/PayrollPeriodTable.vue'
import CreatePayrollPeriodModal from '../components/hrm/CreatePayrollPeriodModal.vue'
import GeneratePayrollModal from '../components/hrm/GeneratePayrollModal.vue'
import MobileActions from '../components/common/MobileActions.vue'
import { Plus, Settings } from 'lucide-vue-next'

import { payrollPeriodRepository } from '../repositories/hrm/payroll-period.repository'
import type { 
  PayrollPeriod, 
  CreatePayrollPeriodRequest, 
  GeneratePayrollRequest 
} from '../services/hrm/types/payroll-period.types'

const payrollPeriods = ref<PayrollPeriod[]>([])
const isLoading = ref(false)

const isSubmitting = ref(false)
const isCreateModalOpen = ref(false)
const submitErrors = ref<Record<string, string[]> | null>(null)
const submitErrorMessage = ref<string | null>(null)

const isGenerating = ref(false)
const isGenerateModalOpen = ref(false)
const generateErrors = ref<Record<string, string[]> | null>(null)
const generateErrorMessage = ref<string | null>(null)

const loadData = async () => {
  isLoading.value = true
  try {
    const response = await payrollPeriodRepository.getPayrollPeriods()
    payrollPeriods.value = response.data
  } catch (error) {
    console.error('Failed to load payroll periods:', error)
    Swal.fire({
      title: 'Error!',
      text: 'Failed to load payroll periods. Please try again later.',
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

const handleCreate = async (data: CreatePayrollPeriodRequest) => {
  isSubmitting.value = true
  submitErrors.value = null
  submitErrorMessage.value = null

  try {
    await payrollPeriodRepository.createPayrollPeriod(data)
    await Swal.fire({
      title: 'Success!',
      text: 'Payroll period created successfully',
      icon: 'success',
      confirmButtonColor: '#10b981',
    })
    closeCreateModal()
    loadData()
  } catch (error: any) {
    console.error('Failed to create payroll period:', error)
    if (error.response?.status === 422) {
      submitErrors.value = error.response.data.errors
      submitErrorMessage.value = 'Please correct the errors below.'
    } else {
      submitErrorMessage.value =
        error.response?.data?.message || 'Failed to create payroll period. Please try again.'
      Swal.fire({
        title: 'Error!',
        text: submitErrorMessage.value || 'Failed to create payroll period',
        icon: 'error',
        confirmButtonColor: '#ef4444',
      })
    }
  } finally {
    isSubmitting.value = false
  }
}

// Generate Modal
const openGenerateModal = () => {
  generateErrors.value = null
  generateErrorMessage.value = null
  isGenerateModalOpen.value = true
}

const closeGenerateModal = () => {
  isGenerateModalOpen.value = false
}

const handleGenerate = async (data: GeneratePayrollRequest) => {
  isGenerating.value = true
  generateErrors.value = null
  generateErrorMessage.value = null

  try {
    const response = await payrollPeriodRepository.generatePayroll(data)
    await Swal.fire({
      title: 'Success!',
      text: response.message || 'Payroll generated successfully.',
      icon: 'success',
      confirmButtonColor: '#10b981',
    })
    closeGenerateModal()
    loadData()
  } catch (error: any) {
    console.error('Failed to generate payroll:', error)
    if (error.response?.status === 422) {
      generateErrors.value = error.response.data.errors
      generateErrorMessage.value = 'Please correct the errors below.'
    } else {
      generateErrorMessage.value =
        error.response?.data?.message || 'Failed to generate payroll. Please try again.'
      Swal.fire({
        title: 'Error!',
        text: generateErrorMessage.value || 'Failed to generate payroll',
        icon: 'error',
        confirmButtonColor: '#ef4444',
      })
    }
  } finally {
    isGenerating.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>
