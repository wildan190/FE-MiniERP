<template>
  <AppLayout>
    <div class="max-w-6xl mx-auto px-4 py-6">

      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Salary Components</h1>
          <p class="text-gray-500 text-sm mt-0.5">Manage global earnings &amp; deduction components</p>
        </div>
        <button
          @click="openCreateModal"
          class="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors text-sm font-semibold shadow-sm"
        >
          <Plus class="h-4 w-4" />
          New Component
        </button>
      </div>

      <!-- Table Card -->
      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <!-- Table Header -->
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <p class="text-sm font-medium text-gray-500">
            <span v-if="!isLoading">{{ salaryComponents.length }} component{{ salaryComponents.length !== 1 ? 's' : '' }}</span>
            <span v-else>Loading...</span>
          </p>
        </div>

        <!-- Desktop Table -->
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-200">
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Value</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Taxable</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Fixed</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <!-- Loading -->
              <template v-if="isLoading">
                <tr v-for="i in 5" :key="i">
                  <td class="px-6 py-4"><Skeleton width="8rem" height="1rem" /></td>
                  <td class="px-6 py-4"><Skeleton width="5rem" height="1.25rem" /></td>
                  <td class="px-6 py-4"><Skeleton width="7rem" height="1rem" /></td>
                  <td class="px-6 py-4"><Skeleton width="3rem" height="1rem" /></td>
                  <td class="px-6 py-4"><Skeleton width="3rem" height="1rem" /></td>
                  <td class="px-6 py-4"><Skeleton width="4rem" height="1.25rem" /></td>
                </tr>
              </template>

              <!-- Data -->
              <template v-else>
                <tr
                  v-for="comp in salaryComponents"
                  :key="comp.id"
                  class="hover:bg-gray-50 transition-colors"
                >
                  <td class="px-6 py-4">
                    <span class="text-sm font-semibold text-gray-900">{{ comp.name }}</span>
                  </td>
                  <td class="px-6 py-4">
                    <span
                      class="inline-flex px-2.5 py-1 text-xs font-semibold rounded-full capitalize"
                      :class="comp.type === 'earning' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                    >
                      {{ comp.type }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <span class="text-sm font-medium text-gray-900">
                      <template v-if="comp.is_fixed">{{ formatCurrency(comp.value) }}</template>
                      <template v-else>{{ comp.value }}% <span class="text-gray-400 text-xs">of {{ comp.percentage_of || 'Base' }}</span></template>
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <span class="text-sm" :class="comp.is_taxable ? 'text-gray-800' : 'text-gray-400'">
                      {{ comp.is_taxable ? 'Yes' : 'No' }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <span class="text-sm" :class="comp.is_fixed ? 'text-gray-800' : 'text-gray-400'">
                      {{ comp.is_fixed ? 'Fixed' : 'Variable' }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <span
                      class="inline-flex px-2.5 py-1 text-xs font-semibold rounded-full"
                      :class="comp.is_active ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'"
                    >
                      {{ comp.is_active ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="!isLoading && salaryComponents.length === 0" class="text-center py-16">
          <div class="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
            <Banknote class="h-6 w-6 text-gray-400" />
          </div>
          <p class="text-sm font-medium text-gray-900">No salary components yet</p>
          <p class="text-xs text-gray-500 mt-1 mb-4">Create your first earning or deduction component.</p>
          <button
            @click="openCreateModal"
            class="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors"
          >
            <Plus class="h-4 w-4" />
            New Component
          </button>
        </div>

        <!-- Mobile Cards (shown below table on small screens) -->
        <div class="md:hidden divide-y divide-gray-100">
          <div v-if="!isLoading" v-for="comp in salaryComponents" :key="`m-${comp.id}`" class="px-4 py-4 flex items-center gap-3">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-sm font-semibold text-gray-900 truncate">{{ comp.name }}</span>
                <span
                  class="shrink-0 inline-flex px-2 py-0.5 text-xs font-semibold rounded-full capitalize"
                  :class="comp.type === 'earning' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                >{{ comp.type }}</span>
              </div>
              <p class="text-sm font-bold text-gray-800">
                <template v-if="comp.is_fixed">{{ formatCurrency(comp.value) }}</template>
                <template v-else>{{ comp.value }}%</template>
              </p>
              <p class="text-xs text-gray-400 mt-0.5">{{ comp.is_taxable ? 'Taxable' : 'Non-taxable' }} · {{ comp.is_fixed ? 'Fixed' : 'Variable' }}</p>
            </div>
            <span
              class="shrink-0 inline-flex px-2 py-0.5 text-xs font-semibold rounded-full"
              :class="comp.is_active ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'"
            >{{ comp.is_active ? 'Active' : 'Inactive' }}</span>
          </div>
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
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'
import AppLayout from '../layouts/AppLayout.vue'
import Skeleton from '../components/common/Skeleton.vue'
import CreateSalaryComponentModal from '../components/hrm/CreateSalaryComponentModal.vue'
import { Plus, Banknote } from 'lucide-vue-next'
import { salaryComponentRepository } from '../repositories/hrm/salary-component.repository'
import type { SalaryComponent, CreateSalaryComponentRequest } from '../services/hrm/types/salary-component.types'

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
  } catch {
    Swal.fire({ title: 'Error!', text: 'Failed to load salary components.', icon: 'error', confirmButtonColor: '#4f46e5' })
  } finally {
    isLoading.value = false
  }
}

const openCreateModal = () => {
  submitErrors.value = null
  submitErrorMessage.value = null
  isCreateModalOpen.value = true
}

const closeCreateModal = () => { isCreateModalOpen.value = false }

const handleCreate = async (data: CreateSalaryComponentRequest) => {
  isSubmitting.value = true
  submitErrors.value = null
  submitErrorMessage.value = null
  try {
    await salaryComponentRepository.createSalaryComponent(data)
    await Swal.fire({ title: 'Success!', text: 'Component created successfully', icon: 'success', confirmButtonColor: '#10b981' })
    closeCreateModal()
    loadData()
  } catch (error: any) {
    if (error.response?.status === 422) {
      submitErrors.value = error.response.data.errors
      submitErrorMessage.value = 'Please correct the errors below.'
    } else {
      submitErrorMessage.value = error.response?.data?.message || 'Failed to create component.'
      Swal.fire({ title: 'Error!', text: submitErrorMessage.value || 'Error', icon: 'error', confirmButtonColor: '#ef4444' })
    }
  } finally {
    isSubmitting.value = false
  }
}

const formatCurrency = (amount: string | number) => {
  const val = typeof amount === 'string' ? parseFloat(amount) : amount
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(val)
}

onMounted(() => { loadData() })
</script>
