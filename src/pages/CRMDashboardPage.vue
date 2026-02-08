<template>
  <AppLayout>
    <!-- Header -->
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-gray-900 mb-2">CRM Dashboard</h2>
      <p class="text-gray-600">Pantau metrik penjualan dan customer relationship Anda</p>
    </div>

    <!-- Loading State -->
    <div v-if="dashboardStore.isLoading" class="flex items-center justify-center py-12">
      <div class="flex flex-col items-center gap-4">
        <Spinner />
        <p class="text-gray-600">Loading CRM data...</p>
      </div>
    </div>

    <!-- Error State -->
    <Alert
      v-if="dashboardStore.error"
      :message="dashboardStore.error"
      @close="dashboardStore.clearError()"
      class="mb-6"
    />

    <!-- Metrics Grid -->
    <div v-if="crmData && !dashboardStore.isLoading" class="space-y-8">
      <!-- KPI Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Total Customers -->
        <Card class="relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent"></div>
          <div class="relative">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Total Customers</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">
                  {{ crmData.metrics.total_customers }}
                </p>
              </div>
              <div
                class="h-12 w-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center"
              >
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
            </div>
            <p class="text-xs text-green-600 mt-3">↑ 12% dari bulan lalu</p>
          </div>
        </Card>

        <!-- Total Leads -->
        <Card class="relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent"></div>
          <div class="relative">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Total Leads</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">
                  {{ crmData.metrics.total_leads }}
                </p>
              </div>
              <div
                class="h-12 w-12 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center"
              >
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
            </div>
            <p class="text-xs text-green-600 mt-3">↑ 8% dari bulan lalu</p>
          </div>
        </Card>

        <!-- Total Prospects -->
        <Card class="relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent"></div>
          <div class="relative">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Total Prospects</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">
                  {{ crmData.metrics.total_prospects }}
                </p>
              </div>
              <div
                class="h-12 w-12 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center"
              >
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
            </div>
            <p class="text-xs text-green-600 mt-3">↑ 5% dari bulan lalu</p>
          </div>
        </Card>

        <!-- Active Pipelines -->
        <Card class="relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent"></div>
          <div class="relative">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Active Pipelines</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">
                  {{ crmData.metrics.active_pipelines }}
                </p>
              </div>
              <div
                class="h-12 w-12 rounded-lg bg-green-100 text-green-600 flex items-center justify-center"
              >
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <p class="text-xs text-green-600 mt-3">Status aktif</p>
          </div>
        </Card>
      </div>

      <!-- Revenue Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Quotation Stats -->
        <Card>
          <h3 class="text-lg font-semibold text-gray-900 mb-6">Quotation Overview</h3>
          <div class="space-y-4">
            <div
              class="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100"
            >
              <div>
                <p class="text-sm font-medium text-gray-600">Total Quotations</p>
                <p class="text-2xl font-bold text-gray-900 mt-1">
                  {{ crmData.metrics.total_quotation }}
                </p>
              </div>
              <div class="text-right">
                <p class="text-xs text-gray-600 mb-1">Value</p>
                <p class="text-xl font-bold text-blue-600">
                  {{ formatCurrency(crmData.metrics.quotation_value) }}
                </p>
              </div>
            </div>
            <div class="p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg text-white">
              <p class="text-sm font-medium opacity-90">Average Quotation Value</p>
              <p class="text-2xl font-bold mt-1">
                {{
                  formatCurrency(
                    (
                      parseInt(crmData.metrics.quotation_value) / crmData.metrics.total_quotation
                    ).toString(),
                  )
                }}
              </p>
            </div>
          </div>
        </Card>

        <!-- Prospect Status -->
        <Card>
          <h3 class="text-lg font-semibold text-gray-900 mb-6">Prospect Status</h3>
          <div class="space-y-3">
            <div
              v-for="status in crmData.metrics.prospect_by_status"
              :key="status.status"
              class="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <div class="flex items-center gap-3">
                <div class="h-3 w-3 rounded-full bg-green-500"></div>
                <div>
                  <p class="text-sm font-medium text-gray-900 capitalize">{{ status.status }}</p>
                  <p class="text-xs text-gray-600">Prospects</p>
                </div>
              </div>
              <div>
                <p class="text-lg font-bold text-gray-900">{{ status.total }}</p>
                <p class="text-xs text-gray-600 text-right">
                  {{ getPercentage(status.total, crmData.metrics.total_prospects) }}%
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <!-- Summary Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card class="text-center">
          <p class="text-gray-600 text-sm font-medium">Conversion Rate</p>
          <p class="text-4xl font-bold text-primary-600 mt-3">{{ getConversionRate() }}%</p>
          <p class="text-xs text-gray-600 mt-2">Dari Leads ke Customers</p>
        </Card>

        <Card class="text-center">
          <p class="text-gray-600 text-sm font-medium">Total Revenue (Est.)</p>
          <p class="text-3xl font-bold text-green-600 mt-3">
            {{ formatCurrency(crmData.metrics.quotation_value) }}
          </p>
          <p class="text-xs text-gray-600 mt-2">dari quotations</p>
        </Card>

        <Card class="text-center">
          <p class="text-gray-600 text-sm font-medium">Potential Revenue</p>
          <p class="text-3xl font-bold text-secondary-600 mt-3">
            {{ formatCurrency((parseInt(crmData.metrics.quotation_value) * 1.5).toString()) }}
          </p>
          <p class="text-xs text-gray-600 mt-2">dengan target growth 50%</p>
        </Card>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useDashboardStore } from "@/stores/dashboard";
import AppLayout from "@/layouts/AppLayout.vue";
import Card from "@/components/common/Card.vue";
import Button from "@/components/common/Button.vue";
import Alert from "@/components/common/Alert.vue";
import Spinner from "@/components/common/Spinner.vue";

const dashboardStore = useDashboardStore();

const crmData = computed(() => dashboardStore.crmDashboardData);

const formatCurrency = (value: string) => {
  const num = parseInt(value);
  if (num >= 1000000) {
    return `Rp${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `Rp${(num / 1000).toFixed(1)}K`;
  }
  return `Rp${num}`;
};

const getPercentage = (value: number, total: number) => {
  return ((value / total) * 100).toFixed(1);
};

const getConversionRate = () => {
  if (!crmData.value) return "0";
  const rate = (crmData.value.metrics.total_customers / crmData.value.metrics.total_leads) * 100;
  return rate.toFixed(1);
};

onMounted(async () => {
  await dashboardStore.fetchCRMDashboard();
});
</script>
