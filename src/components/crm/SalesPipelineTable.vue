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
              Prospect
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
            >
              Stage
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
            v-for="pipeline in pipelines"
            :key="pipeline.id"
            class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <p class="text-sm font-medium text-gray-900">#{{ pipeline.id }}</p>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <p class="text-sm font-medium text-gray-900">
                {{ pipeline.prospect?.title || 'No Title' }}
              </p>
              <p class="text-xs text-gray-500">ID: {{ pipeline.prospect_id }}</p>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="getStageBadgeClass(pipeline.stage)"
                class="px-3 py-1 text-xs font-medium rounded-full"
              >
                {{ pipeline.stage }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {{ formatDate(pipeline.created_at) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <router-link
                :to="{ name: 'crm-pipeline-detail', params: { uuid: pipeline.uuid } }"
                class="text-primary-600 hover:text-primary-900 font-medium transition-colors"
                v-if="pipeline.uuid"
              >
                View
              </router-link>
              <span v-else class="text-gray-400">N/A</span>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty State -->
      <div v-if="pipelines.length === 0" class="text-center py-12">
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
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No sales pipelines</h3>
        <p class="mt-1 text-sm text-gray-600">Get started by creating a new pipeline.</p>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import type { SalesPipeline } from "../../services";
import Card from "../common/Card.vue";

interface Props {
  pipelines: SalesPipeline[];
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

// Get stage badge class
const getStageBadgeClass = (stage: string) => {
  const badgeClasses: Record<string, string> = {
    proposal: "bg-blue-100 text-blue-800",
    negotiation: "bg-yellow-100 text-yellow-800",
    won: "bg-green-100 text-green-800",
    lost: "bg-red-100 text-red-800",
  };
  return badgeClasses[stage] || "bg-gray-100 text-gray-800";
};
</script>
