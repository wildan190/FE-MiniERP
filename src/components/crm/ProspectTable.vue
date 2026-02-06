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
              Status
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
            v-for="prospect in prospects"
            :key="prospect.id"
            class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <p class="text-sm font-medium text-gray-900">#{{ prospect.id }}</p>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center gap-2">
                <div
                  class="h-8 w-8 rounded-full bg-gradient-to-br from-primary-400 to-secondary-600 flex items-center justify-center text-white font-semibold text-xs"
                >
                  {{ (customerMap?.[prospect.customer_id]?.name || "C").charAt(0).toUpperCase() }}
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">
                    {{ customerMap?.[prospect.customer_id]?.name || "Unknown" }}
                  </p>
                  <p class="text-xs text-gray-600">ID: {{ prospect.customer_id }}</p>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="getStatusBadgeClass(prospect.status)"
                class="px-3 py-1 text-xs font-medium rounded-full"
              >
                {{ prospect.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {{ formatDate(prospect.created_at) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm space-x-2">
              <button
                @click="$emit('updateStatus', prospect)"
                class="text-blue-600 hover:text-blue-900 font-medium transition-colors"
              >
                Edit
              </button>
              <button class="text-primary-600 hover:text-primary-900 font-medium transition-colors">
                View
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty State -->
      <div v-if="prospects.length === 0" class="text-center py-12">
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
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No prospects</h3>
        <p class="mt-1 text-sm text-gray-600">Get started by creating a new prospect.</p>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import type { Prospect } from "../../services";
import Card from "../common/Card.vue";

interface Props {
  prospects: Prospect[];
  customerMap?: Record<number, { name: string; email: string }>;
}

interface Emits {
  (e: "updateStatus", prospect: Prospect): void;
}

defineProps<Props>();
defineEmits<Emits>();

// Format date helper
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Get status badge class
const getStatusBadgeClass = (status: string) => {
  const badgeClasses: Record<string, string> = {
    new: "bg-blue-100 text-blue-800",
    contacted: "bg-cyan-100 text-cyan-800",
    qualified: "bg-green-100 text-green-800",
    proposal: "bg-yellow-100 text-yellow-800",
    negotiation: "bg-orange-100 text-orange-800",
    won: "bg-emerald-100 text-emerald-800",
    lost: "bg-red-100 text-red-800",
  };
  return badgeClasses[status] || "bg-gray-100 text-gray-800";
};
</script>
