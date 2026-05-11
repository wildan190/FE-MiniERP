<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Financial Reports</h1>
        <p class="text-gray-600 mt-1">IFRS-compliant financial statements and reports</p>
      </div>

      <!-- Tab Navigation -->
      <div class="flex space-x-1 bg-gray-100 p-1 rounded-xl mb-8 w-full md:w-fit">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'px-6 py-2.5 text-sm font-medium rounded-lg transition-all duration-200',
            activeTab === tab.id
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
          ]"
        >
          {{ tab.name }}
        </button>
      </div>

      <!-- Report Content -->
      <div class="space-y-6">
        <!-- Date Filters -->
        <Card class="flex flex-col md:flex-row items-end gap-4">
          <div class="w-full md:w-48">
            <label class="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Start Date</label>
            <input type="date" v-model="startDate" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
          </div>
          <div class="w-full md:w-48">
            <label class="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">End Date</label>
            <input type="date" v-model="endDate" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
          </div>
          <button 
            @click="refreshReport"
            class="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium h-[38px]"
          >
            Update Report
          </button>
        </Card>

        <!-- Loading State -->
        <Card v-if="financeStore.isLoading">
          <div class="space-y-4">
            <Skeleton width="100%" height="300px" />
          </div>
        </Card>

        <!-- P&L Report -->
        <div v-else-if="activeTab === 'pl' && financeStore.reports.profitLoss" class="space-y-6">
          <Card>
            <div class="flex justify-between items-start mb-8">
              <div>
                <h3 class="text-xl font-bold text-gray-900">Profit & Loss Statement</h3>
                <p class="text-sm text-gray-500">Period: {{ startDate }} to {{ endDate }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-gray-500 uppercase">Net Profit</p>
                <p class="text-3xl font-bold text-green-600">{{ formatCurrency(financeStore.reports.profitLoss.net_profit) }}</p>
              </div>
            </div>

            <!-- Revenue Section -->
            <div class="mb-8">
              <h4 class="text-sm font-bold text-gray-900 border-b pb-2 mb-4 uppercase tracking-widest">Revenue</h4>
              <div class="space-y-2">
                <div v-for="item in financeStore.reports.profitLoss.revenue" :key="item.name" class="flex justify-between text-sm py-1">
                  <span class="text-gray-600">{{ item.name }}</span>
                  <span class="font-medium text-gray-900">{{ formatCurrency(item.amount) }}</span>
                </div>
                <div class="flex justify-between text-sm font-bold pt-4 border-t border-gray-100">
                  <span>Total Revenue</span>
                  <span>{{ formatCurrency(financeStore.reports.profitLoss.total_revenue) }}</span>
                </div>
              </div>
            </div>

            <!-- Expense Section -->
            <div>
              <h4 class="text-sm font-bold text-gray-900 border-b pb-2 mb-4 uppercase tracking-widest">Expenses</h4>
              <div class="space-y-2">
                <div v-for="item in financeStore.reports.profitLoss.expense" :key="item.name" class="flex justify-between text-sm py-1">
                  <span class="text-gray-600">{{ item.name }}</span>
                  <span class="font-medium text-gray-900">{{ formatCurrency(item.amount) }}</span>
                </div>
                <div class="flex justify-between text-sm font-bold pt-4 border-t border-gray-100">
                  <span>Total Expenses</span>
                  <span>{{ formatCurrency(financeStore.reports.profitLoss.total_expense) }}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <!-- Balance Sheet Report -->
        <div v-else-if="activeTab === 'bs' && financeStore.reports.balanceSheet" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Assets -->
          <Card>
            <h3 class="text-lg font-bold text-gray-900 mb-6 uppercase tracking-wider">Assets</h3>
            <div class="space-y-3">
              <div v-for="item in financeStore.reports.balanceSheet.assets" :key="item.name" class="flex justify-between text-sm">
                <span class="text-gray-600">{{ item.name }}</span>
                <span class="font-medium">{{ formatCurrency(item.amount) }}</span>
              </div>
              <div class="pt-4 border-t font-bold flex justify-between">
                <span>Total Assets</span>
                <span>{{ formatCurrency(financeStore.reports.balanceSheet.total_assets) }}</span>
              </div>
            </div>
          </Card>

          <!-- Liabilities & Equity -->
          <div class="space-y-6">
            <Card>
              <h3 class="text-lg font-bold text-gray-900 mb-6 uppercase tracking-wider">Liabilities</h3>
              <div class="space-y-3">
                <div v-for="item in financeStore.reports.balanceSheet.liabilities" :key="item.name" class="flex justify-between text-sm">
                  <span class="text-gray-600">{{ item.name }}</span>
                  <span class="font-medium">{{ formatCurrency(item.amount) }}</span>
                </div>
                <div class="pt-4 border-t font-bold flex justify-between">
                  <span>Total Liabilities</span>
                  <span>{{ formatCurrency(financeStore.reports.balanceSheet.total_liabilities) }}</span>
                </div>
              </div>
            </Card>
            <Card>
              <h3 class="text-lg font-bold text-gray-900 mb-6 uppercase tracking-wider">Equity</h3>
              <div class="space-y-3">
                <div v-for="item in financeStore.reports.balanceSheet.equity" :key="item.name" class="flex justify-between text-sm">
                  <span class="text-gray-600">{{ item.name }}</span>
                  <span class="font-medium">{{ formatCurrency(item.amount) }}</span>
                </div>
                <div class="pt-4 border-t font-bold flex justify-between">
                  <span>Total Equity</span>
                  <span>{{ formatCurrency(financeStore.reports.balanceSheet.total_equity) }}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <!-- Cash Flow Report -->
        <div v-else-if="activeTab === 'cf' && financeStore.reports.cashFlow" class="space-y-6">
          <Card>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div class="p-4 bg-blue-50 rounded-lg">
                <p class="text-xs font-medium text-blue-600 uppercase mb-1">Operating</p>
                <p class="text-xl font-bold">{{ formatCurrency(financeStore.reports.cashFlow.operating_activities) }}</p>
              </div>
              <div class="p-4 bg-purple-50 rounded-lg">
                <p class="text-xs font-medium text-purple-600 uppercase mb-1">Investing</p>
                <p class="text-xl font-bold">{{ formatCurrency(financeStore.reports.cashFlow.investing_activities) }}</p>
              </div>
              <div class="p-4 bg-orange-50 rounded-lg">
                <p class="text-xs font-medium text-orange-600 uppercase mb-1">Financing</p>
                <p class="text-xl font-bold">{{ formatCurrency(financeStore.reports.cashFlow.financing_activities) }}</p>
              </div>
              <div class="p-4 bg-green-50 rounded-lg">
                <p class="text-xs font-medium text-green-600 uppercase mb-1">Net Cash Flow</p>
                <p class="text-xl font-bold">{{ formatCurrency(financeStore.reports.cashFlow.net_cash_flow) }}</p>
              </div>
            </div>

            <h4 class="text-sm font-bold text-gray-900 border-b pb-2 mb-4 uppercase tracking-widest">Cash Flow Details</h4>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                    <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr v-for="(detail, idx) in financeStore.reports.cashFlow.details" :key="idx">
                    <td class="px-4 py-3 text-sm text-gray-600">{{ detail.date }}</td>
                    <td class="px-4 py-3 text-sm text-gray-900">{{ detail.description }}</td>
                    <td class="px-4 py-3 text-sm text-right font-medium" :class="detail.amount >= 0 ? 'text-green-600' : 'text-red-600'">
                      {{ formatCurrency(detail.amount) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useFinanceStore } from '@/stores/finance'
import AppLayout from '@/layouts/AppLayout.vue'
import Card from '@/components/common/Card.vue'
import Skeleton from '@/components/common/Skeleton.vue'

const financeStore = useFinanceStore()
const activeTab = ref('pl')
const startDate = ref(new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0])
const endDate = ref(new Date().toISOString().split('T')[0])

const tabs = [
  { id: 'pl', name: 'Profit & Loss' },
  { id: 'bs', name: 'Balance Sheet' },
  { id: 'cf', name: 'Cash Flow' }
]

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value)
}

const refreshReport = async () => {
  if (activeTab.value === 'pl') {
    await financeStore.fetchProfitLoss(startDate.value, endDate.value)
  } else if (activeTab.value === 'bs') {
    await financeStore.fetchBalanceSheet(endDate.value)
  } else if (activeTab.value === 'cf') {
    await financeStore.fetchCashFlow(startDate.value, endDate.value)
  }
}

watch(activeTab, refreshReport)

onMounted(refreshReport)
</script>
