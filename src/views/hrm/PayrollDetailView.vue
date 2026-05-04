<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Loading State -->
      <div v-if="isLoading" class="space-y-6">
        <div class="flex items-center justify-between">
          <Skeleton width="20rem" height="2.5rem" />
          <Skeleton width="10rem" height="2.5rem" />
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="md:col-span-2 space-y-6">
            <Skeleton width="100%" height="20rem" />
          </div>
          <div>
            <Skeleton width="100%" height="15rem" />
          </div>
        </div>
      </div>

      <template v-else-if="payroll">
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div class="flex items-center gap-4">
            <div
              class="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-lg"
            >
              {{ getInitials(payroll.employee?.user?.name || payroll.employee?.first_name || 'N A') }}
            </div>
            <div>
              <div class="flex items-center gap-3">
                <h1 class="text-2xl font-bold text-gray-900">
                  {{ payroll.employee?.user?.name || (payroll.employee?.first_name + ' ' + payroll.employee?.last_name) || 'Unknown Employee' }}
                </h1>
                <span
                  :class="getStatusClass(payroll.status)"
                  class="inline-flex px-2.5 py-1 text-xs font-bold rounded-full border shadow-sm capitalize"
                >
                  {{ payroll.status }}
                </span>
              </div>
              <p class="text-gray-500 mt-1 flex items-center gap-2">
                <span class="font-medium text-gray-700">{{ payroll.payroll_period?.name }}</span>
                <span class="text-gray-300">•</span>
                <span>{{ payroll.employee?.emp_code || 'No ID' }}</span>
              </p>
            </div>
          </div>
          
          <div class="flex gap-3">
            <button
              v-if="payroll.status === 'paid'"
              @click="handleDownloadPayslip"
              class="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all shadow-sm flex items-center gap-2 hover:-translate-y-0.5"
            >
              <Download class="h-5 w-5" />
              Download Payslip
            </button>
            <button
              v-if="payroll.status !== 'paid'"
              @click="handleMarkAsPaid"
              :disabled="isPaying"
              class="px-5 py-2.5 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-all shadow-sm flex items-center gap-2 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle class="h-5 w-5" />
              {{ isPaying ? 'Processing...' : 'Mark as Paid' }}
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Summary Sidebar -->
          <div class="lg:col-span-1 space-y-6">
            <Card class="bg-gradient-to-br from-gray-900 to-indigo-900 text-white overflow-hidden relative">
              <!-- Decorative background -->
              <div class="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-white opacity-5 blur-2xl"></div>
              <div class="absolute bottom-0 left-0 -mb-4 -ml-4 h-32 w-32 rounded-full bg-indigo-500 opacity-20 blur-2xl"></div>
              
              <div class="relative z-10 space-y-6">
                <div>
                  <h3 class="text-indigo-200 text-sm font-medium mb-1">Net Salary</h3>
                  <p class="text-3xl font-extrabold tracking-tight">{{ formatCurrency(payroll.net_salary) }}</p>
                </div>
                
                <div class="space-y-4 pt-4 border-t border-white/10">
                  <div class="flex justify-between items-center">
                    <span class="text-indigo-200 text-sm">Basic Salary</span>
                    <span class="font-semibold">{{ formatCurrency(payroll.basic_salary) }}</span>
                  </div>
                  <div class="flex justify-between items-center text-green-400">
                    <span class="text-sm">Total Earnings</span>
                    <span class="font-semibold">+{{ formatCurrency(payroll.total_earnings) }}</span>
                  </div>
                  <div class="flex justify-between items-center text-red-400">
                    <span class="text-sm">Total Deductions</span>
                    <span class="font-semibold">-{{ formatCurrency(payroll.total_deductions) }}</span>
                  </div>
                </div>

                <div v-if="payroll.payment_date" class="pt-4 border-t border-white/10 flex justify-between items-center">
                  <span class="text-indigo-200 text-sm">Payment Date</span>
                  <span class="text-sm font-medium">{{ formatDate(payroll.payment_date) }}</span>
                </div>
              </div>
            </Card>

            <Card>
              <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar class="h-5 w-5 text-primary-500" />
                Period Details
              </h3>
              <div class="space-y-3">
                <div>
                  <p class="text-xs text-gray-500 uppercase font-semibold">Start Date</p>
                  <p class="text-sm font-medium text-gray-900">{{ formatDate(payroll.payroll_period?.start_date) }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 uppercase font-semibold">End Date</p>
                  <p class="text-sm font-medium text-gray-900">{{ formatDate(payroll.payroll_period?.end_date) }}</p>
                </div>
              </div>
            </Card>

            <Card class="border-indigo-100 bg-indigo-50/20">
              <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock class="h-5 w-5 text-indigo-500" />
                Attendance Stats
              </h3>
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-white p-3 rounded-xl border border-indigo-50 shadow-sm">
                  <p class="text-[10px] text-gray-500 uppercase font-bold mb-1">Expected</p>
                  <p class="text-lg font-black text-gray-900">{{ payroll.expected_work_days }} <span class="text-xs font-medium text-gray-400">days</span></p>
                </div>
                <div class="bg-white p-3 rounded-xl border border-indigo-50 shadow-sm">
                  <p class="text-[10px] text-gray-500 uppercase font-bold mb-1">Presence</p>
                  <p class="text-lg font-black text-green-600">{{ payroll.actual_presence }} <span class="text-xs font-medium text-gray-400">days</span></p>
                </div>
                <div class="col-span-2 bg-white p-3 rounded-xl border border-indigo-50 shadow-sm flex items-center justify-between">
                  <div>
                    <p class="text-[10px] text-gray-500 uppercase font-bold mb-0.5">Absence</p>
                    <p class="text-lg font-black text-red-600">{{ payroll.absence_days }} <span class="text-xs font-medium text-gray-400">days</span></p>
                  </div>
                  <div v-if="payroll.absence_days > 0" class="text-right">
                    <p class="text-[10px] text-red-500 uppercase font-bold mb-0.5">Deduction applied</p>
                    <p class="text-xs font-medium text-gray-400">Calculated based on basic salary</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <!-- Items Table -->
          <div class="lg:col-span-2 space-y-6">
            <Card>
              <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Receipt class="h-5 w-5 text-primary-500" />
                Payroll Items
              </h3>
              
              <div v-if="payroll.items && payroll.items.length > 0" class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr class="border-b border-gray-200">
                      <th class="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Description</th>
                      <th class="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Type</th>
                      <th class="py-3 px-4 text-xs font-semibold text-gray-500 uppercase text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in payroll.items" :key="item.id" class="border-b border-gray-100 hover:bg-gray-50">
                      <td class="py-3 px-4 text-sm font-medium text-gray-900">{{ item.name }}</td>
                      <td class="py-3 px-4">
                        <span 
                          class="inline-flex px-2 py-0.5 text-xs font-semibold rounded text-white"
                          :class="item.type === 'earning' ? 'bg-green-500' : 'bg-red-500'"
                        >
                          {{ item.type === 'earning' ? 'Earning' : 'Deduction' }}
                        </span>
                      </td>
                      <td class="py-3 px-4 text-sm font-semibold text-right" :class="item.type === 'earning' ? 'text-green-600' : 'text-red-600'">
                        {{ item.type === 'earning' ? '+' : '-' }}{{ formatCurrency(item.amount) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-else class="text-center py-8">
                <p class="text-gray-500">No specific items found for this payroll.</p>
              </div>
            </Card>
          </div>
        </div>
      </template>

      <!-- Not Found State -->
      <div v-else class="text-center py-20">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Payroll Not Found</h2>
        <p class="text-gray-600 mb-6">The payroll record you are looking for does not exist or has been removed.</p>
        <RouterLink
          to="/hrm/payrolls"
          class="inline-flex px-6 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors shadow-sm"
        >
          Back to Payrolls
        </RouterLink>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2'
import AppLayout from '../../layouts/AppLayout.vue'
import Card from '../../components/common/Card.vue'
import Skeleton from '../../components/common/Skeleton.vue'
import { CheckCircle, Calendar, Receipt, Clock, Download } from 'lucide-vue-next'

import { payrollRepository } from '../../repositories/hrm/payroll.repository'
import type { Payroll } from '../../services/hrm/types/payroll.types'

const route = useRoute()
const payroll = ref<Payroll | null>(null)
const isLoading = ref(true)
const isPaying = ref(false)

const loadPayrollDetail = async () => {
  const uuid = route.params.uuid as string
  if (!uuid) return

  isLoading.value = true
  try {
    const response = await payrollRepository.getPayrollDetail(uuid)
    payroll.value = response.data
  } catch (error) {
    console.error('Failed to load payroll details:', error)
    Swal.fire({
      title: 'Error!',
      text: 'Failed to load payroll details. Please go back and try again.',
      icon: 'error',
      confirmButtonColor: '#4f46e5',
    })
  } finally {
    isLoading.value = false
  }
}

const handleMarkAsPaid = async () => {
  if (!payroll.value) return

  const result = await Swal.fire({
    title: 'Mark as Paid?',
    text: 'This will finalize the payroll and mark it as paid. This action cannot be undone.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#10b981',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes, mark as paid'
  })

  if (result.isConfirmed) {
    isPaying.value = true
    try {
      const response = await payrollRepository.markAsPaid(payroll.value.uuid)
      payroll.value = response.data
      await Swal.fire({
        title: 'Success!',
        text: 'Payroll has been successfully marked as paid.',
        icon: 'success',
        confirmButtonColor: '#10b981',
      })
    } catch (error: any) {
      console.error('Failed to mark payroll as paid:', error)
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to mark payroll as paid. Please try again.',
        icon: 'error',
        confirmButtonColor: '#ef4444',
      })
    } finally {
      isPaying.value = false
    }
  }
}

const handleDownloadPayslip = async () => {
  if (!payroll.value) return
  
  try {
    const filename = `payslip-${payroll.value.employee?.emp_code || 'employee'}-${payroll.value.payroll_period?.name?.replace(/\s+/g, '-')}.pdf`
    await payrollRepository.downloadPayslip(payroll.value.uuid, filename)
  } catch (error) {
    console.error('Failed to download payslip:', error)
    Swal.fire({
      title: 'Error!',
      text: 'Failed to download payslip. Please try again.',
      icon: 'error',
      confirmButtonColor: '#ef4444',
    })
  }
}


const getInitials = (name: string) => {
  return (
    name
      .split(" ")
      .map((n) => n.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2) || "NA"
  );
};

const getStatusClass = (status: string | null) => {
  switch (status?.toLowerCase()) {
    case "paid":
      return "bg-green-50 text-green-700 border-green-200";
    case "draft":
    case "pending":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

const formatCurrency = (amount: string | number | undefined) => {
  if (amount === undefined || amount === null) return "Rp 0";
  const val = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(val);
};

const formatDate = (dateString: string | undefined | null) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

onMounted(() => {
  loadPayrollDetail()
})
</script>
