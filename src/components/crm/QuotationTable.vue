<template>
  <Card>
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-gray-200">
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
            >
              ID
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
            >
              Customer
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
            >
              Amount
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
            >
              Valid Until
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
            >
              Created At
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="quotation in quotations"
            :key="quotation.id"
            class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <p class="text-sm font-medium text-gray-900">#{{ quotation.id }}</p>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center gap-2">
                <div
                  class="h-8 w-8 rounded-full bg-gradient-to-br from-primary-400 to-secondary-600 flex items-center justify-center text-white font-semibold text-xs"
                >
                  {{ (customerMap?.[quotation.customer_id]?.name || "C").charAt(0).toUpperCase() }}
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">
                    {{ customerMap?.[quotation.customer_id]?.name || "Unknown" }}
                  </p>
                  <p class="text-xs text-gray-600">ID: {{ quotation.customer_id }}</p>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ formatCurrency(parseFloat(String(quotation.total_amount))) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <p class="text-sm text-gray-600">{{ formatDate(quotation.valid_until) }}</p>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {{ formatDate(quotation.created_at) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <button class="text-primary-600 hover:text-primary-900 font-medium transition-colors">
                View
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty State -->
      <div v-if="quotations.length === 0" class="text-center py-12">
        <svg
          class="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No quotations</h3>
        <p class="mt-1 text-sm text-gray-600">Get started by creating a new quotation.</p>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import type { Quotation } from "../../services";
import Card from "../common/Card.vue";

interface Props {
  quotations: Quotation[];
  customerMap?: Record<number, { name: string; email: string }>;
}

defineProps<Props>();

// Format date helper
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Format currency helper
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
</script>
