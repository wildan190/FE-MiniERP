<template>
  <div class="bg-white shadow overflow-hidden sm:rounded-lg">
    <!-- Desktop Table -->
    <div class="hidden md:block overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Opportunity Title
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Customer
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Expected Value
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Closing Date
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
          <tr v-for="prospect in prospects" :key="prospect.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ prospect.title }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ getCustomerName(prospect) }}</div>
              <div class="text-xs text-gray-500">{{ getCustomerEmail(prospect) }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize"
                :class="getStatusClass(prospect.status)"
              >
                {{ prospect.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
              {{ formatCurrency(prospect.expected_value) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(prospect.expected_closing_date) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(prospect.created_at) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button @click="$emit('view', prospect)" class="text-indigo-600 hover:text-indigo-900 mr-4">View</button>
              <button @click="$emit('updateStatus', prospect)" class="text-primary-600 hover:text-primary-900 mr-4">Update Status</button>
              <button @click="$emit('delete', prospect)" class="text-red-600 hover:text-red-900">Delete</button>
            </td>
          </tr>
          <tr v-if="prospects.length === 0">
            <td colspan="4" class="px-6 py-10 text-center text-gray-500">
              No prospects found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile List (Accordion Style) -->
    <div class="md:hidden divide-y divide-gray-200">
      <div v-for="prospect in prospects" :key="prospect.id" class="p-4">
        <div @click="toggleExpand(prospect.id)" class="flex justify-between items-center cursor-pointer">
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">{{ getCustomerName(prospect) }}</p>
            <span 
              class="px-2 inline-flex text-[10px] leading-4 font-semibold rounded-full capitalize"
              :class="getStatusClass(prospect.status)"
            >
              {{ prospect.status }}
            </span>
          </div>
          <svg
            :class="{ 'rotate-180': expandedItems.has(prospect.id) }"
            class="h-5 w-5 text-gray-400 transition-transform flex-shrink-0 ml-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        <div v-if="expandedItems.has(prospect.id)" class="mt-4 space-y-3 pt-3 border-t border-gray-100">
          <div class="grid grid-cols-2 gap-2 text-sm">
            <div class="text-gray-500">Title:</div>
            <div class="text-gray-900 font-medium">{{ prospect.title }}</div>
            <div class="text-gray-500">Value:</div>
            <div class="text-gray-900">{{ formatCurrency(prospect.expected_value) }}</div>
            <div class="text-gray-500">Closing:</div>
            <div class="text-gray-900">{{ formatDate(prospect.expected_closing_date) }}</div>
            <div class="text-gray-500">Status:</div>
            <div>
              <span 
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="getStatusClass(prospect.status)"
              >
                {{ prospect.status }}
              </span>
            </div>
            <div class="text-gray-500">Customer:</div>
            <div class="text-gray-900 truncate">{{ getCustomerName(prospect) }}</div>
            <div class="text-gray-500">Created At:</div>
            <div class="text-gray-900">{{ formatDate(prospect.created_at) }}</div>
          </div>
          <div v-if="prospect.notes" class="text-sm">
            <div class="text-gray-500 mb-1">Notes:</div>
            <div class="text-gray-900 p-2 bg-gray-50 rounded italic">{{ prospect.notes }}</div>
          </div>
          <div class="flex flex-wrap gap-2 pt-2">
            <button
              @click="$emit('view', prospect)"
              class="flex-1 py-2 px-4 border border-indigo-300 rounded-md text-sm font-medium text-indigo-700 bg-white hover:bg-indigo-50"
            >
              View
            </button>
            <button
              @click="$emit('updateStatus', prospect)"
              class="flex-1 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Update Status
            </button>
            <button
              @click="$emit('delete', prospect)"
              class="flex-1 py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      <div v-if="prospects.length === 0" class="px-4 py-10 text-center text-gray-500">
        No prospects found.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Prospect } from '../../services'

const props = defineProps<{
  prospects: Prospect[]
}>()

defineEmits<{
  (e: 'view', prospect: Prospect): void
  (e: 'updateStatus', prospect: Prospect): void
  (e: 'delete', prospect: Prospect): void
}>()

const expandedItems = ref<Set<number>>(new Set())

const toggleExpand = (id: number) => {
  if (expandedItems.value.has(id)) {
    expandedItems.value.delete(id)
  } else {
    expandedItems.value.add(id)
  }
}

const getCustomerName = (prospect: Prospect) => {
  return prospect.customer?.name || 'Unknown'
}

const getCustomerEmail = (prospect: Prospect) => {
  return prospect.customer?.email || ''
}

const getStatusClass = (status: string) => {
  const s = status.toLowerCase()
  switch (s) {
    case 'new': return 'bg-blue-100 text-blue-800'
    case 'contacted': return 'bg-yellow-100 text-yellow-800'
    case 'qualified': return 'bg-indigo-100 text-indigo-800'
    case 'proposal': return 'bg-purple-100 text-purple-800'
    case 'negotiation': return 'bg-orange-100 text-orange-800'
    case 'won': return 'bg-green-100 text-green-800'
    case 'lost': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('en-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const formatCurrency = (value: string | number | null) => {
  if (!value) return '-'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(Number(value))
}
</script>
