<template>
  <Card>
    <!-- Desktop Table View -->
    <div class="hidden md:block overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-gray-200 bg-gray-50">
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider rounded-tl-lg">
              Name
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Start Date
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              End Date
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- Loading State -->
          <template v-if="loading">
            <tr v-for="i in 5" :key="i" class="border-b border-gray-100">
              <td class="px-6 py-4"><Skeleton width="10rem" height="1rem" /></td>
              <td class="px-6 py-4"><Skeleton width="6rem" height="1rem" /></td>
              <td class="px-6 py-4"><Skeleton width="6rem" height="1rem" /></td>
              <td class="px-6 py-4"><Skeleton width="4rem" height="1.25rem" /></td>
            </tr>
          </template>

          <template v-else>
            <tr
              v-for="period in payrollPeriods"
              :key="period.id"
              class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm font-medium text-gray-900">{{ period.name }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-600">{{ formatDate(period.start_date) }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-600">{{ formatDate(period.end_date) }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="getStatusClass(period.status)"
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                >
                  {{ period.status || "N/A" }}
                </span>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- Mobile Card View -->
    <div class="md:hidden">
      <!-- Loading State -->
      <template v-if="loading">
        <div v-for="i in 3" :key="i" class="border-b border-gray-200 p-4 space-y-4">
          <div class="space-y-2">
            <Skeleton width="60%" height="1rem" />
            <Skeleton width="40%" height="0.875rem" />
            <Skeleton width="40%" height="0.875rem" />
            <Skeleton width="3rem" height="1.25rem" />
          </div>
        </div>
      </template>

      <template v-else>
        <div v-for="period in payrollPeriods" :key="period.id" class="border-b border-gray-200 p-4">
          <div class="flex items-center justify-between mb-2">
            <h4 class="text-sm font-semibold text-gray-900">{{ period.name }}</h4>
            <span
              :class="getStatusClass(period.status)"
              class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
            >
              {{ period.status || "N/A" }}
            </span>
          </div>
          <div class="space-y-1">
            <p class="text-sm text-gray-600">
              <span class="font-medium">Start Date:</span> {{ formatDate(period.start_date) }}
            </p>
            <p class="text-sm text-gray-600">
              <span class="font-medium">End Date:</span> {{ formatDate(period.end_date) }}
            </p>
          </div>
        </div>
      </template>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && payrollPeriods.length === 0" class="text-center py-12">
      <div class="bg-gray-50 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
        <svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
      <h3 class="text-sm font-medium text-gray-900">No payroll periods found</h3>
      <p class="mt-1 text-sm text-gray-600">Get started by creating a new payroll period.</p>
    </div>
  </Card>
</template>

<script setup lang="ts">
import type { PayrollPeriod } from "../../services/hrm/types/payroll-period.types";
import Card from "../common/Card.vue";
import Skeleton from "../common/Skeleton.vue";

interface Props {
  payrollPeriods: PayrollPeriod[];
  loading?: boolean;
}

defineProps<Props>();

const getStatusClass = (status: string | null) => {
  switch (status?.toLowerCase()) {
    case "completed":
    case "generated":
      return "bg-green-100 text-green-800";
    case "draft":
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
</script>
