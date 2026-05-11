<template>
  <AppLayout>
    <!-- Header -->
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-gray-900 mb-2">Finance Dashboard</h2>
      <p class="text-gray-600">Pantau performa keuangan dan analisis AI perusahaan Anda</p>
    </div>

    <!-- Skeleton Loading State -->
    <div v-if="financeStore.isLoading" class="space-y-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card v-for="i in 4" :key="i" class="relative overflow-hidden">
          <div class="flex items-center justify-between">
            <div class="space-y-2">
              <Skeleton width="6rem" height="0.75rem" />
              <Skeleton width="4rem" height="2rem" />
            </div>
            <Skeleton width="3rem" height="3rem" borderRadius="0.5rem" />
          </div>
          <Skeleton width="8rem" height="0.75rem" customClass="mt-3" />
        </Card>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <Skeleton width="10rem" height="1.25rem" customClass="mb-6" />
          <Skeleton width="100%" height="200px" />
        </Card>
        <Card>
          <Skeleton width="10rem" height="1.25rem" customClass="mb-6" />
          <div class="space-y-3">
            <Skeleton v-for="i in 5" :key="i" width="100%" height="40px" />
          </div>
        </Card>
      </div>
    </div>

    <!-- Error State -->
    <Alert
      v-else-if="financeStore.error"
      :message="financeStore.error"
      class="mb-6"
    />

    <!-- Dashboard Content -->
    <div v-else-if="financeStore.dashboardData" class="space-y-8">
      <!-- KPI Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Total Revenue -->
        <Card class="relative overflow-hidden border-l-4 border-blue-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Revenue</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">
                {{ formatFullCurrency(financeStore.dashboardData?.summary?.total_revenue || 0) }}
              </p>
            </div>
            <div class="h-12 w-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>

        <!-- Total Expense -->
        <Card class="relative overflow-hidden border-l-4 border-red-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Expense</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">
                {{ formatFullCurrency(financeStore.dashboardData?.summary?.total_expense || 0) }}
              </p>
            </div>
            <div class="h-12 w-12 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>

        <!-- Net Profit -->
        <Card class="relative overflow-hidden border-l-4 border-green-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Net Profit</p>
              <p class="text-2xl font-bold text-gray-900 mt-1" :class="(financeStore.dashboardData?.summary?.net_profit || 0) >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ formatFullCurrency(financeStore.dashboardData?.summary?.net_profit || 0) }}
              </p>
            </div>
            <div class="h-12 w-12 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </Card>

        <!-- Profit Margin -->
        <Card class="relative overflow-hidden border-l-4 border-purple-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Profit Margin</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">
                {{ (financeStore.dashboardData?.summary?.profit_margin || 0).toFixed(2) }}%
              </p>
            </div>
            <div class="h-12 w-12 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      <!-- Trends & Transactions -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Monthly Trends -->
        <Card>
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900">Monthly Trends</h3>
            <span class="text-xs text-gray-500">Last 12 Months</span>
          </div>
          <div class="space-y-4">
            <div v-for="trend in financeStore.dashboardData?.monthly_trends || []" :key="trend.month" class="space-y-2">
              <div class="flex justify-between text-xs font-medium">
                <span class="text-gray-600">{{ trend.month }}</span>
                <span class="text-gray-900">{{ formatFullCurrency(trend.revenue) }}</span>
              </div>
              <div class="relative h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  class="absolute left-0 top-0 h-full bg-blue-500" 
                  :style="{ width: getTrendPercentage(trend.revenue, trend.expense) + '%' }"
                ></div>
              </div>
              <div class="flex justify-end text-[10px] text-gray-400">
                Expense: {{ formatFullCurrency(trend.expense) }}
              </div>
            </div>
          </div>
        </Card>

        <!-- Recent Transactions -->
        <Card>
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900">Recent Transactions</h3>
            <router-link to="/finance/ledger/items" class="text-sm text-blue-600 hover:underline">View All</router-link>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="tx in financeStore.dashboardData?.recent_transactions || []" :key="tx.uuid">
                  <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{{ tx.record_date }}</td>
                  <td class="px-4 py-4 text-sm text-gray-900">{{ tx.description }}</td>
                  <td class="px-4 py-4 whitespace-nowrap text-sm text-right font-semibold" :class="tx.type === 'revenue' ? 'text-green-600' : 'text-red-600'">
                    {{ tx.type === 'revenue' ? '+' : '-' }}{{ formatFullCurrency(tx.amount) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useFinanceStore } from '@/stores/finance'
import AppLayout from '@/layouts/AppLayout.vue'
import Card from '@/components/common/Card.vue'
import Alert from '@/components/common/Alert.vue'
import Skeleton from '@/components/common/Skeleton.vue'

const financeStore = useFinanceStore()

const formatFullCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value)
}

const getTrendPercentage = (rev: number, exp: number) => {
  const total = rev + exp
  if (total === 0) return 0
  return (rev / total) * 100
}

onMounted(async () => {
  await financeStore.fetchDashboard()
})
</script>
