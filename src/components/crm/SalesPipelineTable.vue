<template>
  <Card>
    <div>
      <!-- Desktop Table -->
      <div class="hidden md:block overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200">
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Prospect</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Stage</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Created At</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="pipeline in pipelines"
              :key="pipeline.id"
              class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{{ pipeline.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <p class="text-sm font-medium text-gray-900">{{ pipeline.prospect?.title || 'No Title' }}</p>
                <p class="text-xs text-gray-500">ID: {{ pipeline.prospect_id }}</p>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStageBadgeClass(pipeline.stage)" class="px-3 py-1 text-xs font-medium rounded-full">
                  {{ pipeline.stage }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ formatDate(pipeline.created_at) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <router-link
                  v-if="pipeline.uuid"
                  :to="{ name: 'crm-pipeline-detail', params: { uuid: pipeline.uuid } }"
                  class="text-primary-600 hover:text-primary-900 font-medium transition-colors"
                >
                  View
                </router-link>
                <span v-else class="text-gray-400">N/A</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile List View -->
      <div class="md:hidden">
        <div 
          v-for="pipeline in pipelines" 
          :key="pipeline.id"
          class="border-b border-gray-100 last:border-0"
        >
          <div 
            @click="toggleExpand(pipeline.id)"
            class="flex items-center justify-between p-4 active:bg-gray-50 transition-colors cursor-pointer"
          >
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-gray-900 truncate">
                {{ pipeline.prospect?.title || 'No Title' }}
              </p>
              <p class="text-xs text-gray-500 mt-0.5">#{{ pipeline.id }} • {{ formatDate(pipeline.created_at) }}</p>
            </div>
            <div class="flex items-center gap-3">
              <span :class="getStageBadgeClass(pipeline.stage)" class="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md">
                {{ pipeline.stage }}
              </span>
              <ChevronDown 
                class="h-5 w-5 text-gray-400 transition-transform duration-200"
                :class="{ 'rotate-180': expandedItems.has(pipeline.id) }"
              />
            </div>
          </div>

          <div 
            v-if="expandedItems.has(pipeline.id)"
            class="px-4 pb-4 bg-gray-50 space-y-3"
          >
             <div class="grid grid-cols-2 gap-4 text-sm mt-2">
                <div>
                  <p class="text-xs text-gray-500 font-medium uppercase tracking-wider">Prospect ID</p>
                  <p class="text-gray-900 font-medium">{{ pipeline.prospect_id }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 font-medium uppercase tracking-wider">Created Date</p>
                  <p class="text-gray-900 font-medium">{{ formatDate(pipeline.created_at) }}</p>
                </div>
             </div>
             
             <router-link
                v-if="pipeline.uuid"
                :to="{ name: 'crm-pipeline-detail', params: { uuid: pipeline.uuid } }"
                class="flex items-center justify-center w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-primary-600 hover:bg-white active:scale-95 transition-all shadow-sm"
              >
                View Details
              </router-link>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="pipelines.length === 0" class="text-center py-12 px-4">
        <div class="bg-gray-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 class="text-sm font-semibold text-gray-900">No sales pipelines</h3>
        <p class="text-xs text-gray-500 mt-1 max-w-[200px] mx-auto">Get started by creating a new pipeline.</p>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { SalesPipeline } from "../../services";
import { ChevronDown } from "lucide-vue-next";
import Card from "../common/Card.vue";

interface Props {
  pipelines: SalesPipeline[];
}

defineProps<Props>();

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
