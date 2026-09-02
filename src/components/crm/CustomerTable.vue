<template>
  <Card>
    <!-- Desktop Table View -->
    <div class="hidden md:block overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-gray-200/80 bg-gray-50/75">
            <th class="table-th">Name</th>
            <th class="table-th">Email</th>
            <th class="table-th">Company</th>
            <th class="table-th">Created At</th>
            <th class="table-th text-right">Actions</th>
          </tr>
        </thead>
        <tbody v-if="loading" class="divide-y divide-gray-100">
          <tr v-for="i in 5" :key="i">
            <td class="table-td">
              <div class="flex items-center gap-3">
                <Skeleton width="2.5rem" height="2.5rem" borderRadius="9999px" />
                <div class="space-y-2">
                  <Skeleton width="10rem" height="1rem" />
                  <Skeleton width="4rem" height="0.75rem" />
                </div>
              </div>
            </td>
            <td class="table-td">
              <Skeleton width="12rem" height="1rem" />
            </td>
            <td class="table-td">
              <Skeleton width="8rem" height="1rem" />
            </td>
            <td class="table-td">
              <Skeleton width="6rem" height="1rem" />
            </td>
            <td class="table-td text-right">
              <Skeleton width="3rem" height="1.5rem" class="ml-auto" />
            </td>
          </tr>
        </tbody>
        <tbody v-else class="divide-y divide-gray-100">
          <tr
            v-for="customer in customers"
            :key="customer.id"
            class="table-tr-hover"
          >
            <td class="table-td">
              <div class="flex items-center gap-3">
                <div
                  class="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm flex-shrink-0"
                >
                  {{ customer.name.charAt(0).toUpperCase() }}
                </div>
                <div>
                  <p class="text-sm font-bold text-gray-900">{{ customer.name }}</p>
                  <p class="text-xs text-gray-500 font-mono">ID: #{{ customer.id }}</p>
                </div>
              </div>
            </td>
            <td class="table-td font-mono text-xs text-gray-600">
              {{ customer.email }}
            </td>
            <td class="table-td">
              <span class="text-sm font-medium text-gray-700 bg-gray-100 px-2.5 py-1 rounded-lg">
                {{ customer.company_name || 'Individual' }}
              </span>
            </td>
            <td class="table-td text-xs text-gray-500 font-medium">
              {{ formatDate(customer.created_at) }}
            </td>
            <td class="table-td text-right">
              <div class="table-action-toolbar justify-end">
                <router-link
                  :to="`/crm/customers/${customer.uuid || customer.id}`"
                  class="p-1.5 rounded-lg text-gray-500 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                  title="View Customer Details"
                >
                  <Eye class="h-4 w-4" />
                </router-link>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile Accordion List View -->
    <div class="md:hidden">
      <template v-if="loading">
        <div v-for="i in 3" :key="i" class="border-b border-gray-100 p-4">
          <div class="flex items-center gap-3">
            <Skeleton width="2.5rem" height="2.5rem" borderRadius="9999px" />
            <div class="flex-1 space-y-2">
              <Skeleton width="10rem" height="1rem" />
              <Skeleton width="6rem" height="0.75rem" />
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <MobileExpandableRow
          v-for="(customer, idx) in customers"
          :key="customer.id"
          :title="customer.name"
          :subtitle="customer.email"
          :badge="customer.status || 'Active'"
          badgeClass="bg-blue-50 text-blue-700"
          :index="idx + 1"
        >
          <template #header-icon>
            <div
              class="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm"
            >
              {{ customer.name.charAt(0).toUpperCase() }}
            </div>
          </template>

          <template #details>
            <div class="grid grid-cols-2 gap-2 text-xs bg-white p-3 rounded-xl border border-gray-200/80">
              <div>
                <span class="text-gray-400 block text-[10px] uppercase font-bold">Company</span>
                <span class="font-medium text-gray-800">{{ customer.company_name || 'N/A' }}</span>
              </div>
              <div>
                <span class="text-gray-400 block text-[10px] uppercase font-bold">Phone</span>
                <span class="font-medium text-gray-800">{{ customer.phone || 'N/A' }}</span>
              </div>
              <div>
                <span class="text-gray-400 block text-[10px] uppercase font-bold">Created</span>
                <span class="font-medium text-gray-800">{{ formatDate(customer.created_at) }}</span>
              </div>
              <div>
                <span class="text-gray-400 block text-[10px] uppercase font-bold">ID</span>
                <span class="font-mono text-gray-600">#{{ customer.id }}</span>
              </div>
            </div>
          </template>

          <template #actions>
            <router-link
              :to="`/crm/customers/${customer.uuid || customer.id}`"
              class="w-full text-center px-4 py-2 bg-primary-600 text-white text-xs font-bold rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-1.5"
            >
              <Eye class="h-3.5 w-3.5" />
              View Customer Details
            </router-link>
          </template>
        </MobileExpandableRow>
      </template>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && customers.length === 0" class="text-center py-12">
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
import { Eye } from 'lucide-vue-next';
import type { Customer } from "../../services";
import Card from "../common/Card.vue";
import Skeleton from "../common/Skeleton.vue";
import MobileExpandableRow from "../common/MobileExpandableRow.vue";

interface Props {
  customers: Customer[];
  loading?: boolean;
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
</script>
