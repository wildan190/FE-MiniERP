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
              Type
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Value / Percentage
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Taxable
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider rounded-tr-lg">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- Loading State -->
          <template v-if="loading">
            <tr v-for="i in 5" :key="i" class="border-b border-gray-100">
              <td class="px-6 py-4"><Skeleton width="10rem" height="1.25rem" /></td>
              <td class="px-6 py-4"><Skeleton width="6rem" height="1.25rem" /></td>
              <td class="px-6 py-4"><Skeleton width="8rem" height="1.25rem" /></td>
              <td class="px-6 py-4"><Skeleton width="4rem" height="1.25rem" /></td>
              <td class="px-6 py-4"><Skeleton width="4rem" height="1.25rem" /></td>
            </tr>
          </template>

          <template v-else>
            <tr
              v-for="component in components"
              :key="component.id"
              class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm font-semibold text-gray-900">{{ component.name }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize"
                  :class="component.type === 'earning' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                >
                  {{ component.type }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span v-if="component.is_fixed" class="text-sm font-medium text-gray-900">
                  {{ formatCurrency(component.value) }}
                </span>
                <span v-else class="text-sm font-medium text-gray-900">
                  {{ component.value }}% of {{ component.percentage_of || 'Base' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm" :class="component.is_taxable ? 'text-gray-900' : 'text-gray-500'">
                  {{ component.is_taxable ? 'Yes' : 'No' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="component.is_active ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'"
                >
                  {{ component.is_active ? 'Active' : 'Inactive' }}
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
          <div class="space-y-2 flex-1">
            <Skeleton width="60%" height="1.25rem" />
            <Skeleton width="40%" height="1rem" />
          </div>
          <div class="space-y-2">
            <Skeleton width="100%" height="0.875rem" />
            <Skeleton width="50%" height="0.875rem" />
          </div>
        </div>
      </template>

      <template v-else>
        <div v-for="component in components" :key="component.id" class="border-b border-gray-200 p-4">
          <div class="flex items-center justify-between mb-3">
            <h4 class="text-sm font-bold text-gray-900">{{ component.name }}</h4>
            <span
              class="inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize"
              :class="component.type === 'earning' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
            >
              {{ component.type }}
            </span>
          </div>
          <div class="space-y-1">
            <p class="text-sm text-gray-600">
              <span class="font-medium">Value:</span> 
              <span v-if="component.is_fixed" class="font-bold text-gray-900 ml-1">{{ formatCurrency(component.value) }}</span>
              <span v-else class="font-bold text-gray-900 ml-1">{{ component.value }}% of {{ component.percentage_of || 'Base' }}</span>
            </p>
            <p class="text-sm text-gray-600">
              <span class="font-medium">Taxable:</span> {{ component.is_taxable ? 'Yes' : 'No' }}
            </p>
          </div>
        </div>
      </template>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && components.length === 0" class="text-center py-12">
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
      <h3 class="text-sm font-medium text-gray-900">No components found</h3>
      <p class="mt-1 text-sm text-gray-600">Get started by creating a new salary component.</p>
    </div>
  </Card>
</template>

<script setup lang="ts">
import type { SalaryComponent } from "../../services/hrm/types/salary-component.types";
import Card from "../common/Card.vue";
import Skeleton from "../common/Skeleton.vue";

interface Props {
  components: SalaryComponent[];
  loading?: boolean;
}

defineProps<Props>();

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
