<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">HRM Reports</h1>
          <p class="text-gray-600 mt-1">Analytics and statistics for your workforce</p>
        </div>
        <!-- Year Filter -->
        <div class="flex items-center gap-3">
          <label class="text-sm font-medium text-gray-700">Year:</label>
          <select
            v-model="selectedYear"
            @change="loadAll"
            class="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option v-for="y in availableYears" :key="y" :value="y">{{ y }}</option>
          </select>
          <button
            @click="loadAll"
            :disabled="isLoadingAll"
            class="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw class="h-4 w-4" :class="{ 'animate-spin': isLoadingAll }" />
            Refresh
          </button>
        </div>
      </div>

      <!-- =========== TURNOVER SECTION =========== -->
      <section class="mb-10">
        <div class="flex items-center gap-3 mb-5">
          <div class="h-9 w-9 rounded-xl bg-primary-100 flex items-center justify-center">
            <TrendingUp class="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <h2 class="text-lg font-bold text-gray-900">Turnover Statistics</h2>
            <p v-if="turnover" class="text-xs text-gray-500">
              Period: {{ formatDate(turnover.period.start) }} – {{ formatDate(turnover.period.end) }}
            </p>
          </div>
        </div>

        <div v-if="reportStore.loadingTurnover" class="flex justify-center py-10">
          <Spinner />
        </div>

        <div v-else-if="turnover" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatCard
            label="Joined"
            :value="turnover.joined"
            color="emerald"
            icon="UserPlus"
          />
          <StatCard
            label="Resigned"
            :value="turnover.resigned"
            color="amber"
            icon="LogOut"
          />
          <StatCard
            label="Terminated"
            :value="turnover.terminated"
            color="red"
            icon="UserMinus"
          />
          <StatCard
            label="Total Leavers"
            :value="turnover.total_leavers"
            color="orange"
            icon="Users"
          />
          <StatCard
            label="Net Change"
            :value="turnover.net_change"
            :color="turnover.net_change >= 0 ? 'emerald' : 'red'"
            icon="TrendingUp"
            :show-sign="true"
          />
        </div>

        <!-- Turnover Bar Visualization -->
        <div v-if="turnover && !reportStore.loadingTurnover" class="mt-6 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 class="text-sm font-semibold text-gray-700 mb-4">Workforce Movement</h3>
          <div class="space-y-4">
            <div v-for="item in turnoverBars" :key="item.label" class="flex items-center gap-4">
              <div class="w-28 text-sm text-gray-600 text-right flex-shrink-0">{{ item.label }}</div>
              <div class="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                <div
                  :style="{ width: `${item.pct}%` }"
                  :class="item.color"
                  class="h-8 rounded-full flex items-center pl-3 text-white text-xs font-semibold transition-all duration-700"
                >
                  <span v-if="item.pct > 10">{{ item.value }}</span>
                </div>
              </div>
              <div class="w-8 text-sm font-bold" :class="item.textColor">{{ item.value }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- =========== LABOR COST SECTION =========== -->
      <section>
        <div class="flex items-center gap-3 mb-5">
          <div class="h-9 w-9 rounded-xl bg-violet-100 flex items-center justify-center">
            <DollarSign class="h-5 w-5 text-violet-600" />
          </div>
          <div>
            <h2 class="text-lg font-bold text-gray-900">Labor Cost Statistics</h2>
            <p class="text-xs text-gray-500">Payroll analysis for {{ selectedYear }}</p>
          </div>
        </div>

        <div v-if="reportStore.loadingLaborCost" class="flex justify-center py-10">
          <Spinner />
        </div>

        <div v-else-if="laborCost" class="space-y-6">
          <!-- Summary Card -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card class="sm:col-span-1">
              <div class="text-center">
                <p class="text-sm text-gray-500">Total Year Cost</p>
                <p class="text-3xl font-bold text-violet-600 mt-1">{{ formatCurrency(laborCost.total_year_cost) }}</p>
              </div>
            </Card>
            <Card class="sm:col-span-1">
              <div class="text-center">
                <p class="text-sm text-gray-500">Months Recorded</p>
                <p class="text-3xl font-bold text-gray-900 mt-1">{{ laborCost.monthly_costs.length }}</p>
              </div>
            </Card>
            <Card class="sm:col-span-1">
              <div class="text-center">
                <p class="text-sm text-gray-500">Departments</p>
                <p class="text-3xl font-bold text-gray-900 mt-1">{{ laborCost.department_costs.length }}</p>
              </div>
            </Card>
          </div>

          <!-- Monthly Chart -->
          <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 class="text-sm font-semibold text-gray-700 mb-4">Monthly Cost Breakdown</h3>
            <div v-if="laborCost.monthly_costs.length === 0" class="text-center py-8">
              <BarChart3 class="h-10 w-10 text-gray-300 mx-auto mb-2" />
              <p class="text-sm text-gray-500">No monthly cost data available for {{ selectedYear }}</p>
            </div>
            <div v-else class="space-y-3">
              <div v-for="month in laborCost.monthly_costs" :key="month.month" class="flex items-center gap-4">
                <div class="w-24 text-sm text-gray-600 text-right flex-shrink-0">{{ month.month_name }}</div>
                <div class="flex-1 bg-gray-100 rounded-full h-7 overflow-hidden">
                  <div
                    :style="{ width: `${getMonthBarPct(month.total_cost)}%` }"
                    class="h-7 rounded-full bg-violet-500 flex items-center pl-3 text-white text-xs font-semibold transition-all duration-700"
                  >
                    <span v-if="getMonthBarPct(month.total_cost) > 15">{{ formatCurrency(month.total_cost) }}</span>
                  </div>
                </div>
                <div class="w-28 text-sm font-medium text-gray-700 text-right">{{ formatCurrency(month.total_cost) }}</div>
              </div>
            </div>
          </div>

          <!-- Department Cost Table -->
          <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100">
              <h3 class="text-sm font-semibold text-gray-700">Cost by Department</h3>
            </div>
            <div v-if="laborCost.department_costs.length === 0" class="text-center py-8">
              <Building2 class="h-10 w-10 text-gray-300 mx-auto mb-2" />
              <p class="text-sm text-gray-500">No department cost data available</p>
            </div>
            <table v-else class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Employees</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total Cost</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Avg / Employee</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="dept in laborCost.department_costs" :key="dept.department_id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ dept.department_name }}</td>
                  <td class="px-6 py-4 text-sm text-gray-600 text-right">{{ dept.employee_count }}</td>
                  <td class="px-6 py-4 text-sm font-semibold text-gray-900 text-right">{{ formatCurrency(dept.total_cost) }}</td>
                  <td class="px-6 py-4 text-sm text-gray-600 text-right">
                    {{ dept.employee_count > 0 ? formatCurrency(dept.total_cost / dept.employee_count) : '-' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AppLayout from '../layouts/AppLayout.vue'
import Card from '../components/common/Card.vue'
import Spinner from '../components/common/Spinner.vue'
import { TrendingUp, DollarSign, RefreshCw, BarChart3, Building2, UserPlus, LogOut, UserMinus, Users } from 'lucide-vue-next'
import { useHrmReportStore } from '../stores/hrm-report'
import type { TurnoverStatistics, LaborCostStatistics } from '../services/hrm/types/hrm-report.types'

// Inline stat card to keep it simple
const StatCard = {
  props: ['label', 'value', 'color', 'icon', 'showSign'],
  template: `
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-5 text-center">
      <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">{{ label }}</p>
      <p class="text-3xl font-extrabold" :class="'text-' + color + '-600'">
        {{ showSign && value > 0 ? '+' : '' }}{{ value }}
      </p>
    </div>
  `,
}

const reportStore = useHrmReportStore()

const currentYear = new Date().getFullYear()
const selectedYear = ref(currentYear)
const availableYears = computed(() => {
  const years = []
  for (let y = currentYear; y >= currentYear - 4; y--) years.push(y)
  return years
})

const turnover = ref<TurnoverStatistics | null>(null)
const laborCost = ref<LaborCostStatistics | null>(null)
const isLoadingAll = ref(false)

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount)

// Turnover bar data
const maxTurnoverVal = computed(() => {
  if (!turnover.value) return 1
  return Math.max(turnover.value.joined, turnover.value.resigned, turnover.value.terminated, 1)
})

const turnoverBars = computed(() => {
  if (!turnover.value) return []
  const tv = turnover.value
  const max = maxTurnoverVal.value
  return [
    { label: 'Joined', value: tv.joined, pct: (tv.joined / max) * 100, color: 'bg-emerald-500', textColor: 'text-emerald-600' },
    { label: 'Resigned', value: tv.resigned, pct: (tv.resigned / max) * 100, color: 'bg-amber-500', textColor: 'text-amber-600' },
    { label: 'Terminated', value: tv.terminated, pct: (tv.terminated / max) * 100, color: 'bg-red-500', textColor: 'text-red-600' },
    { label: 'Total Leavers', value: tv.total_leavers, pct: (tv.total_leavers / max) * 100, color: 'bg-orange-500', textColor: 'text-orange-600' },
  ]
})

// Monthly bar percentage
const maxMonthlyCost = computed(() => {
  if (!laborCost.value || laborCost.value.monthly_costs.length === 0) return 1
  return Math.max(...laborCost.value.monthly_costs.map((m) => m.total_cost), 1)
})

const getMonthBarPct = (cost: number) => (cost / maxMonthlyCost.value) * 100

const loadAll = async () => {
  isLoadingAll.value = true
  try {
    await Promise.all([
      reportStore.fetchTurnoverStatistics(selectedYear.value),
      reportStore.fetchLaborCostStatistics(selectedYear.value),
    ])
    turnover.value = reportStore.turnover
    laborCost.value = reportStore.laborCost
  } catch (err) {
    console.error('Failed to load reports:', err)
  } finally {
    isLoadingAll.value = false
  }
}

onMounted(() => {
  loadAll()
})
</script>
