<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Payslips</h1>
          <p class="text-gray-600 mt-1">View and download your finalized payslips</p>
        </div>
      </div>

      <!-- Filters -->
      <Card class="mb-6 bg-white/50 border-0 shadow-sm backdrop-blur-xl">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Search Employee
            </label>
            <div class="relative">
              <input
                v-model="search"
                type="text"
                placeholder="Search by name or code..."
                class="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none text-gray-700 font-medium transition-all"
              />
              <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Status
            </label>
            <div class="bg-gray-100 p-1 rounded-xl flex gap-1 w-fit">
              <button class="px-4 py-1.5 rounded-lg text-xs font-bold bg-white text-primary-600 shadow-sm">PAID ONLY</button>
              <p class="px-4 py-1.5 text-xs font-medium text-gray-400">Finalized records only</p>
            </div>
          </div>
        </div>
      </Card>

      <!-- Table -->
      <Card class="overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-100 bg-gray-50/50">
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Employee</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Period</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                <th class="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <!-- Loading -->
              <template v-if="isLoading">
                <tr v-for="i in 5" :key="i">
                  <td class="px-6 py-4"><Skeleton width="12rem" height="1.25rem" /></td>
                  <td class="px-6 py-4"><Skeleton width="8rem" height="1rem" /></td>
                  <td class="px-6 py-4"><Skeleton width="6rem" height="1rem" /></td>
                  <td class="px-6 py-4 text-right"><Skeleton width="4rem" height="2rem" class="ml-auto" /></td>
                </tr>
              </template>

              <!-- Data -->
              <template v-else-if="filteredPayrolls.length > 0">
                <tr v-for="payroll in filteredPayrolls" :key="payroll.uuid" class="hover:bg-gray-50/50 transition-colors">
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                        {{ getInitials(payroll.employee?.user?.name || payroll.employee?.first_name || 'NA') }}
                      </div>
                      <div>
                        <p class="text-sm font-bold text-gray-900">{{ payroll.employee?.user?.name || (payroll.employee?.first_name + ' ' + payroll.employee?.last_name) }}</p>
                        <p class="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{{ payroll.employee?.emp_code }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm font-medium text-gray-600">
                    {{ payroll.payroll_period?.name }}
                  </td>
                  <td class="px-6 py-4 text-sm font-black text-gray-900">
                    {{ formatCurrency(payroll.net_salary) }}
                  </td>
                  <td class="px-6 py-4 text-right">
                    <button
                      @click="handleDownload(payroll.uuid)"
                      class="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-xl text-xs font-bold hover:bg-primary-600 hover:text-white transition-all group"
                    >
                      <Download class="h-4 w-4 group-hover:scale-110 transition-transform" />
                      Download PDF
                    </button>
                  </td>
                </tr>
              </template>

              <!-- Empty -->
              <tr v-else>
                <td colspan="4" class="px-6 py-20 text-center">
                  <div class="flex flex-col items-center gap-2">
                    <FileText class="h-12 w-12 text-gray-200" />
                    <p class="text-gray-400 font-medium">No paid payslips found.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import AppLayout from '../layouts/AppLayout.vue'
import Card from '../components/common/Card.vue'
import Skeleton from '../components/common/Skeleton.vue'
import { Search, Download, FileText } from 'lucide-vue-next'
import { payrollRepository } from '../repositories/hrm/payroll.repository'
import type { Payroll } from '../services/hrm/types/payroll.types'

const payrolls = ref<Payroll[]>([])
const isLoading = ref(true)
const search = ref('')

const loadData = async () => {
  isLoading.value = true
  try {
    const response = await payrollRepository.getPayrolls({ status: 'paid', per_page: 100 })
    payrolls.value = response.data.data
  } catch (error) {
    console.error('Failed to load payslips:', error)
  } finally {
    isLoading.value = false
  }
}

const filteredPayrolls = computed(() => {
  if (!search.value) return payrolls.value
  const q = search.value.toLowerCase()
  return payrolls.value.filter(p => 
    p.employee?.user?.name?.toLowerCase().includes(q) || 
    p.employee?.first_name?.toLowerCase().includes(q) ||
    p.employee?.emp_code?.toLowerCase().includes(q)
  )
})

const handleDownload = (uuid: string) => {
  const url = payrollRepository.getPayslipUrl(uuid)
  window.open(url, '_blank')
}

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
}

const formatCurrency = (amount: string | number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(Number(amount))
}

onMounted(loadData)
</script>
