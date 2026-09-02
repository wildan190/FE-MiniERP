<template>
  <AppLayout>
    <!-- Header -->
    <div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
          <div class="p-2.5 bg-blue-50 rounded-2xl text-blue-600">
            <Landmark class="h-7 w-7" />
          </div>
          Finance Dashboard &amp; Approvals
        </h2>
        <p class="text-gray-500 text-sm mt-1">
          Monitor financial health, authorize pending project expenditures, and inspect ledger records.
        </p>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="refreshDashboard"
          class="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold rounded-xl shadow-xs flex items-center gap-2 text-sm transition-all"
        >
          <RefreshCw class="h-4 w-4 text-gray-500" :class="{ 'animate-spin': financeStore.isLoading }" />
          <span>Refresh</span>
        </button>
        <router-link
          to="/finance/settings"
          class="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold rounded-xl shadow-xs flex items-center gap-2 text-sm transition-all"
        >
          <Settings class="h-4 w-4 text-gray-500" />
          <span>Settings</span>
        </router-link>
      </div>
    </div>

    <!-- Skeleton Loading State -->
    <div v-if="financeStore.isLoading && !financeStore.dashboardData" class="space-y-8">
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
        <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">Realized Revenue</p>
            <p class="text-2xl font-black text-gray-900 mt-1">
              {{ formatFullCurrency(financeStore.dashboardData?.summary?.total_revenue || 0) }}
            </p>
            <p class="text-[11px] text-emerald-600 font-semibold mt-1">Verified income</p>
          </div>
          <div class="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp class="h-6 w-6" />
          </div>
        </div>

        <!-- Total Expense -->
        <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">Approved Expenses</p>
            <p class="text-2xl font-black text-gray-900 mt-1">
              {{ formatFullCurrency(financeStore.dashboardData?.summary?.total_expense || 0) }}
            </p>
            <p class="text-[11px] text-rose-600 font-semibold mt-1">Realized expenditures</p>
          </div>
          <div class="h-12 w-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <TrendingDown class="h-6 w-6" />
          </div>
        </div>

        <!-- Net Profit -->
        <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">Net Profit Margin</p>
            <p class="text-2xl font-black mt-1" :class="(financeStore.dashboardData?.summary?.net_profit || 0) >= 0 ? 'text-emerald-600' : 'text-rose-600'">
              {{ formatFullCurrency(financeStore.dashboardData?.summary?.net_profit || 0) }}
            </p>
            <p class="text-[11px] text-gray-400 font-semibold mt-1">
              {{ Math.round(financeStore.dashboardData?.summary?.profit_margin || 0) }}% Margin
            </p>
          </div>
          <div class="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Coins class="h-6 w-6" />
          </div>
        </div>

        <!-- Pending Approvals -->
        <div class="bg-gradient-to-br from-amber-500 to-orange-600 p-6 rounded-3xl text-white shadow-sm flex items-center justify-between">
          <div>
            <p class="text-xs font-bold text-amber-100 uppercase tracking-widest">Pending Approvals</p>
            <p class="text-3xl font-black text-white mt-1">
              {{ financeStore.dashboardData?.summary?.pending_approvals_count || 0 }}
            </p>
            <p class="text-[11px] text-amber-100 font-semibold mt-1">
              Rp {{ (financeStore.dashboardData?.summary?.pending_approvals_total || 0).toLocaleString('id-ID') }} awaits review
            </p>
          </div>
          <div class="h-12 w-12 rounded-2xl bg-white/20 text-white flex items-center justify-center">
            <Clock class="h-6 w-6" />
          </div>
        </div>
      </div>

      <!-- ================= PENDING EXPENSE APPROVALS (CLEAN & SIMPLE TABLE) ================= -->
      <section class="space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="h-10 w-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
              <ShieldAlert class="h-5 w-5" />
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-900">Pending Expense Approvals</h3>
              <p class="text-xs text-gray-500">
                Expenditures submitted by project managers and departments requiring Finance authorization before posting.
              </p>
            </div>
          </div>
          <span class="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-xl border border-amber-100">
            {{ pendingList.length }} Item(s) Need Action
          </span>
        </div>

        <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div v-if="pendingList.length === 0" class="p-12 text-center">
            <CheckCircle2 class="h-12 w-12 text-emerald-400 mx-auto mb-3" />
            <h4 class="font-bold text-gray-900 text-base">All Expenses Clear &amp; Approved!</h4>
            <p class="text-xs text-gray-400 mt-1">There are no pending project or departmental expense submissions awaiting authorization.</p>
          </div>

          <div v-else class="overflow-x-auto custom-scrollbar">
            <table class="w-full text-left min-w-[700px]">
              <thead>
                <tr class="bg-gray-50/60 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                  <th class="px-6 py-4">Item &amp; Category</th>
                  <th class="px-6 py-4">Project / Dept</th>
                  <th class="px-6 py-4">Requester &amp; Date</th>
                  <th class="px-6 py-4 text-right">Amount</th>
                  <th class="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50 text-sm">
                <tr v-for="rec in pendingList" :key="rec.uuid" class="hover:bg-gray-50/50 transition-colors">
                  <!-- Item & Category -->
                  <td class="px-6 py-4">
                    <div class="flex flex-col">
                      <span class="font-bold text-gray-900 leading-snug">
                        {{ rec.project_cost?.item_name || rec.category }}
                      </span>
                      <span class="text-xs text-gray-500 line-clamp-1 mt-0.5">
                        {{ rec.project_cost?.purpose || rec.description }}
                      </span>
                    </div>
                  </td>

                  <!-- Project / Dept -->
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-1.5">
                      <Building2 class="h-3.5 w-3.5 text-gray-400" />
                      <span class="text-xs font-semibold text-gray-800">
                        {{ rec.project_cost?.project_name || 'Departmental' }}
                      </span>
                    </div>
                  </td>

                  <!-- Requester & Date -->
                  <td class="px-6 py-4">
                    <p class="text-xs font-medium text-gray-900">
                      {{ rec.project_cost?.requested_by_name || 'Staff' }}
                    </p>
                    <p class="text-[10px] text-gray-400">{{ rec.record_date }}</p>
                  </td>

                  <!-- Amount -->
                  <td class="px-6 py-4 text-right">
                    <span class="font-extrabold text-gray-900 text-sm">
                      {{ formatFullCurrency(rec.amount) }}
                    </span>
                  </td>

                  <!-- Action: Show Details -->
                  <td class="px-6 py-4 text-center">
                    <button
                      @click="openDetailsModal(rec)"
                      class="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-xs transition-all inline-flex items-center gap-1.5 shadow-2xs"
                    >
                      <Eye class="h-3.5 w-3.5" />
                      Show Details
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- Monthly Trend & Recent Verified Transactions Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Monthly Breakdown -->
        <div class="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-gray-900 text-lg">Financial Performance Trend</h3>
            <button 
              @click="showAllTrends = !showAllTrends" 
              class="text-xs font-bold text-primary-600 hover:text-primary-700"
            >
              {{ showAllTrends ? 'Show Less' : 'View All' }}
            </button>
          </div>
          <div class="space-y-6">
            <div v-for="trend in displayedTrends" :key="trend.month" class="space-y-2">
              <div class="flex justify-between items-center text-sm">
                <span class="font-bold text-gray-800">{{ trend.month }}</span>
                <div class="flex items-center gap-3 text-xs">
                  <span class="text-emerald-600 font-semibold">+{{ formatFullCurrency(trend.revenue) }}</span>
                  <span class="text-rose-600 font-semibold">-{{ formatFullCurrency(trend.expense) }}</span>
                </div>
              </div>
              <div class="relative h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-1000" 
                  :style="{ width: getTrendPercentage(trend.revenue, trend.expense) + '%' }"
                ></div>
              </div>
            </div>
            <div v-if="!displayedTrends.length" class="text-center py-8 text-gray-400 italic">No trend data available.</div>
          </div>
        </div>

        <!-- Recent Transactions -->
        <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div class="p-6 border-b border-gray-50 flex items-center justify-between">
            <h3 class="font-bold text-gray-900 text-lg">Recent Financial Records</h3>
            <router-link to="/finance/ledger/items" class="text-xs font-bold text-primary-600 hover:text-primary-700">View Ledger</router-link>
          </div>
          <div class="overflow-x-auto flex-1 custom-scrollbar">
            <table class="w-full text-left">
              <thead>
                <tr class="bg-gray-50/60 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                  <th class="px-6 py-4">Date</th>
                  <th class="px-6 py-4">Description</th>
                  <th class="px-6 py-4">Status</th>
                  <th class="px-6 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50 text-sm">
                <tr v-for="tx in paginatedTransactions" :key="tx.uuid" class="hover:bg-gray-50/50">
                  <td class="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">{{ tx.record_date }}</td>
                  <td class="px-6 py-4">
                    <p class="font-medium text-gray-900 text-xs line-clamp-1">{{ tx.description }}</p>
                  </td>
                  <td class="px-6 py-4">
                    <span 
                      class="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider"
                      :class="{
                        'bg-emerald-100 text-emerald-700': tx.status === 'approved' || !tx.status,
                        'bg-amber-100 text-amber-700': tx.status === 'pending',
                        'bg-rose-100 text-rose-700': tx.status === 'rejected',
                      }"
                    >
                      {{ tx.status || 'approved' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-right font-bold text-xs whitespace-nowrap" :class="tx.type === 'revenue' ? 'text-emerald-600' : 'text-rose-600'">
                    {{ tx.type === 'revenue' ? '+' : '-' }}{{ formatFullCurrency(tx.amount) }}
                  </td>
                </tr>
                <tr v-if="!allTransactions.length">
                  <td colspan="4" class="px-6 py-12 text-center text-gray-400 italic">No transactions found.</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Pagination -->
          <div v-if="allTransactions.length > pageSize" class="flex items-center justify-between p-4 border-t border-gray-50">
            <p class="text-xs text-gray-400">
              Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ allTransactions.length }}
            </p>
            <div class="flex gap-1.5">
              <button 
                @click="currentPage--" 
                :disabled="currentPage === 1"
                class="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40"
              >
                <ChevronLeft class="h-3.5 w-3.5" />
              </button>
              <button 
                @click="currentPage++" 
                :disabled="currentPage === totalPages"
                class="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40"
              >
                <ChevronRight class="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ================= MODAL DETAILS & AUTHORIZATION ================= -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="isDetailsModalOpen && selectedRecord" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl animate-scale-up flex flex-col max-h-[90vh]">
            <!-- Header -->
            <div class="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-amber-50/40">
              <div class="flex items-center gap-3">
                <div class="h-10 w-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                  <FileText class="h-5 w-5" />
                </div>
                <div>
                  <h3 class="text-lg font-bold text-gray-900">Expense Authorization Details</h3>
                  <p class="text-xs text-gray-500">Review purchase details, requester, purpose, and total amount.</p>
                </div>
              </div>
              <button @click="closeDetailsModal" class="p-2 hover:bg-gray-200 rounded-xl transition-colors">
                <X class="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <!-- Body -->
            <div class="p-6 space-y-5 overflow-y-auto flex-1 custom-scrollbar">
              <!-- Amount Highlight Banner -->
              <div class="p-5 bg-gradient-to-br from-primary-50 to-indigo-50 border border-primary-100 rounded-2xl flex items-center justify-between">
                <div>
                  <p class="text-xs font-bold text-primary-700 uppercase tracking-wider">Total Expense Amount</p>
                  <p class="text-2xl font-black text-gray-900 mt-0.5">
                    {{ formatFullCurrency(selectedRecord.amount) }}
                  </p>
                </div>
                <span class="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-extrabold uppercase rounded-xl">
                  Pending Review
                </span>
              </div>

              <!-- Information Grid -->
              <div class="grid grid-cols-2 gap-4 text-xs">
                <!-- Item Name -->
                <div class="p-3.5 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-1">
                  <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ShoppingBag class="h-3 w-3" /> Item / Purchase
                  </span>
                  <p class="font-bold text-gray-900 text-sm">
                    {{ selectedRecord.project_cost?.item_name || selectedRecord.category }}
                  </p>
                </div>

                <!-- Category -->
                <div class="p-3.5 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-1">
                  <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers class="h-3 w-3" /> Category
                  </span>
                  <p class="font-bold text-gray-900 text-sm uppercase">
                    {{ selectedRecord.project_cost?.type || selectedRecord.category }}
                  </p>
                </div>

                <!-- Project -->
                <div class="p-3.5 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-1">
                  <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 class="h-3 w-3" /> Related Project
                  </span>
                  <p class="font-bold text-gray-900 text-sm">
                    {{ selectedRecord.project_cost?.project_name || 'Departmental Expense' }}
                  </p>
                </div>

                <!-- Quantity & Unit Price -->
                <div class="p-3.5 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-1">
                  <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Coins class="h-3 w-3" /> Qty &amp; Unit Price
                  </span>
                  <p class="font-bold text-gray-900 text-sm">
                    {{ selectedRecord.project_cost?.quantity || 1 }}x @ Rp {{ Number(selectedRecord.project_cost?.unit_price || selectedRecord.amount).toLocaleString('id-ID') }}
                  </p>
                </div>

                <!-- Requester -->
                <div class="p-3.5 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-1">
                  <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <User class="h-3 w-3" /> Submitted By
                  </span>
                  <p class="font-bold text-gray-900 text-sm">
                    {{ selectedRecord.project_cost?.requested_by_name || 'Staff' }}
                  </p>
                </div>

                <!-- Transaction Date -->
                <div class="p-3.5 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-1">
                  <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar class="h-3 w-3" /> Transaction Date
                  </span>
                  <p class="font-bold text-gray-900 text-sm">
                    {{ selectedRecord.record_date }}
                  </p>
                </div>
              </div>

              <!-- Purpose / Justification Box -->
              <div class="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1.5">
                <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <FileText class="h-3 w-3" /> Keperluan &amp; Justifikasi
                </span>
                <p class="text-xs text-gray-800 leading-relaxed font-medium">
                  {{ selectedRecord.project_cost?.purpose || selectedRecord.description }}
                </p>
              </div>

              <!-- Full Raw Description / Notes -->
              <div v-if="selectedRecord.project_cost?.notes" class="p-3 bg-gray-50/50 rounded-xl border border-gray-100 text-[11px] text-gray-500">
                <strong class="text-gray-700">Additional Notes:</strong> {{ selectedRecord.project_cost?.notes }}
              </div>
            </div>

            <!-- Footer Action Buttons -->
            <div class="p-6 border-t border-gray-100 bg-gray-50/50 flex gap-3">
              <button
                type="button"
                @click="closeDetailsModal"
                class="px-4 py-3 border border-gray-200 text-gray-600 rounded-2xl text-xs font-bold hover:bg-gray-100 transition-colors flex-1"
              >
                Close
              </button>
              <button
                type="button"
                @click="handleRejectFromModal"
                :disabled="actionLoading === selectedRecord.uuid"
                class="px-4 py-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-2xl text-xs font-bold hover:bg-rose-100 transition-all flex-1 flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <X class="h-4 w-4" /> Reject Expense
              </button>
              <button
                type="button"
                @click="handleApproveFromModal"
                :disabled="actionLoading === selectedRecord.uuid"
                class="px-4 py-3 bg-emerald-600 text-white rounded-2xl text-xs font-bold hover:bg-emerald-700 shadow-md shadow-emerald-200 transition-all flex-1 flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <Check class="h-4 w-4" /> Approve &amp; Post
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </AppLayout>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useFinanceStore } from '@/stores/finance'
import AppLayout from '@/layouts/AppLayout.vue'
import Card from '@/components/common/Card.vue'
import Alert from '@/components/common/Alert.vue'
import Skeleton from '@/components/common/Skeleton.vue'
import Swal from 'sweetalert2'
import { 
  ChevronLeft, 
  ChevronRight, 
  Settings, 
  RefreshCw, 
  Landmark, 
  TrendingUp, 
  TrendingDown, 
  Coins, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  Check, 
  X,
  Eye,
  ShoppingBag,
  Building2,
  FileText,
  User,
  Calendar,
  Layers
} from 'lucide-vue-next'

const financeStore = useFinanceStore()
const actionLoading = ref<string | null>(null)

// Modal Details State
const isDetailsModalOpen = ref(false)
const selectedRecord = ref<any | null>(null)

// Pagination State
const currentPage = ref(1)
const pageSize = ref(5)
const showAllTrends = ref(false)

const allTransactions = computed(() => financeStore.dashboardData?.recent_transactions || [])
const pendingList = computed(() => financeStore.dashboardData?.pending_approvals || [])
const totalPages = computed(() => Math.ceil(allTransactions.value.length / pageSize.value))
const startIndex = computed(() => (currentPage.value - 1) * pageSize.value)
const endIndex = computed(() => Math.min(startIndex.value + pageSize.value, allTransactions.value.length))

const paginatedTransactions = computed(() => {
  return allTransactions.value.slice(startIndex.value, endIndex.value)
})

const displayedTrends = computed(() => {
  const trends = financeStore.dashboardData?.monthly_trends || []
  return showAllTrends.value ? trends : trends.slice(0, 5)
})

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

const refreshDashboard = async () => {
  await financeStore.fetchDashboard()
}

const openDetailsModal = (record: any) => {
  selectedRecord.value = record
  isDetailsModalOpen.value = true
}

const closeDetailsModal = () => {
  isDetailsModalOpen.value = false
  selectedRecord.value = null
}

const handleApproveFromModal = async () => {
  if (!selectedRecord.value) return
  const rec = selectedRecord.value
  
  const confirm = await Swal.fire({
    title: 'Approve Expense?',
    text: `Authorize expense ${formatFullCurrency(rec.amount)} for "${rec.project_cost?.item_name || rec.description}"?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, Approve',
    confirmButtonColor: '#10B981',
    cancelButtonText: 'Cancel'
  })

  if (confirm.isConfirmed) {
    actionLoading.value = rec.uuid
    try {
      await financeStore.approveRecord(rec.uuid)
      closeDetailsModal()
      Swal.fire({
        title: 'Approved!',
        text: 'Expense approved and posted to Finance ledger.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      })
    } catch (err: any) {
      Swal.fire('Error', err.response?.data?.message || err.message, 'error')
    } finally {
      actionLoading.value = null
    }
  }
}

const handleRejectFromModal = async () => {
  if (!selectedRecord.value) return
  const rec = selectedRecord.value

  const { value: reason } = await Swal.fire({
    title: 'Reject Expense Submission',
    text: `Provide a reason for rejecting "${rec.project_cost?.item_name || rec.description}":`,
    input: 'textarea',
    inputPlaceholder: 'e.g. Budget ceiling reached / insufficient supporting invoices...',
    inputValidator: (value) => {
      if (!value) return 'Please provide a reason for rejection!'
    },
    showCancelButton: true,
    confirmButtonText: 'Reject Expense',
    confirmButtonColor: '#EF4444',
    cancelButtonText: 'Cancel'
  })

  if (reason) {
    actionLoading.value = rec.uuid
    try {
      await financeStore.rejectRecord(rec.uuid, reason)
      closeDetailsModal()
      Swal.fire({
        title: 'Expense Rejected',
        text: 'The expense request has been marked as rejected.',
        icon: 'info',
        timer: 1500,
        showConfirmButton: false
      })
    } catch (err: any) {
      Swal.fire('Error', err.response?.data?.message || err.message, 'error')
    } finally {
      actionLoading.value = null
    }
  }
}

onMounted(async () => {
  await financeStore.fetchDashboard()
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
@keyframes scaleUp {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.animate-scale-up { animation: scaleUp 0.3s ease-out; }
.custom-scrollbar::-webkit-scrollbar {
  height: 6px;
  width: 6px;
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
