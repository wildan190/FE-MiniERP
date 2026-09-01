<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 py-8 space-y-10">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <div class="p-2.5 bg-primary-50 rounded-2xl text-primary-600">
              <Award class="h-7 w-7" />
            </div>
            HRM Reports &amp; Employee KPI Analytics
          </h1>
          <p class="text-gray-500 text-sm mt-1">
            Data-driven workforce analytics, attendance discipline, project task delivery, and individual KPI performance.
          </p>
        </div>
        <!-- Year Filter -->
        <div class="flex items-center gap-3">
          <label class="text-sm font-semibold text-gray-700">Period:</label>
          <select
            v-model="selectedYear"
            @change="loadAll"
            class="px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white shadow-xs"
          >
            <option v-for="y in availableYears" :key="y" :value="y">Year {{ y }}</option>
          </select>
          <button
            @click="loadAll"
            :disabled="isLoadingAll"
            class="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 disabled:opacity-50 transition-all shadow-xs"
          >
            <RefreshCw class="h-4 w-4" :class="{ 'animate-spin': isLoadingAll }" />
            Refresh Data
          </button>
        </div>
      </div>

      <!-- =========== EMPLOYEE KPI & PERFORMANCE SECTION =========== -->
      <section class="space-y-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="h-10 w-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Sparkles class="h-5 w-5" />
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-900">Individual Employee KPI Performance</h2>
              <p class="text-xs text-gray-500">
                Calculated dynamically from attendance rates (40%), task completion (40%), and project workload (20%).
              </p>
            </div>
          </div>
          <!-- KPI Search & Grade Filter -->
          <div class="flex items-center gap-3">
            <input
              v-model="kpiSearch"
              type="text"
              placeholder="Search employee or dept..."
              class="px-3.5 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
          </div>
        </div>

        <!-- KPI Summary Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-gradient-to-br from-indigo-500 to-primary-600 rounded-3xl p-5 text-white shadow-sm flex flex-col justify-between">
            <p class="text-xs font-bold text-indigo-100 uppercase tracking-wider">Average Company KPI</p>
            <div class="my-2 flex items-baseline gap-2">
              <span class="text-4xl font-black">{{ reportStore.kpi?.average_kpi_score || 0 }}</span>
              <span class="text-indigo-200 text-sm font-semibold">/ 100</span>
            </div>
            <p class="text-[11px] text-indigo-100">Evaluated across {{ reportStore.kpi?.total_evaluated || 0 }} active employees</p>
          </div>

          <div class="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm flex items-center gap-4">
            <div class="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl">
              <Trophy class="h-6 w-6" />
            </div>
            <div>
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Top Performer</p>
              <p class="text-base font-extrabold text-gray-900 mt-0.5 truncate max-w-[150px]">
                {{ reportStore.kpi?.top_performers?.[0]?.full_name || '—' }}
              </p>
              <p class="text-xs text-emerald-600 font-bold">
                Score: {{ reportStore.kpi?.top_performers?.[0]?.overall_score || 0 }} (Grade {{ reportStore.kpi?.top_performers?.[0]?.grade || '-' }})
              </p>
            </div>
          </div>

          <div class="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm flex items-center gap-4">
            <div class="p-3.5 bg-blue-50 text-blue-600 rounded-2xl">
              <CheckCircle2 class="h-6 w-6" />
            </div>
            <div>
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Attendance High Score</p>
              <p class="text-base font-extrabold text-gray-900 mt-0.5">
                {{ filteredKpis.filter(k => k.attendance_stats.score >= 90).length }} Employees
              </p>
              <p class="text-xs text-gray-500 font-medium">&ge; 90% attendance discipline</p>
            </div>
          </div>

          <div class="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm flex items-center gap-4">
            <div class="p-3.5 bg-amber-50 text-amber-600 rounded-2xl">
              <AlertCircle class="h-6 w-6" />
            </div>
            <div>
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Needs Attention</p>
              <p class="text-base font-extrabold text-amber-600 mt-0.5">
                {{ reportStore.kpi?.needs_attention?.length || 0 }} Employees
              </p>
              <p class="text-xs text-gray-500 font-medium">Overall score &lt; 70 pts</p>
            </div>
          </div>
        </div>

        <!-- KPI Detailed Table -->
        <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="p-5 border-b border-gray-50 flex items-center justify-between">
            <h3 class="font-bold text-gray-900 text-base">Employee KPI Scorecard &amp; Metrics</h3>
            <span class="text-xs text-gray-400 font-medium">Showing {{ filteredKpis.length }} employee(s)</span>
          </div>

          <div v-if="reportStore.loadingKpi" class="p-12 text-center text-gray-400">
            <RefreshCw class="h-8 w-8 animate-spin mx-auto text-primary-500 mb-2" />
            <p class="text-sm">Calculating KPI scores from attendance, tasks, and project allocations...</p>
          </div>

          <div v-else class="overflow-x-auto custom-scrollbar">
            <table class="w-full text-left min-w-[900px]">
              <thead>
                <tr class="bg-gray-50/60 border-b border-gray-100">
                  <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Employee</th>
                  <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Department &amp; Role</th>
                  <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Attendance (40%)</th>
                  <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Task Delivery (40%)</th>
                  <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Projects / Workload</th>
                  <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">KPI Score</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50">
                <tr v-for="emp in filteredKpis" :key="emp.employee_uuid" class="hover:bg-gray-50/60 transition-colors">
                  <!-- Employee Profile -->
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div class="h-10 w-10 rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-600 text-white font-black flex items-center justify-center text-sm shadow-xs">
                        {{ emp.full_name?.charAt(0) || 'E' }}
                      </div>
                      <div>
                        <p class="text-sm font-bold text-gray-900 leading-snug">{{ emp.full_name }}</p>
                        <p class="text-[11px] font-mono text-gray-400">{{ emp.emp_code }}</p>
                      </div>
                    </div>
                  </td>

                  <!-- Department & Role -->
                  <td class="px-6 py-4">
                    <p class="text-sm font-semibold text-gray-800">{{ emp.department }}</p>
                    <p class="text-xs text-gray-500">{{ emp.designation }}</p>
                  </td>

                  <!-- Attendance Score -->
                  <td class="px-6 py-4 text-center">
                    <div class="inline-flex flex-col items-center">
                      <span class="text-xs font-bold text-gray-900">{{ emp.attendance_stats.score }}%</span>
                      <span class="text-[10px] text-gray-400">
                        {{ emp.attendance_stats.present }} Present · {{ emp.attendance_stats.late }} Late · {{ emp.attendance_stats.absent }} Absent
                      </span>
                    </div>
                  </td>

                  <!-- Task Delivery -->
                  <td class="px-6 py-4 text-center">
                    <div class="inline-flex flex-col items-center">
                      <span class="text-xs font-bold text-gray-900">{{ emp.task_stats.completion_rate }}%</span>
                      <span class="text-[10px] text-gray-400">
                        {{ emp.task_stats.completed }} / {{ emp.task_stats.total_assigned }} Tasks Done
                      </span>
                    </div>
                  </td>

                  <!-- Projects & Allocation -->
                  <td class="px-6 py-4 text-center">
                    <div class="inline-flex flex-col items-center">
                      <span class="text-xs font-bold text-gray-900">{{ emp.workload_stats.active_projects }} Project(s)</span>
                      <span class="text-[10px] font-semibold text-primary-600">
                        {{ emp.workload_stats.allocation_pct }}% Allocated
                      </span>
                    </div>
                  </td>

                  <!-- KPI Score & Badge -->
                  <td class="px-6 py-4 text-right">
                    <div class="flex items-center justify-end gap-2.5">
                      <div>
                        <span class="text-lg font-black text-gray-900 leading-none">{{ emp.overall_score }}</span>
                        <p class="text-[10px] text-gray-400 font-medium">{{ emp.rating }}</p>
                      </div>
                      <span
                        class="px-2.5 py-1 rounded-xl text-xs font-extrabold uppercase shadow-2xs"
                        :class="{
                          'bg-emerald-100 text-emerald-800': emp.overall_score >= 80,
                          'bg-blue-100 text-blue-800': emp.overall_score >= 70 && emp.overall_score < 80,
                          'bg-amber-100 text-amber-800': emp.overall_score >= 60 && emp.overall_score < 70,
                          'bg-rose-100 text-rose-800': emp.overall_score < 60
                        }"
                      >
                        {{ emp.grade }}
                      </span>
                    </div>
                  </td>
                </tr>

                <tr v-if="!filteredKpis.length">
                  <td colspan="6" class="px-6 py-12 text-center text-gray-400 italic">
                    No active employees matching criteria.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- =========== TURNOVER SECTION =========== -->
      <section class="space-y-6 pt-6 border-t border-gray-100">
        <div class="flex items-center gap-3">
          <div class="h-10 w-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <TrendingUp class="h-5 w-5" />
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900">Turnover Statistics</h2>
            <p v-if="turnover" class="text-xs text-gray-500">
              Period: {{ formatDate(turnover.period.start) }} – {{ formatDate(turnover.period.end) }}
            </p>
          </div>
        </div>

        <div v-if="reportStore.loadingTurnover" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div v-for="i in 5" :key="i" class="bg-white p-5 rounded-2xl border border-gray-100 animate-pulse h-24"></div>
        </div>

        <div v-else-if="turnover" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatCard label="Joined" :value="turnover.joined" color="emerald" />
          <StatCard label="Resigned" :value="turnover.resigned" color="amber" />
          <StatCard label="Terminated" :value="turnover.terminated" color="red" />
          <StatCard label="Total Leavers" :value="turnover.total_leavers" color="orange" />
          <StatCard label="Net Change" :value="turnover.net_change" :color="turnover.net_change >= 0 ? 'emerald' : 'red'" :showSign="true" />
        </div>
      </section>

      <!-- =========== LABOR COST SECTION =========== -->
      <section class="space-y-6 pt-6 border-t border-gray-100">
        <div class="flex items-center gap-3">
          <div class="h-10 w-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
            <DollarSign class="h-5 w-5" />
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900">Labor Cost &amp; Payroll Analytics</h2>
            <p class="text-xs text-gray-500">Total payroll expenditures categorized by department.</p>
          </div>
        </div>

        <div v-if="laborCost" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Total Year Cost -->
          <div class="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between">
            <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Annual Labor Cost</p>
            <h3 class="text-3xl font-black text-gray-900 mt-2">{{ formatCurrency(laborCost.total_year_cost) }}</h3>
            <p class="text-xs text-gray-400 mt-2">Aggregated Net Salaries across all active pay periods in {{ selectedYear }}.</p>
          </div>

          <!-- Department Cost Table -->
          <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-50">
              <h3 class="font-bold text-gray-900 text-sm">Department Cost Breakdown</h3>
            </div>
            <table class="w-full text-left">
              <thead>
                <tr class="bg-gray-50/60 border-b border-gray-100">
                  <th class="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest">Department</th>
                  <th class="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Total Cost</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50">
                <tr v-for="dept in laborCost.department_costs" :key="dept.department_name" class="hover:bg-gray-50/50">
                  <td class="px-6 py-3 text-sm font-semibold text-gray-800">{{ dept.department_name }}</td>
                  <td class="px-6 py-3 text-sm font-bold text-gray-900 text-right">{{ formatCurrency(dept.total_cost) }}</td>
                </tr>
                <tr v-if="!laborCost.department_costs.length">
                  <td colspan="2" class="px-6 py-8 text-center text-gray-400 italic text-xs">No payroll records found for this year.</td>
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
import { ref, computed, onMounted, h } from 'vue'
import AppLayout from '@/layouts/AppLayout.vue'
import { 
  Award, 
  Sparkles, 
  Trophy, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  DollarSign, 
  RefreshCw 
} from 'lucide-vue-next'
import { useHrmReportStore } from '@/stores/hrm-report'
import type { TurnoverStatistics, LaborCostStatistics } from '@/services/hrm/types/hrm-report.types'

const StatCard = (props: { label: string; value: number; color: string; showSign?: boolean }) => {
  const colorMap: Record<string, string> = {
    emerald: 'text-emerald-600',
    amber: 'text-amber-600',
    red: 'text-red-600',
    orange: 'text-orange-600',
    violet: 'text-violet-600',
  }
  const colorClass = colorMap[props.color] || 'text-gray-900'
  const displayVal = (props.showSign && props.value > 0 ? '+' : '') + props.value

  return h('div', { class: 'bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center' }, [
    h('p', { class: 'text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5' }, props.label),
    h('p', { class: `text-3xl font-black ${colorClass}` }, displayVal),
  ])
}

const reportStore = useHrmReportStore()

const currentYear = new Date().getFullYear()
const selectedYear = ref(currentYear)
const kpiSearch = ref('')
const availableYears = computed(() => {
  const years = []
  for (let y = currentYear; y >= currentYear - 4; y--) years.push(y)
  return years
})

const turnover = ref<TurnoverStatistics | null>(null)
const laborCost = ref<LaborCostStatistics | null>(null)
const isLoadingAll = ref(false)

const filteredKpis = computed(() => {
  const list = reportStore.kpi?.kpis || []
  if (!kpiSearch.value.trim()) return list
  const q = kpiSearch.value.toLowerCase()
  return list.filter((k: any) => 
    k.full_name?.toLowerCase().includes(q) ||
    k.department?.toLowerCase().includes(q) ||
    k.designation?.toLowerCase().includes(q) ||
    k.emp_code?.toLowerCase().includes(q)
  )
})

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount)

const loadAll = async () => {
  isLoadingAll.value = true
  try {
    await Promise.all([
      reportStore.fetchTurnoverStatistics(selectedYear.value),
      reportStore.fetchLaborCostStatistics(selectedYear.value),
      reportStore.fetchEmployeeKpiStatistics(selectedYear.value),
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

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #E5E7EB;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #D1D5DB;
}
</style>
