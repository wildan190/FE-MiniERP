<script setup lang="ts">
import { onMounted } from 'vue';
import { usePurchasingStore } from '@/stores/purchasing';
import { 
  LayoutDashboard, 
  Users, 
  Box, 
  Banknote, 
  TrendingUp,
  Clock,
  ChevronRight,
  AlertCircle
} from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';

const purchasingStore = usePurchasingStore();

onMounted(async () => {
  await purchasingStore.fetchDashboard();
});

const exportDashboardReport = () => {
  const data = purchasingStore.dashboardData;
  if (!data) return;

  const stats = [
    ['Metric', 'Value'],
    ['Total Suppliers', data.stats.total_suppliers],
    ['Pending POs', data.stats.pending_pos],
    ['Monthly Spend', `Rp ${data.stats.monthly_spend.toLocaleString()}`],
    ['Overdue Invoices', data.stats.overdue_invoices]
  ];

  const recentOrders = [
    [],
    ['Recent Purchase Orders'],
    ['Number', 'Supplier', 'Amount', 'Status'],
    ...(data.recent_pos || []).map((po: any) => [
      po.number,
      po.supplier?.name || 'N/A',
      po.total_amount,
      po.status
    ])
  ];

  const csvContent = [...stats, ...recentOrders]
    .map(e => e.join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `purchasing_report_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>

<template>
  <AppLayout>
    <div class="p-6 max-w-7xl mx-auto space-y-8">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Purchasing Dashboard</h1>
          <p class="text-gray-500 mt-1">Monitor your procurement workflow and supplier performance.</p>
        </div>
        <div class="flex items-center gap-3">
          <button 
            @click="exportDashboardReport"
            class="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
          >
            Export Report
          </button>
          <RouterLink 
            to="/purchasing/orders"
            class="px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-all shadow-md shadow-primary-200"
          >
            New Purchase Order
          </RouterLink>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-blue-50 rounded-2xl group-hover:bg-blue-100 transition-colors">
              <Users class="h-6 w-6 text-blue-600" />
            </div>
            <span class="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-lg">+12%</span>
          </div>
          <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Suppliers</p>
          <h3 class="text-2xl font-bold text-gray-900 mt-1">{{ purchasingStore.dashboardData?.stats?.total_suppliers || 0 }}</h3>
        </div>

        <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-amber-50 rounded-2xl group-hover:bg-amber-100 transition-colors">
              <Clock class="h-6 w-6 text-amber-600" />
            </div>
            <span class="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">Pending</span>
          </div>
          <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">Pending Orders</p>
          <h3 class="text-2xl font-bold text-gray-900 mt-1">{{ purchasingStore.dashboardData?.stats?.pending_pos || 0 }}</h3>
        </div>

        <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-emerald-50 rounded-2xl group-hover:bg-emerald-100 transition-colors">
              <TrendingUp class="h-6 w-6 text-emerald-600" />
            </div>
            <span class="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">This Month</span>
          </div>
          <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">Monthly Spend</p>
          <h3 class="text-2xl font-bold text-gray-900 mt-1">Rp {{ (purchasingStore.dashboardData?.stats?.monthly_spend || 0).toLocaleString() }}</h3>
        </div>

        <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-rose-50 rounded-2xl group-hover:bg-rose-100 transition-colors">
              <AlertCircle class="h-6 w-6 text-rose-600" />
            </div>
            <span class="text-xs font-medium text-rose-600 bg-rose-50 px-2 py-1 rounded-lg">Critical</span>
          </div>
          <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">Overdue Invoices</p>
          <h3 class="text-2xl font-bold text-gray-900 mt-1">{{ purchasingStore.dashboardData?.stats?.overdue_invoices || 0 }}</h3>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Recent POs Table -->
        <div class="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="p-6 border-b border-gray-50 flex items-center justify-between">
            <h3 class="font-bold text-gray-900">Recent Purchase Orders</h3>
            <RouterLink to="/purchasing/orders" class="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">
              View All <ChevronRight class="h-4 w-4" />
            </RouterLink>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead>
                <tr class="bg-gray-50/50">
                  <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">PO Number</th>
                  <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Supplier</th>
                  <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Total</th>
                  <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50">
                <tr v-for="po in purchasingStore.dashboardData?.recent_pos" :key="po.uuid" class="hover:bg-gray-50/50 transition-colors">
                  <td class="px-6 py-4 font-medium text-gray-900">{{ po.number }}</td>
                  <td class="px-6 py-4 text-gray-600">{{ po.supplier?.name }}</td>
                  <td class="px-6 py-4 font-semibold">Rp {{ po.total_amount.toLocaleString() }}</td>
                  <td class="px-6 py-4">
                    <span 
                      class="px-3 py-1 rounded-full text-xs font-medium capitalize"
                      :class="{
                        'bg-amber-50 text-amber-600': po.status === 'draft',
                        'bg-emerald-50 text-emerald-600': po.status === 'approved',
                        'bg-blue-50 text-blue-600': po.status === 'completed'
                      }"
                    >
                      {{ po.status }}
                    </span>
                  </td>
                </tr>
                <tr v-if="!purchasingStore.dashboardData?.recent_pos?.length">
                  <td colspan="4" class="px-6 py-12 text-center text-gray-500 italic">No recent orders found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Spend by Category -->
        <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <h3 class="font-bold text-gray-900 mb-6">Spend by Category</h3>
          <div class="space-y-6">
            <div v-for="item in purchasingStore.dashboardData?.spend_by_category" :key="item.category">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-gray-600">{{ item.category || 'Uncategorized' }}</span>
                <span class="text-sm font-bold text-gray-900">Rp {{ item.total.toLocaleString() }}</span>
              </div>
              <div class="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-primary-500 rounded-full" 
                  :style="{ width: '70%' }"
                ></div>
              </div>
            </div>
            <div v-if="!purchasingStore.dashboardData?.spend_by_category?.length" class="text-center py-12 text-gray-500 italic">
              No spending data available.
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>
