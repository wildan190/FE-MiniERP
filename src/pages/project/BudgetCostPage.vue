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
  ArrowDownRight
} from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import ExpenseModal from '@/components/project/ExpenseModal.vue';

const projectStore = useProjectStore();
const isModalOpen = ref(false);

onMounted(async () => {
  await projectStore.fetchFinancials();
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
          <h1 class="text-2xl font-bold text-gray-900">Budget & Cost Control</h1>
          <p class="text-gray-500">Track project profitability and expenditures.</p>
        </div>
        <button 
          @click="isModalOpen = true"
          class="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-all shadow-md shadow-primary-100"
        >
          <Plus class="h-4 w-4" /> Add Expense
        </button>
      </div>

      <!-- Financial Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <p class="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">Total Budget</p>
          <h3 class="text-xl font-bold text-gray-900">Rp {{ (projectStore.financialData?.stats?.total_budget || 0).toLocaleString() }}</h3>
          <div class="flex items-center gap-1 text-[10px] font-bold text-emerald-600 mt-2">
            <ArrowUpRight class="h-3 w-3" /> Healthy
          </div>
        </div>
        <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <p class="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">Actual Cost</p>
          <h3 class="text-xl font-bold text-gray-900">Rp {{ (projectStore.financialData?.stats?.actual_cost || 0).toLocaleString() }}</h3>
          <div class="flex items-center gap-1 text-[10px] font-bold text-rose-600 mt-2">
            <TrendingUp class="h-3 w-3" /> {{ Math.round((projectStore.financialData?.stats?.actual_cost / projectStore.financialData?.stats?.total_budget) * 100) || 0 }}% Utilization
          </div>
        </div>
        <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <p class="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">Remaining</p>
          <h3 class="text-xl font-bold text-gray-900">Rp {{ (projectStore.financialData?.stats?.remaining || 0).toLocaleString() }}</h3>
          <div class="flex items-center gap-1 text-[10px] font-bold text-blue-600 mt-2">
            <Clock class="h-3 w-3" /> Safe Zone
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

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Budget Consumption per Project -->
        <div class="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <h3 class="font-bold text-gray-900">Project Spending</h3>
          <div class="space-y-6">
            <div v-for="project in projectStore.financialData?.project_spending" :key="project.uuid">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-bold text-gray-700">{{ project.name }}</span>
                <span class="text-sm font-medium text-gray-500">Rp {{ (project.total_spent || 0).toLocaleString() }} / Rp {{ project.value.toLocaleString() }}</span>
              </div>
              <div class="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                <div class="h-full bg-primary-500 rounded-full" :style="{ width: ((project.total_spent / project.value) * 100) + '%' }"></div>
              </div>
            </div>
            <div v-if="!projectStore.financialData?.project_spending?.length" class="text-center py-12 text-gray-400 italic">No project data.</div>
          </div>
        </div>

        <!-- Recent Expenses -->
        <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div class="p-6 border-b border-gray-50 flex items-center justify-between">
            <h3 class="font-bold text-gray-900">Recent Expenditures</h3>
            <button class="text-xs font-bold text-primary-600 hover:text-primary-700">View All</button>
          </div>
          <div class="overflow-x-auto flex-1">
            <table class="w-full text-left">
              <thead>
                <tr class="bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <th class="px-6 py-4">Date</th>
                  <th class="px-6 py-4">Category</th>
                  <th class="px-6 py-4">Project</th>
                  <th class="px-6 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50 text-sm">
                <tr v-for="expense in projectStore.financialData?.recent_expenses" :key="expense.uuid" class="hover:bg-gray-50/50 transition-colors">
                  <td class="px-6 py-4 text-gray-500">{{ expense.date }}</td>
                  <td class="px-6 py-4">
                    <span class="px-2 py-0.5 rounded-lg bg-gray-100 text-[10px] font-bold uppercase text-gray-600">{{ expense.type }}</span>
                  </td>
                  <td class="px-6 py-4 text-gray-900 font-medium text-xs">{{ expense.project?.name }}</td>
                  <td class="px-6 py-4 text-right font-bold text-gray-900">Rp {{ expense.amount.toLocaleString() }}</td>
                </tr>
                <tr v-if="!projectStore.financialData?.recent_expenses?.length">
                  <td colspan="4" class="px-6 py-12 text-center text-gray-500 italic">No recent expenses.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>
