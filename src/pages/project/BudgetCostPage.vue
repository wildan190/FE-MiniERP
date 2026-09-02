<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useProjectStore } from '@/stores/project';
import { 
  Banknote, 
  TrendingDown, 
  TrendingUp, 
  AlertCircle,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Sparkles,
  User,
  ShoppingBag,
  Layers,
  FileText
} from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import ExpenseModal from '@/components/project/ExpenseModal.vue';

const projectStore = useProjectStore();
const isModalOpen = ref(false);

onMounted(async () => {
  await projectStore.fetchFinancials();
  await projectStore.fetchProjects();
});

const handleSaved = async () => {
  await projectStore.fetchFinancials();
};
</script>

<template>
  <AppLayout>
    <ExpenseModal 
      :is-open="isModalOpen" 
      @close="isModalOpen = false" 
      @saved="handleSaved"
    />
    <div class="p-6 max-w-7xl mx-auto space-y-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Budget &amp; Cost Control</h1>
          <p class="text-gray-500">Track project profitability, itemized expenditures, and real-time finance synchronization.</p>
        </div>
        <button 
          @click="isModalOpen = true"
          class="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-all shadow-md shadow-primary-100"
        >
          <Plus class="h-4 w-4" /> Add Project Expense
        </button>
      </div>

      <!-- Financial Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <p class="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">Total Budget</p>
          <h3 class="text-xl font-bold text-gray-900">Rp {{ (projectStore.financialData?.stats?.total_budget || 0).toLocaleString('id-ID') }}</h3>
          <div class="flex items-center gap-1 text-[10px] font-bold text-emerald-600 mt-2">
            <ArrowUpRight class="h-3 w-3" /> Healthy
          </div>
        </div>
        <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <p class="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">Actual Cost</p>
          <h3 class="text-xl font-bold text-gray-900">Rp {{ (projectStore.financialData?.stats?.actual_cost || 0).toLocaleString('id-ID') }}</h3>
          <div class="flex items-center gap-1 text-[10px] font-bold text-rose-600 mt-2">
            <TrendingUp class="h-3 w-3" /> 
            {{ projectStore.financialData?.stats?.total_budget > 0 ? Math.round((projectStore.financialData.stats.actual_cost / projectStore.financialData.stats.total_budget) * 100) : 0 }}% Utilization
          </div>
        </div>
        <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <p class="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">Remaining Budget</p>
          <h3 class="text-xl font-bold text-gray-900">Rp {{ (projectStore.financialData?.stats?.remaining || 0).toLocaleString('id-ID') }}</h3>
          <div class="flex items-center gap-1 text-[10px] font-bold text-blue-600 mt-2">
            <Clock class="h-3 w-3" /> Available Balance
          </div>
        </div>
        <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <p class="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">Gross Margin</p>
          <h3 class="text-xl font-bold text-gray-900">{{ Math.round(projectStore.financialData?.stats?.margin_percentage || 0) }}%</h3>
          <div class="flex items-center gap-1 text-[10px] font-bold text-emerald-600 mt-2">
            <ArrowUpRight class="h-3 w-3" /> On Target
          </div>
        </div>
      </div>

      <!-- Project Spending Progress -->
      <div class="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <h3 class="font-bold text-gray-900 text-lg">Project Budget Consumption</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="project in projectStore.financialData?.project_spending" :key="project.uuid" class="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-sm font-bold text-gray-800">{{ project.name }}</span>
              <span class="text-xs font-semibold text-primary-600">
                Rp {{ (project.total_spent || 0).toLocaleString('id-ID') }} / Rp {{ (project.value || 0).toLocaleString('id-ID') }}
              </span>
            </div>
            <div class="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                class="h-full bg-primary-500 rounded-full transition-all duration-500" 
                :style="{ width: Math.min(100, project.value > 0 ? ((project.total_spent / project.value) * 100) : 0) + '%' }"
              ></div>
            </div>
            <div class="flex justify-between text-[11px] text-gray-400">
              <span>Code: {{ project.code || '-' }}</span>
              <span>{{ project.value > 0 ? Math.round((project.total_spent / project.value) * 100) : 0 }}% spent</span>
            </div>
          </div>
          <div v-if="!projectStore.financialData?.project_spending?.length" class="col-span-full text-center py-8 text-gray-400 italic">
            No projects with active budget found.
          </div>
        </div>
      </div>

      <!-- Detailed Recent Expenditures Table -->
      <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div class="p-6 border-b border-gray-50 flex items-center justify-between">
          <div>
            <h3 class="font-bold text-gray-900 text-lg">Recent Project Expenditures &amp; Purchases</h3>
            <p class="text-xs text-gray-400 mt-0.5">Itemized purchase records, requested items, purposes, and auto-synced finance records.</p>
          </div>
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-100">
              <Sparkles class="h-3.5 w-3.5" /> Finance Synced
            </span>
          </div>
        </div>
        <div class="overflow-x-auto flex-1 custom-scrollbar">
          <table class="w-full text-left min-w-[950px]">
            <thead>
              <tr class="bg-gray-50/60 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                <th class="px-6 py-4">Item &amp; Purpose</th>
                <th class="px-6 py-4">Project</th>
                <th class="px-6 py-4">Category</th>
                <th class="px-6 py-4">Requester</th>
                <th class="px-6 py-4">Qty &amp; Price</th>
                <th class="px-6 py-4 text-center">Finance Status</th>
                <th class="px-6 py-4 text-right">Total Amount</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50 text-sm">
              <tr v-for="expense in projectStore.financialData?.recent_expenses" :key="expense.uuid" class="hover:bg-gray-50/50 transition-colors">
                <!-- Item Name & Purpose -->
                <td class="px-6 py-4">
                  <div class="flex flex-col">
                    <span class="font-bold text-gray-900 leading-snug">{{ expense.item_name || expense.description }}</span>
                    <span v-if="expense.purpose" class="text-xs text-gray-500 line-clamp-1 mt-0.5">
                      Keperluan: {{ expense.purpose }}
                    </span>
                    <span class="text-[10px] text-gray-400 mt-0.5">{{ expense.date }}</span>
                  </div>
                </td>

                <!-- Project -->
                <td class="px-6 py-4">
                  <span class="font-semibold text-gray-800 text-xs">{{ expense.project?.name || '-' }}</span>
                </td>

                <!-- Category -->
                <td class="px-6 py-4">
                  <span 
                    class="px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider"
                    :class="{
                      'bg-blue-50 text-blue-700': expense.type === 'material',
                      'bg-purple-50 text-purple-700': expense.type === 'labor',
                      'bg-amber-50 text-amber-700': expense.type === 'equipment',
                      'bg-emerald-50 text-emerald-700': expense.type === 'subcontractor',
                      'bg-gray-100 text-gray-700': expense.type === 'operational' || expense.type === 'other'
                    }"
                  >
                    {{ expense.type }}
                  </span>
                </td>

                <!-- Requester -->
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <div class="h-6 w-6 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center text-[10px]">
                      {{ expense.requested_by_name?.charAt(0) || 'U' }}
                    </div>
                    <span class="text-xs font-medium text-gray-700">{{ expense.requested_by_name || 'Staff' }}</span>
                  </div>
                </td>

                <!-- Qty & Unit Price -->
                <td class="px-6 py-4 text-xs text-gray-600">
                  <span class="font-bold text-gray-800">{{ expense.quantity || 1 }}x</span> @ Rp {{ Number(expense.unit_price || expense.amount).toLocaleString('id-ID') }}
                </td>

                <!-- Finance Approval Status -->
                <td class="px-6 py-4 text-center">
                  <div class="inline-flex flex-col items-center">
                    <span 
                      class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-2xs"
                      :class="{
                        'bg-emerald-100 text-emerald-800': expense.status === 'approved',
                        'bg-amber-100 text-amber-800': expense.status === 'pending',
                        'bg-rose-100 text-rose-800': expense.status === 'rejected'
                      }"
                    >
                      {{ expense.status === 'approved' ? 'Approved' : (expense.status === 'rejected' ? 'Rejected' : 'Pending Approval') }}
                    </span>
                    <span v-if="expense.approved_by_name" class="text-[9px] text-gray-400 mt-0.5">
                      by {{ expense.approved_by_name }}
                    </span>
                    <span v-if="expense.rejection_reason" class="text-[9px] text-rose-500 line-clamp-1 mt-0.5" :title="expense.rejection_reason">
                      {{ expense.rejection_reason }}
                    </span>
                  </div>
                </td>

                <!-- Total Amount -->
                <td class="px-6 py-4 text-right">
                  <span class="font-extrabold text-gray-900 text-sm">
                    Rp {{ Number(expense.amount).toLocaleString('id-ID') }}
                  </span>
                </td>
              </tr>
              <tr v-if="!projectStore.financialData?.recent_expenses?.length">
                <td colspan="7" class="px-6 py-12 text-center text-gray-400 italic">No recent project expenses found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

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
