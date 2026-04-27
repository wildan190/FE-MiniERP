<template>
  <Card>
    <!-- Desktop Table View -->
    <div class="hidden md:block overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-gray-200 bg-gray-50">
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider rounded-tl-lg">
              Employee
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Period
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Net Salary
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Status
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider rounded-tr-lg">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- Loading State -->
          <template v-if="loading">
            <tr v-for="i in 5" :key="i" class="border-b border-gray-100">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <Skeleton width="2.5rem" height="2.5rem" />
                  <div class="space-y-2">
                    <Skeleton width="10rem" height="1rem" />
                    <Skeleton width="6rem" height="0.75rem" />
                  </div>
                </div>
              </td>
              <td class="px-6 py-4"><Skeleton width="8rem" height="1rem" /></td>
              <td class="px-6 py-4"><Skeleton width="6rem" height="1rem" /></td>
              <td class="px-6 py-4"><Skeleton width="4rem" height="1.25rem" /></td>
              <td class="px-6 py-4 text-right"><Skeleton width="4rem" height="1.25rem" class="ml-auto" /></td>
            </tr>
          </template>

          <template v-else>
            <tr
              v-for="payroll in payrolls"
              :key="payroll.id"
              class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <div
                    class="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm"
                  >
                    {{ getInitials(payroll.employee?.user?.name || payroll.employee?.first_name || 'N A') }}
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">
                      {{ payroll.employee?.user?.name || (payroll.employee?.first_name + ' ' + payroll.employee?.last_name) || 'Unknown Employee' }}
                    </p>
                    <p class="text-xs text-gray-600">{{ payroll.employee?.emp_code || "No code" }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-900">{{ payroll.payroll_period?.name || '-' }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm font-semibold text-gray-900">{{ formatCurrency(payroll.net_salary) }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="getStatusClass(payroll.status)"
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize"
                >
                  {{ payroll.status || "N/A" }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                <RouterLink
                  :to="`/hrm/payrolls/${payroll.uuid}`"
                  class="text-blue-600 hover:text-blue-900 font-medium transition-colors"
                >
                  View Detail
                </RouterLink>
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
          <div class="flex items-center gap-3">
            <Skeleton width="2.5rem" height="2.5rem" />
            <div class="space-y-2 flex-1">
              <Skeleton width="60%" height="1rem" />
              <Skeleton width="40%" height="0.875rem" />
            </div>
          </div>
          <div class="space-y-2">
            <Skeleton width="100%" height="0.875rem" />
            <Skeleton width="50%" height="0.875rem" />
          </div>
        </div>
      </template>

      <template v-else>
        <div v-for="payroll in payrolls" :key="payroll.id" class="border-b border-gray-200 p-4">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-3">
              <div
                class="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm"
              >
                {{ getInitials(payroll.employee?.user?.name || payroll.employee?.first_name || 'N A') }}
              </div>
              <div>
                <p class="text-sm font-semibold text-gray-900">
                  {{ payroll.employee?.user?.name || (payroll.employee?.first_name + ' ' + payroll.employee?.last_name) || 'Unknown Employee' }}
                </p>
                <p class="text-xs text-gray-500">{{ payroll.employee?.emp_code || "No code" }}</p>
              </div>
            </div>
            <span
              :class="getStatusClass(payroll.status)"
              class="inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize"
            >
              {{ payroll.status || "N/A" }}
            </span>
          </div>
          <div class="space-y-1 mb-4">
            <p class="text-sm text-gray-600">
              <span class="font-medium">Period:</span> {{ payroll.payroll_period?.name || "-" }}
            </p>
            <p class="text-sm text-gray-600">
              <span class="font-medium">Net Salary:</span> <span class="font-bold text-gray-900">{{ formatCurrency(payroll.net_salary) }}</span>
            </p>
          </div>
          <div class="flex">
            <RouterLink
              :to="`/hrm/payrolls/${payroll.uuid}`"
              class="flex-1 text-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              View Detail
            </RouterLink>
          </div>
        </div>
      </template>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && payrolls.length === 0" class="text-center py-12">
      <div class="bg-gray-50 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
        <svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <h3 class="text-sm font-medium text-gray-900">No payrolls found</h3>
      <p class="mt-1 text-sm text-gray-600">Try adjusting your filters to find what you're looking for.</p>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import type { Payroll } from "../../services/hrm/types/payroll.types";
import Card from "../common/Card.vue";
import Skeleton from "../common/Skeleton.vue";

interface Props {
  payrolls: Payroll[];
  loading?: boolean;
}

defineProps<Props>();

const getInitials = (name: string) => {
  return (
    name
      .split(" ")
      .map((n) => n.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2) || "NA"
  );
};

const getStatusClass = (status: string | null) => {
  switch (status?.toLowerCase()) {
    case "paid":
      return "bg-green-100 text-green-800";
    case "draft":
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const formatCurrency = (amount: string | number) => {
  if (amount === undefined || amount === null) return "0.00";
  const val = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(val);
};
</script>
