<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <Spinner class="w-10 h-10 text-primary-600" />
        <p class="mt-4 text-gray-500 font-medium">Loading prospect details...</p>
      </div>

      <div v-else-if="prospect" class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div class="flex items-center gap-4">
            <div class="h-16 w-16 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {{ prospect.customer?.name?.charAt(0).toUpperCase() || 'P' }}
            </div>
            <div>
              <h1 class="text-3xl font-bold text-gray-900">{{ prospect.title }}</h1>
              <div class="flex flex-wrap items-center gap-2 mt-1">
                <span 
                  class="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider"
                  :class="getStatusClass(prospect.status)"
                >
                  {{ prospect.status }}
                </span>
                <span class="text-gray-400">•</span>
                <span class="text-gray-600 text-sm font-medium">{{ prospect.customer?.name }}</span>
                <span class="text-gray-400">•</span>
                <span class="text-gray-600 text-sm">Created {{ formatDate(prospect.created_at) }}</span>
              </div>
            </div>
          </div>
          <div class="flex flex-wrap gap-2 w-full sm:w-auto">
            <button
              @click="handleUpdateStatus"
              class="flex-1 sm:flex-none px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              Update Status
            </button>
            <button
              @click="handleDelete"
              class="flex-1 sm:flex-none px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
            >
              Delete
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Main Info -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Prospect Summary -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card class="bg-indigo-50 border-none">
                <p class="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">Expected Value</p>
                <p class="text-xl font-bold text-indigo-900">{{ formatCurrency(prospect.expected_value) }}</p>
              </Card>
              <Card class="bg-emerald-50 border-none">
                <p class="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">Probability</p>
                <p class="text-xl font-bold text-emerald-900">{{ prospect.probability || 0 }}%</p>
              </Card>
              <Card class="bg-amber-50 border-none">
                <p class="text-xs font-semibold text-amber-600 tracking-wider uppercase mb-1">Closing Date</p>
                <p class="text-xl font-bold text-amber-900">{{ formatDate(prospect.expected_closing_date) }}</p>
              </Card>
            </div>

            <!-- Details -->
            <Card>
              <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Opportunity Details
              </h2>
              <div class="space-y-4">
                <div v-if="prospect.notes">
                  <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Notes</label>
                  <p class="text-gray-700 whitespace-pre-wrap leading-relaxed">{{ prospect.notes }}</p>
                </div>
                <div v-else>
                  <p class="text-gray-500 italic">No additional notes provided for this prospect.</p>
                </div>
              </div>
            </Card>

            <!-- Pipelines -->
            <Card>
              <h2 class="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <svg class="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 012-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Sales Pipeline History
              </h2>
              <div v-if="prospect.pipelines && prospect.pipelines.length > 0" class="flow-root">
                <ul role="list" class="-mb-8">
                  <li v-for="(step, idx) in prospect.pipelines" :key="step.id">
                    <div class="relative pb-8">
                      <span v-if="idx !== prospect.pipelines.length - 1" class="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                      <div class="relative flex space-x-3">
                        <div>
                          <span class="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center ring-8 ring-white">
                            <svg class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                        </div>
                        <div class="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                          <div>
                            <p class="text-sm font-medium text-gray-900">Moved to <span class="capitalize text-primary-600">{{ step.stage }}</span> stage</p>
                          </div>
                          <div class="whitespace-nowrap text-right text-xs text-gray-500">
                            {{ formatDate(step.created_at) }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
              <div v-else class="text-center py-6 text-gray-500 italic text-sm">
                No pipeline history available yet.
              </div>
            </Card>
          </div>

          <!-- Sidebar -->
          <div class="space-y-6">
            <!-- Customer Card -->
            <Card>
              <h2 class="text-lg font-bold text-gray-900 mb-4">Customer Contact</h2>
              <div v-if="prospect.customer" class="space-y-4">
                <div>
                  <p class="text-sm font-bold text-gray-900">{{ prospect.customer.name }}</p>
                  <p class="text-xs text-gray-500">{{ prospect.customer.company_name || 'Individual' }}</p>
                </div>
                <div v-if="prospect.customer.email" class="flex items-center gap-2 text-sm">
                  <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 012 2z" />
                  </svg>
                  <a :href="'mailto:' + prospect.customer.email" class="text-primary-600 hover:underline">{{ prospect.customer.email }}</a>
                </div>
                <div v-if="prospect.customer.phone" class="flex items-center gap-2 text-sm">
                  <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a :href="'tel:' + prospect.customer.phone" class="text-primary-600 hover:underline">{{ prospect.customer.phone }}</a>
                </div>
                <router-link
                  :to="'/crm/customers/' + prospect.customer.uuid"
                  class="mt-4 block w-full text-center py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  View Full Profile
                </router-link>
              </div>
            </Card>

            <Card>
              <h2 class="text-lg font-bold text-gray-900 mb-4">Metadata</h2>
              <div class="space-y-3">
                <div>
                  <label class="text-xs font-semibold text-gray-500 uppercase block mb-0.5">UUID</label>
                  <code class="text-[10px] bg-gray-50 p-1 rounded text-gray-600 break-all">{{ prospect.uuid }}</code>
                </div>
                <div>
                  <label class="text-xs font-semibold text-gray-500 uppercase block mb-0.5">Last Interaction</label>
                  <p class="text-xs text-gray-900">{{ formatDate(prospect.updated_at) }}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
        <h2 class="text-xl font-bold text-gray-900">Prospect Not Found</h2>
        <p class="text-gray-500 mt-2">The prospect you are looking for might have been moved or deleted.</p>
        <router-link
          to="/prospects"
          class="inline-flex items-center mt-6 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
        >
          Back to Prospects
        </router-link>
      </div>
    </div>
  </AppLayout>

  <!-- Status Update Modal -->
  <div v-if="showStatusModal" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-end justify-center min-h-screen px-2 py-4 sm:px-4 sm:py-0 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="showStatusModal = false"></div>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full max-w-md">
        <div class="bg-white px-6 py-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">Update Pipeline Stage</h3>
          <div class="space-y-4">
            <label class="block text-sm font-medium text-gray-700">Select new stage</label>
            <select
              v-model="newStatus"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="proposal">Proposal</option>
              <option value="negotiation">Negotiation</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
            </select>
          </div>
        </div>
        <div class="bg-gray-50 px-6 py-3 flex flex-row-reverse gap-3">
          <button
            @click="handleUpdateStatusConfirm"
            :disabled="updatingStatus"
            class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 text-sm font-medium flex items-center gap-2"
          >
            <Spinner v-if="updatingStatus" class="w-4 h-4 text-white" />
            Update Stage
          </button>
          <button
            @click="showStatusModal = false"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import { useProspectStore } from '../../stores/prospect'
import AppLayout from '../../layouts/AppLayout.vue'
import Card from '../../components/common/Card.vue'
import Spinner from '../../components/common/Spinner.vue'
import type { Prospect } from '../../services'

const route = useRoute()
const router = useRouter()
const prospectStore = useProspectStore()

const prospect = ref<Prospect | null>(null)
const loading = ref(true)
const showStatusModal = ref(false)
const newStatus = ref('')
const updatingStatus = ref(false)

const fetchProspect = async () => {
  loading.value = true
  try {
    const uuid = route.params.uuid as string
    prospect.value = await prospectStore.getProspectByUuid(uuid)
    newStatus.value = prospect.value?.status || ''
  } catch (error) {
    console.error('Failed to fetch prospect:', error)
  } finally {
    loading.value = false
  }
}

const handleUpdateStatus = () => {
  showStatusModal.value = true
}

const handleUpdateStatusConfirm = async () => {
  if (!prospect.value) return
  updatingStatus.value = true
  try {
    const updated = await prospectStore.updateProspectStatus(prospect.value.uuid, {
      status: newStatus.value
    })
    prospect.value = updated
    showStatusModal.value = false
    
    Swal.fire({
      title: 'Status Updated',
      text: `Prospect successfully moved to ${newStatus.value} stage.`,
      icon: 'success',
      confirmButtonColor: '#4f46e5'
    })
  } catch (error: any) {
    Swal.fire({
      title: 'Error!',
      text: error.response?.data?.message || 'Failed to update status',
      icon: 'error',
      confirmButtonColor: '#4f46e5'
    })
  } finally {
    updatingStatus.value = false
  }
}

const handleDelete = async () => {
  if (!prospect.value) return
  
  const result = await Swal.fire({
    title: 'Delete Prospect?',
    text: `Are you sure you want to delete this prospect? This action cannot be undone.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  })

  if (result.isConfirmed) {
    try {
      // await prospectStore.deleteProspect(prospect.value.uuid)
      Swal.fire({
        title: 'Note',
        text: 'Delete functionality not yet fully implemented in store',
        icon: 'info',
        confirmButtonColor: '#4f46e5'
      })
    } catch (error: any) {
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to delete prospect',
        icon: 'error',
        confirmButtonColor: '#ef4444'
      })
    }
  }
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('en-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatCurrency = (value: string | number | null) => {
  if (!value) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(Number(value))
}

const getStatusClass = (status: string) => {
  if (!status) return 'bg-gray-100 text-gray-800'
  switch (status.toLowerCase()) {
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

onMounted(() => {
  fetchProspect()
})
</script>
