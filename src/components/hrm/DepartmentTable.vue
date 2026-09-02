<template>
  <Card>
    <!-- Desktop Table View -->
    <div class="hidden md:block overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-gray-200/80 bg-gray-50/75">
            <th class="table-th">
              Department Name
            </th>
            <th class="table-th">
              Description
            </th>
            <th class="table-th">
              Created At
            </th>
            <th class="table-th text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <!-- Loading State -->
          <template v-if="loading">
            <tr v-for="i in 5" :key="i" class="border-b border-gray-100">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <Skeleton width="2.5rem" height="2.5rem" borderRadius="0.5rem" />
                  <div class="space-y-2">
                    <Skeleton width="10rem" height="1rem" />
                    <Skeleton width="6rem" height="0.75rem" />
                  </div>
                </div>
              </td>
              <td class="px-6 py-4"><Skeleton width="15rem" height="1rem" /></td>
              <td class="px-6 py-4"><Skeleton width="8rem" height="1rem" /></td>
              <td class="px-6 py-4 text-right"><Skeleton width="5rem" height="1.25rem" customClass="ml-auto" /></td>
            </tr>
          </template>

          <template v-else>
            <tr
              v-for="dept in departments"
              :key="dept.id"
              class="table-tr-hover"
            >
              <td class="table-td">
                <div class="flex items-center gap-3">
                  <div
                    class="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm flex-shrink-0"
                  >
                    {{ dept.name.charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <RouterLink 
                      :to="`/hrm/departments/${dept.uuid}`"
                      class="text-sm font-bold text-gray-900 hover:text-primary-600 transition-colors"
                    >
                      {{ dept.name }}
                    </RouterLink>
                    <p class="text-xs text-gray-500 font-mono">UUID: {{ dept.uuid.substring(0, 8) }}...</p>
                  </div>
                </div>
              </td>
              <td class="table-td">
                <p class="text-sm text-gray-700 max-w-md truncate">{{ dept.description || '-' }}</p>
              </td>
              <td class="table-td text-xs text-gray-500 font-medium">
                {{ formatDate(dept.created_at) }}
              </td>
              <td class="table-td text-right">
                <div class="table-action-toolbar justify-end">
                  <RouterLink
                    :to="`/hrm/departments/${dept.uuid}`"
                    class="p-1.5 rounded-lg text-gray-500 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                    title="View Details"
                  >
                    <Eye class="h-4 w-4" />
                  </RouterLink>
                  <button
                    @click="$emit('edit', dept)"
                    class="p-1.5 rounded-lg text-gray-500 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                    title="Edit Department"
                  >
                    <Pencil class="h-4 w-4" />
                  </button>
                  <button
                    @click="$emit('delete', dept.uuid)"
                    class="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete Department"
                  >
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- Mobile Accordion View -->
    <div class="md:hidden">
      <!-- Loading State -->
      <template v-if="loading">
        <div v-for="i in 3" :key="i" class="border-b border-gray-100 p-4 space-y-4">
          <div class="flex items-center gap-3">
            <Skeleton width="2.5rem" height="2.5rem" borderRadius="0.5rem" />
            <div class="space-y-2">
              <Skeleton width="12rem" height="1rem" />
              <Skeleton width="8rem" height="0.75rem" />
            </div>
          </div>
          <Skeleton width="100%" height="2rem" />
        </div>
      </template>

      <template v-else>
        <MobileExpandableRow
          v-for="(dept, idx) in departments"
          :key="dept.id"
          :title="dept.name"
          :subtitle="`Created: ${formatDate(dept.created_at)}`"
          :index="idx + 1"
        >
          <template #header-icon>
            <div
              class="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
            >
              {{ dept.name.charAt(0).toUpperCase() }}
            </div>
          </template>

          <template #details>
            <div class="grid grid-cols-1 gap-2 text-xs bg-white p-3 rounded-xl border border-gray-200/80">
              <div>
                <span class="text-gray-400 block text-[10px] uppercase font-bold">Description</span>
                <span class="font-medium text-gray-800">{{ dept.description || 'No description provided' }}</span>
              </div>
              <div class="pt-1">
                <span class="text-gray-400 block text-[10px] uppercase font-bold">UUID</span>
                <span class="font-mono text-gray-600">{{ dept.uuid }}</span>
              </div>
            </div>
          </template>

          <template #actions>
            <RouterLink
              :to="`/hrm/departments/${dept.uuid}`"
              class="px-3 py-1.5 rounded-lg bg-primary-50 text-primary-700 text-xs font-bold hover:bg-primary-100 transition-colors flex items-center gap-1.5"
            >
              <Eye class="h-3.5 w-3.5" />
              View Details
            </RouterLink>
            <button
              @click="$emit('edit', dept)"
              class="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 text-xs font-bold hover:bg-amber-100 transition-colors flex items-center gap-1.5"
            >
              <Pencil class="h-3.5 w-3.5" />
              Edit
            </button>
            <button
              @click="$emit('delete', dept.uuid)"
              class="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-xs font-bold hover:bg-red-100 transition-colors flex items-center gap-1.5"
            >
              <Trash2 class="h-3.5 w-3.5" />
              Delete
            </button>
          </template>
        </MobileExpandableRow>
      </template>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && departments.length === 0" class="text-center py-12">
      <div class="bg-gray-50 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
        <svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>
      <h3 class="text-sm font-medium text-gray-900">No departments found</h3>
      <p class="mt-1 text-sm text-gray-600">Get started by creating a new department.</p>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import { Eye, Pencil, Trash2 } from "lucide-vue-next";
import type { Department } from "../../services/hrm/types/department.types";
import Card from "../common/Card.vue";
import Skeleton from "../common/Skeleton.vue";
import MobileExpandableRow from "../common/MobileExpandableRow.vue";

interface Props {
  departments: Department[];
  loading?: boolean;
}

defineProps<Props>();
defineEmits<{
  (e: 'edit', department: Department): void
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
