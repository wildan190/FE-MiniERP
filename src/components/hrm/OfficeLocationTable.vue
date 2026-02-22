<template>
  <Card>
    <!-- Desktop Table View -->
    <div class="hidden md:block overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-gray-200">
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Office Name
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Address
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Coordinates
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Radius
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Status
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- Loading State -->
          <template v-if="loading">
            <tr v-for="i in 5" :key="i" class="border-b border-gray-100">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <Skeleton width="2.5rem" height="2.5rem" />
                  <div class="space-y-2">
                    <Skeleton width="8rem" height="1rem" />
                    <Skeleton width="5rem" height="0.75rem" />
                  </div>
                </div>
              </td>
              <td class="px-6 py-4"><Skeleton width="12rem" height="1rem" /></td>
              <td class="px-6 py-4"><Skeleton width="6rem" height="1rem" /></td>
              <td class="px-6 py-4"><Skeleton width="3rem" height="1rem" /></td>
              <td class="px-6 py-4"><Skeleton width="4rem" height="1.25rem" /></td>
              <td class="px-6 py-4 text-right"><Skeleton width="5rem" height="1.25rem" customClass="ml-auto" /></td>
            </tr>
          </template>
          
          <!-- Data State -->
          <template v-else>
            <tr v-for="location in locations" :key="location.uuid" class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center gap-3">
                <div class="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                  {{ (location.name || '?').toString().charAt(0).toUpperCase() }}
                </div>
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ location.name }}</div>
                  <p class="text-xs text-gray-600">UUID: {{ (location.uuid || '').substring(0, 8) }}...</p>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 max-w-xs truncate">
              <p class="text-sm text-gray-900" :title="location.address">{{ location.address }}</p>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <p class="text-sm text-gray-900">{{ location.latitude }}, {{ location.longitude }}</p>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {{ location.radius }}m
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="location.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" class="px-2 py-1 text-xs font-semibold rounded-full">
                {{ location.is_active ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
              <button @click="$emit('edit', location)" class="text-primary-600 hover:text-primary-900 font-medium transition-colors mr-3">
                Edit
              </button>
              <button @click="$emit('delete', location.uuid)" class="text-red-600 hover:text-red-900 font-medium transition-colors">
                Delete
              </button>
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
          <div class="flex items-center gap-3">
            <Skeleton width="2.5rem" height="2.5rem" />
            <div class="space-y-2">
              <Skeleton width="10rem" height="1rem" />
              <Skeleton width="6rem" height="0.75rem" />
            </div>
          </div>
          <Skeleton width="100%" height="1rem" />
          <Skeleton width="8rem" height="0.75rem" />
          <div class="flex gap-2">
            <Skeleton width="50%" height="2.5rem" />
            <Skeleton width="50%" height="2.5rem" />
          </div>
        </div>
      </template>

      <!-- Data State -->
      <template v-else>
        <div v-for="location in locations" :key="location.uuid" class="border-b border-gray-200">
        <div class="p-4">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-3">
              <div class="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                {{ (location.name || '?').toString().charAt(0).toUpperCase() }}
              </div>
              <div>
                <p class="text-sm font-semibold text-gray-900">{{ location.name }}</p>
                <div class="flex gap-2 items-center">
                  <span :class="location.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" class="px-2 py-0.5 text-[10px] font-semibold rounded-full">
                    {{ location.is_active ? 'Active' : 'Inactive' }}
                  </span>
                  <p class="text-xs text-gray-500">{{ location.radius }}m</p>
                </div>
              </div>
            </div>
          </div>
          <p class="text-sm text-gray-600 mb-1 truncate">{{ location.address }}</p>
          <p class="text-xs text-gray-500 mb-4">{{ location.latitude }}, {{ location.longitude }}</p>
          <div class="flex gap-2">
            <button @click="$emit('edit', location)" class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
              Edit
            </button>
            <button @click="$emit('delete', location.uuid)" class="flex-1 px-4 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors">
              Delete
            </button>
          </div>
        </div>
      </div>
      </template>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && locations.length === 0" class="text-center py-12">
      <div class="bg-gray-50 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
        <svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      <h3 class="text-sm font-medium text-gray-900">No office locations found</h3>
      <p class="mt-1 text-sm text-gray-600">Get started by creating a new office location.</p>
    </div>
  </Card>
</template>

<script setup lang="ts">
import type { OfficeLocation } from "../../services/hrm/types/office-location.types";
import Card from "../common/Card.vue";
import Skeleton from "../common/Skeleton.vue";

interface Props {
  locations: OfficeLocation[];
  loading?: boolean;
}

defineProps<Props>();
defineEmits<{
  (e: 'edit', location: OfficeLocation): void
  (e: 'delete', uuid: string): void
}>();
</script>
