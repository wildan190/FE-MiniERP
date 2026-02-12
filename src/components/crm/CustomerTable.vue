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
              Name
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
            >
              Email
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
            v-for="customer in customers"
            :key="customer.id"
            class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center gap-3">
                <div
                  class="h-10 w-10 rounded-full bg-gradient-to-br from-primary-400 to-secondary-600 flex items-center justify-center text-white font-semibold text-sm"
                >
                  {{ customer.name.charAt(0).toUpperCase() }}
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ customer.name }}</p>
                  <p class="text-xs text-gray-600">ID: {{ customer.id }}</p>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <p class="text-sm text-gray-900">{{ customer.email }}</p>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {{ formatDate(customer.created_at) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <router-link
                :to="`/crm/customers/${customer.uuid || customer.id}`"
                class="text-primary-600 hover:text-primary-900 font-medium transition-colors"
              >
                View
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile Accordion List View -->
    <div class="md:hidden">
      <div
        v-for="customer in customers"
        :key="customer.id"
        class="border-b border-gray-200"
      >
        <!-- List Item Header (Always Visible) -->
        <div
          @click="toggleExpand(customer.id)"
          class="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors"
        >
          <div class="flex items-center gap-3 flex-1 min-w-0">
            <div
              class="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-br from-primary-400 to-secondary-600 flex items-center justify-center text-white font-semibold text-sm"
            >
              {{ customer.name.charAt(0).toUpperCase() }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-gray-900 truncate">{{ customer.name }}</p>
              <p class="text-xs text-gray-600 truncate">{{ customer.email }}</p>
            </div>
          </div>
          <svg
            :class="{ 'rotate-180': expandedItems.has(customer.id) }"
            class="h-5 w-5 text-gray-400 transition-transform flex-shrink-0 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        <!-- Expandable Details -->
        <div
          v-if="expandedItems.has(customer.id)"
          class="px-4 pb-4 bg-gray-50 space-y-3"
        >
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p class="text-xs text-gray-500">Company</p>
              <p class="font-medium text-gray-900">{{ customer.company_name || 'N/A' }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Phone</p>
              <p class="font-medium text-gray-900">{{ customer.phone || 'N/A' }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Status</p>
              <span
                class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize"
                :class="{
                  'bg-green-100 text-green-800': customer.status === 'active',
                  'bg-gray-100 text-gray-800': customer.status === 'inactive',
                  'bg-red-100 text-red-800': customer.status === 'blocked'
                }"
              >
                {{ customer.status || 'N/A' }}
              </span>
            </div>
            <div>
              <p class="text-xs text-gray-500">Created</p>
              <p class="font-medium text-gray-900">{{ formatDate(customer.created_at) }}</p>
            </div>
          </div>
          
          <router-link
            :to="`/crm/customers/${customer.uuid || customer.id}`"
            class="block w-full text-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            View Details
          </router-link>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="customers.length === 0" class="text-center py-12">
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
          d="M12 4.354a4 4 0 110 8.646 4 4 0 010-8.646M9 9H9.01M15 9h.01M9 15c.001-.668.083-1.322.255-1.949M15 15c.169.627.254 1.281.255 1.949M12 20c4.418 0 8-1.79 8-4s-3.582-4-8-4-8 1.79-8 4 3.582 4 8 4z"
        />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No customers</h3>
      <p class="mt-1 text-sm text-gray-600">Get started by creating a new customer.</p>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Customer } from "../../services";
import Card from "../common/Card.vue";

interface Props {
  customers: Customer[];
}

defineProps<Props>();

// Track expanded items
const expandedItems = ref<Set<number>>(new Set());

const toggleExpand = (id: number) => {
  if (expandedItems.value.has(id)) {
    expandedItems.value.delete(id);
  } else {
    expandedItems.value.add(id);
  }
};

// Format date helper
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
</script>
