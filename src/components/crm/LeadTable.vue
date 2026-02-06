<template>
  <Card>
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-gray-200">
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
            >
              Lead Name
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
            >
              Source
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
            v-for="lead in leads"
            :key="lead.id"
            class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center gap-3">
                <div
                  class="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center text-white font-semibold text-sm"
                >
                  {{ lead.lead_name.charAt(0).toUpperCase() }}
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ lead.lead_name }}</p>
                  <p class="text-xs text-gray-600">ID: {{ lead.id }}</p>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="px-3 py-1 text-xs font-medium rounded-full"
                :class="getSourceBadgeClass(lead.source)"
              >
                {{ lead.source }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {{ formatDate(lead.created_at) }}
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
      <div v-if="leads.length === 0" class="text-center py-12">
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
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No leads</h3>
        <p class="mt-1 text-sm text-gray-600">Get started by creating a new lead.</p>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import type { Lead } from "../../services";
import Card from "../common/Card.vue";

interface Props {
  leads: Lead[];
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

// Get source badge class
const getSourceBadgeClass = (source: string) => {
  const badgeClasses: Record<string, string> = {
    Website: "bg-blue-100 text-blue-800",
    Phone: "bg-green-100 text-green-800",
    Email: "bg-purple-100 text-purple-800",
    Referral: "bg-yellow-100 text-yellow-800",
    Social: "bg-pink-100 text-pink-800",
  };
  return badgeClasses[source] || "bg-gray-100 text-gray-800";
};
</script>
