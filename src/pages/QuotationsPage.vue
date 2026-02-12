<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex justify-between items-center">
          <h1 class="text-3xl font-bold text-gray-900">Quotations</h1>
          <button
            @click="showCreateModal = true"
            class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            + Create Quotation
          </button>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <div class="text-center">
              <p class="text-sm text-gray-600">Total Quotations</p>
              <p class="text-3xl font-bold text-primary-600 mt-2">{{ pagination.total }}</p>
            </div>
          </Card>
          <Card>
            <div class="text-center">
              <p class="text-sm text-gray-600">Total Value</p>
              <p class="text-3xl font-bold text-green-600 mt-2">{{ formatCurrency(totalValue) }}</p>
            </div>
          </Card>
          <Card>
            <div class="text-center">
              <p class="text-sm text-gray-600">Draft</p>
              <p class="text-3xl font-bold text-yellow-600 mt-2">{{ draftCount }}</p>
            </div>
          </Card>
          <Card>
            <div class="text-center">
              <p class="text-sm text-gray-600">Accepted</p>
              <p class="text-3xl font-bold text-green-600 mt-2">{{ acceptedCount }}</p>
            </div>
          </Card>
        </div>

        <!-- Table -->
        <Card>
          <!-- Desktop Table -->
          <div class="hidden md:block overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-gray-200">
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Number
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Customer
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Amount
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Valid Until
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="quotation in quotations"
                  :key="quotation.id"
                  class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <p class="text-sm font-medium text-gray-900">{{ quotation.quotation_number }}</p>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <p class="text-sm font-medium text-gray-900">{{ quotation.customer?.name || 'N/A' }}</p>
                    <p class="text-xs text-gray-600">{{ quotation.customer?.email }}</p>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <p class="text-sm font-semibold text-green-600">
                      {{ formatCurrency(parseFloat(String(quotation.total_amount))) }}
                    </p>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
                      :class="getStatusClass(quotation.status)"
                    >
                      {{ quotation.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {{ formatDate(quotation.valid_until) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <router-link
                      :to="`/quotations/${quotation.uuid}`"
                      class="text-primary-600 hover:text-primary-900 font-medium transition-colors"
                    >
                      View
                    </router-link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Mobile Accordion List -->
          <div class="md:hidden">
            <div
              v-for="quotation in quotations"
              :key="quotation.id"
              class="border-b border-gray-200"
            >
              <!-- List Item Header -->
              <div
                @click="toggleExpand(quotation.id)"
                class="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors"
              >
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-gray-900">{{ quotation.quotation_number }}</p>
                  <p class="text-xs text-gray-600">{{ quotation.customer?.name }}</p>
                </div>
                <svg
                  :class="{ 'rotate-180': expandedItems.has(quotation.id) }"
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
                v-if="expandedItems.has(quotation.id)"
                class="px-4 pb-4 bg-gray-50 space-y-3"
              >
                <div class="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p class="text-xs text-gray-500">Amount</p>
                    <p class="font-semibold text-green-600">{{ formatCurrency(parseFloat(String(quotation.total_amount))) }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Status</p>
                    <span
                      class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize"
                      :class="getStatusClass(quotation.status)"
                    >
                      {{ quotation.status }}
                    </span>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Valid Until</p>
                    <p class="font-medium text-gray-900">{{ formatDate(quotation.valid_until) }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Created</p>
                    <p class="font-medium text-gray-900">{{ formatDate(quotation.created_at) }}</p>
                  </div>
                </div>
                
                <router-link
                  :to="`/quotations/${quotation.uuid}`"
                  class="block w-full text-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
                >
                  View Details
                </router-link>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="quotations.length === 0" class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No quotations</h3>
            <p class="mt-1 text-sm text-gray-600">Get started by creating a new quotation.</p>
          </div>
        </Card>

        <!-- Pagination -->
        <div v-if="pagination.total > 0" class="flex justify-between items-center">
          <p class="text-sm text-gray-700">
            Showing {{ pagination.from }} to {{ pagination.to }} of {{ pagination.total }} quotations
          </p>
          <div class="flex gap-2">
            <button
              v-for="link in pagination.links"
              :key="link.label"
              @click="handlePageChange(link.page)"
              :disabled="!link.page || link.active"
              :class="{
                'bg-primary-600 text-white': link.active,
                'bg-white text-gray-700 hover:bg-gray-50': !link.active && link.page,
                'bg-gray-100 text-gray-400 cursor-not-allowed': !link.page
              }"
              class="px-3 py-2 rounded-md border border-gray-300 text-sm font-medium transition-colors"
              v-html="link.label"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Create Modal -->
    <CreateQuotationModal
      :is-open="showCreateModal"
      @close="showCreateModal = false"
      @created="handleQuotationCreated"
    />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { quotationService, type Quotation } from '../services'
import AppLayout from '../layouts/AppLayout.vue'
import Card from '../components/common/Card.vue'
import CreateQuotationModal from '../components/crm/CreateQuotationModal.vue'

const quotations = ref<Quotation[]>([])
const pagination = ref({
  current_page: 1,
  total: 0,
  from: 0,
  to: 0,
  links: [] as Array<{ label: string; page: number | null; active: boolean }>
})
const loading = ref(false)
const showCreateModal = ref(false)
const expandedItems = ref<Set<number>>(new Set())

const fetchQuotations = async (page = 1) => {
  loading.value = true
  try {
    const response = await quotationService.getQuotations(page)
    quotations.value = response.data.data
    pagination.value = {
      current_page: response.data.current_page,
      total: response.data.total,
      from: response.data.from,
      to: response.data.to,
      links: response.data.links
    }
  } catch (error) {
    console.error('Failed to fetch quotations:', error)
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page: number | null) => {
  if (page) {
    fetchQuotations(page)
  }
}

const toggleExpand = (id: number) => {
  if (expandedItems.value.has(id)) {
    expandedItems.value.delete(id)
  } else {
    expandedItems.value.add(id)
  }
}

const handleQuotationCreated = () => {
  fetchQuotations(pagination.value.current_page)
}

const totalValue = computed(() => {
  return quotations.value.reduce((sum, q) => sum + parseFloat(String(q.total_amount)), 0)
})

const draftCount = computed(() => {
  return quotations.value.filter((q) => q.status === 'draft').length
})

const acceptedCount = computed(() => {
  return quotations.value.filter((q) => q.status === 'accepted').length
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

const getStatusClass = (status: string) => {
  const classes = {
    draft: 'bg-gray-100 text-gray-800',
    sent: 'bg-blue-100 text-blue-800',
    accepted: 'bg-green-100 text-green-800',
    declined: 'bg-red-100 text-red-800',
    expired: 'bg-orange-100 text-orange-800'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

onMounted(() => {
  fetchQuotations()
})
</script>
