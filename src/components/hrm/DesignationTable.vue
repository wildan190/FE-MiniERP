<template>
  <Card>
    <!-- Desktop Table View -->
    <div class="hidden md:block overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-gray-200">
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
            >
              Designation Name
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
            >
              Description
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
            >
              Created At
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider text-right"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="dept in designations"
            :key="dept.id"
            class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center gap-3">
                <div
                  class="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm"
                >
                  {{ dept.name.charAt(0).toUpperCase() }}
                </div>
                <div>
                  <RouterLink 
                    :to="`/hrm/designations/${dept.uuid}`"
                    class="text-sm font-medium text-gray-900 hover:text-primary-600 transition-colors"
                  >
                    {{ dept.name }}
                  </RouterLink>
                  <p class="text-xs text-gray-600">UUID: {{ dept.uuid.substring(0, 8) }}...</p>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <p class="text-sm text-gray-900">{{ dept.description || '-' }}</p>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {{ formatDate(dept.created_at) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
              <button
                @click="$emit('edit', dept)"
                class="text-primary-600 hover:text-primary-900 font-medium transition-colors mr-3"
              >
                Edit
              </button>
              <button
                @click="$emit('delete', dept.uuid)"
                class="text-red-600 hover:text-red-900 font-medium transition-colors"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile Card View -->
    <div class="md:hidden">
      <div
        v-for="dept in designations"
        :key="dept.id"
        class="border-b border-gray-200"
      >
        <div class="p-4">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-3">
              <div
                class="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm"
              >
                {{ dept.name.charAt(0).toUpperCase() }}
              </div>
              <div>
                <p class="text-sm font-semibold text-gray-900">{{ dept.name }}</p>
                <p class="text-xs text-gray-500">{{ formatDate(dept.created_at) }}</p>
              </div>
            </div>
          </div>
          <p class="text-sm text-gray-600 mb-4">{{ dept.description || 'No description' }}</p>
          <div class="flex flex-col gap-2">
            <RouterLink
              :to="`/hrm/designations/${dept.uuid}`"
              class="w-full text-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              View Details
            </RouterLink>
            <div class="flex gap-2">
              <button
                @click="$emit('edit', dept)"
                class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Edit
              </button>
              <button
                @click="$emit('delete', dept.uuid)"
                class="flex-1 px-4 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="designations.length === 0" class="text-center py-12">
      <div class="bg-gray-50 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
        <svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>
      <h3 class="text-sm font-medium text-gray-900">No designations found</h3>
      <p class="mt-1 text-sm text-gray-600">Get started by creating a new designation.</p>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import type { Designation } from "../../services/hrm/types/designation.types";
import Card from "../common/Card.vue";

interface Props {
  designations: Designation[];
}

defineProps<Props>();
defineEmits<{
  (e: 'edit', designation: Designation): void
  (e: 'delete', uuid: string): void
}>();

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
</script>
