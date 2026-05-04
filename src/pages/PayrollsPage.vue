<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Payrolls</h1>
          <p class="text-gray-600 mt-1">View and manage employee payroll records</p>
        </div>
      </div>

      <!-- Filters -->
      <Card class="mb-6 bg-white/50 border-0 shadow-sm backdrop-blur-xl">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Payroll Period
            </label>
            <div class="relative">
              <select
                v-model="filters.payroll_period_uuid"
                @change="handleFilterChange"
                class="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none text-gray-700 font-medium transition-all"
                :disabled="isLoadingPeriods"
              >
                <option value="">All Periods</option>
                <option
                  v-for="period in payrollPeriods"
                  :key="period.uuid"
                  :value="period.uuid"
                >
                  {{ period.name }}
                </option>
              </select>
              <Calendar class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              <ChevronDown class="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Status
            </label>
            <div class="relative">
              <select
                v-model="filters.status"
                @change="handleFilterChange"
                class="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none text-gray-700 font-medium transition-all"
              >
                <option value="">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="paid">Paid</option>
              </select>
              <Tag class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              <ChevronDown class="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </Card>

      <!-- Table -->
      <div class="space-y-4">
        <!-- Batch Actions -->
        <div v-if="selectedUuids.length > 0" class="flex items-center justify-between p-4 bg-primary-50 rounded-2xl border border-primary-100 shadow-sm animate-fade-in">
          <div class="flex items-center gap-3">
            <div class="h-10 w-10 rounded-xl bg-primary-600 flex items-center justify-center text-white shadow-sm">
              <CheckCircle class="h-6 w-6" />
            </div>
            <div>
              <p class="text-sm font-bold text-primary-900">{{ selectedUuids.length }} Payrolls Selected</p>
              <p class="text-xs text-primary-600">You can mark all selected records as paid at once.</p>
            </div>
          </div>
          <div class="flex gap-2">
            <button
              @click="clearSelection"
              class="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="handleBatchPay"
              :disabled="isBatchPaying"
              class="px-6 py-2.5 bg-green-600 text-white text-sm font-bold rounded-xl hover:bg-green-700 transition-all shadow-md flex items-center gap-2 hover:-translate-y-0.5 active:scale-95 disabled:opacity-50"
            >
              <Banknote class="h-5 w-5" />
              {{ isBatchPaying ? 'Processing...' : 'Mark as Paid' }}
            </button>
          </div>
        </div>

        <div>
          <PayrollTable 
            :payrolls="payrolls" 
            :loading="isLoading" 
            v-model:selectedUuids="selectedUuids"
          />

          <!-- Pagination -->
          <ResponsivePagination
            v-if="!isLoading && pagination.total > 0"
            :current-page="pagination.current_page"
            :last-page="pagination.last_page"
            :from="pagination.from"
            :to="pagination.to"
            :total="pagination.total"
            :links="pagination.links"
            @page-change="loadData"
          />
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'
import AppLayout from '../layouts/AppLayout.vue'
import Card from '../components/common/Card.vue'
import PayrollTable from '../components/hrm/PayrollTable.vue'
import ResponsivePagination from '../components/common/ResponsivePagination.vue'
import { Calendar, ChevronDown, Tag, CheckCircle, Banknote } from 'lucide-vue-next'

import { payrollRepository } from '../repositories/hrm/payroll.repository'
import { payrollPeriodRepository } from '../repositories/hrm/payroll-period.repository'
import type { Payroll } from '../services/hrm/types/payroll.types'
import type { PayrollPeriod } from '../services/hrm/types/payroll-period.types'
import type { PaginationLink } from '../services/types'

const payrolls = ref<Payroll[]>([])
const isLoading = ref(false)
const selectedUuids = ref<string[]>([])
const isBatchPaying = ref(false)

const payrollPeriods = ref<PayrollPeriod[]>([])
const isLoadingPeriods = ref(false)

const filters = ref({
  payroll_period_uuid: '',
  status: '',
})

const pagination = ref({
  current_page: 1,
  from: 0,
  to: 0,
  total: 0,
  links: [] as PaginationLink[],
  last_page: 1,
})

const loadPeriods = async () => {
  isLoadingPeriods.value = true
  try {
    const response = await payrollPeriodRepository.getPayrollPeriods()
    payrollPeriods.value = response.data
  } catch (error) {
    console.error('Failed to load payroll periods:', error)
  } finally {
    isLoadingPeriods.value = false
  }
}

const loadData = async (page = 1) => {
  isLoading.value = true
  try {
    const params: any = { page }
    if (filters.value.payroll_period_uuid) params.payroll_period_uuid = filters.value.payroll_period_uuid
    if (filters.value.status) params.status = filters.value.status

    const response = await payrollRepository.getPayrolls(params)
    
    payrolls.value = response.data.data
    pagination.value = {
      current_page: response.data.current_page,
      from: response.data.from,
      to: response.data.to,
      total: response.data.total,
      links: response.data.links,
      last_page: response.data.last_page,
    }
  } catch (error) {
    console.error('Failed to load payrolls:', error)
    Swal.fire({
      title: 'Error!',
      text: 'Failed to load payrolls. Please try again later.',
      icon: 'error',
      confirmButtonColor: '#4f46e5',
    })
  } finally {
    isLoading.value = false
  }
}

const handleFilterChange = () => {
  selectedUuids.value = []
  loadData(1)
}

const clearSelection = () => {
  selectedUuids.value = []
}

const handleBatchPay = async () => {
  if (selectedUuids.value.length === 0) return

  const result = await Swal.fire({
    title: 'Batch Mark as Paid?',
    text: `Are you sure you want to mark ${selectedUuids.value.length} selected payrolls as paid? This will set today's date as the payment date.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#10b981',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes, mark all as paid'
  })

  if (result.isConfirmed) {
    isBatchPaying.value = true
    try {
      const response = await payrollRepository.batchPay(selectedUuids.value)
      await Swal.fire({
        title: 'Success!',
        text: response.message,
        icon: 'success',
        confirmButtonColor: '#10b981',
      })
      selectedUuids.value = []
      loadData(pagination.value.current_page)
    } catch (error: any) {
      console.error('Batch pay failed:', error)
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to process batch payment.',
        icon: 'error',
        confirmButtonColor: '#ef4444',
      })
    } finally {
      isBatchPaying.value = false
    }
  }
}

onMounted(() => {
  loadPeriods()
  loadData()
})
</script>
