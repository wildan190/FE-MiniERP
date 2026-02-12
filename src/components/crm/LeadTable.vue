<template>
  <div class="bg-white shadow overflow-hidden sm:rounded-lg">
    <!-- Desktop Table -->
    <div class="hidden md:block overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Lead Name
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Company
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Source
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created At
            </th>
            <th scope="col" class="relative px-6 py-3">
              <span class="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="lead in leads" :key="lead.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ lead.lead_name }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ lead.company || '-' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                {{ lead.source }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="getStatusClass(lead.status)"
              >
                {{ lead.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(lead.created_at) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button @click="$emit('view', lead)" class="text-indigo-600 hover:text-indigo-900 mr-4">View</button>
              <button @click="$emit('convert', lead)" class="text-green-600 hover:text-green-900 mr-4">Convert</button>
              <button @click="$emit('edit', lead)" class="text-primary-600 hover:text-primary-900 mr-4">Edit</button>
              <button @click="$emit('delete', lead)" class="text-red-600 hover:text-red-900">Delete</button>
            </td>
          </tr>
          <tr v-if="leads.length === 0">
            <td colspan="4" class="px-6 py-10 text-center text-gray-500">
              No leads found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile List (Accordion Style) -->
    <div class="md:hidden divide-y divide-gray-200">
      <div v-for="lead in leads" :key="lead.id" class="p-4">
        <div @click="toggleExpand(lead.id)" class="flex justify-between items-center cursor-pointer">
          <div>
            <p class="text-sm font-medium text-gray-900">{{ lead.lead_name }}</p>
            <p class="text-xs text-gray-500">{{ lead.source }}</p>
          </div>
          <svg
            :class="{ 'rotate-180': expandedItems.has(lead.id) }"
            class="h-5 w-5 text-gray-400 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        <div v-if="expandedItems.has(lead.id)" class="mt-4 space-y-3 pt-3 border-t border-gray-100">
          <div class="grid grid-cols-2 gap-2 text-sm">
            <div class="text-gray-500">Email:</div>
            <div class="text-gray-900">{{ lead.email || '-' }}</div>
            <div class="text-gray-500">Phone:</div>
            <div class="text-gray-900">{{ lead.phone || '-' }}</div>
            <div class="text-gray-500">Company:</div>
            <div class="text-gray-900">{{ lead.company || '-' }}</div>
            <div class="text-gray-500">Status:</div>
            <div>
              <span 
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="getStatusClass(lead.status)"
              >
                {{ lead.status }}
              </span>
            </div>
            <div class="text-gray-500">Created At:</div>
            <div class="text-gray-900">{{ formatDate(lead.created_at) }}</div>
          </div>
          <div v-if="lead.notes" class="text-sm">
            <div class="text-gray-500 mb-1">Notes:</div>
            <div class="text-gray-900 p-2 bg-gray-50 rounded italic">{{ lead.notes }}</div>
          </div>
          <div class="flex flex-wrap gap-2 pt-2">
            <button
              @click="$emit('view', lead)"
              class="flex-1 py-2 px-4 border border-indigo-300 rounded-md text-sm font-medium text-indigo-700 bg-white hover:bg-indigo-50"
            >
              View
            </button>
            <button
              @click="$emit('convert', lead)"
              class="flex-1 py-2 px-4 border border-green-300 rounded-md text-sm font-medium text-green-700 bg-white hover:bg-green-50"
            >
              Convert
            </button>
            <button
              @click="$emit('edit', lead)"
              class="flex-1 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Edit
            </button>
            <button
              @click="$emit('delete', lead)"
              class="flex-1 py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      <div v-if="leads.length === 0" class="px-4 py-10 text-center text-gray-500">
        No leads found.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Lead } from '../../services'

defineProps<{
  leads: Lead[]
}>()

defineEmits<{
  (e: 'view', lead: Lead): void
  (e: 'convert', lead: Lead): void
  (e: 'edit', lead: Lead): void
  (e: 'delete', lead: Lead): void
}>()

const expandedItems = ref<Set<number>>(new Set())

const toggleExpand = (id: number) => {
  if (expandedItems.value.has(id)) {
    expandedItems.value.delete(id)
  } else {
    expandedItems.value.add(id)
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('en-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const getStatusClass = (status: string) => {
  switch (status.toLowerCase()) {
    case 'new':
      return 'bg-green-100 text-green-800'
    case 'converted':
      return 'bg-blue-100 text-blue-800'
    case 'lost':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
</script>
