<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <Spinner class="w-10 h-10 text-primary-600" />
        <p class="mt-4 text-gray-500 font-medium">Loading lead details...</p>
      </div>

      <div v-else-if="lead" class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div class="flex items-center gap-4">
            <div class="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {{ lead.lead_name?.charAt(0).toUpperCase() || 'L' }}
            </div>
            <div>
              <h1 class="text-3xl font-bold text-gray-900">{{ lead.lead_name }}</h1>
              <div class="flex flex-wrap items-center gap-2 mt-1">
                <span 
                  class="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider"
                  :class="getStatusClass(lead.status)"
                >
                  {{ lead.status }}
                </span>
                <span class="text-gray-400">•</span>
                <span class="text-gray-600 text-sm">Source: {{ lead.source }}</span>
                <span class="text-gray-400">•</span>
                <span class="text-gray-600 text-sm">Created {{ formatDate(lead.created_at) }}</span>
              </div>
            </div>
          </div>
          <div class="flex flex-wrap gap-2 w-full sm:w-auto">
            <button
              v-if="lead.status.toLowerCase() === 'new'"
              @click="handleConvert"
              :disabled="converting"
              class="flex-1 sm:flex-none px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <svg v-if="!converting" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <Spinner v-else class="w-4 h-4 text-white" />
              {{ converting ? 'Converting...' : 'Convert to Prospect' }}
            </button>
            <button
              class="flex-1 sm:flex-none px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Edit
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
            <Card>
              <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Lead Information
              </h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Company</label>
                  <p class="text-gray-900 font-medium">{{ lead.company || 'Not specified' }}</p>
                </div>
                <div>
                  <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Status</label>
                  <span 
                    class="px-2 py-0.5 rounded-full text-xs font-semibold uppercase"
                    :class="getStatusClass(lead.status)"
                  >
                    {{ lead.status }}
                  </span>
                </div>
                <div>
                  <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Email Address</label>
                  <a v-if="lead.email" :href="'mailto:' + lead.email" class="text-primary-600 hover:underline font-medium">{{ lead.email }}</a>
                  <p v-else class="text-gray-400 italic">No email provided</p>
                </div>
                <div>
                  <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Phone Number</label>
                  <a v-if="lead.phone" :href="'tel:' + lead.phone" class="text-primary-600 hover:underline font-medium">{{ lead.phone }}</a>
                  <p v-else class="text-gray-400 italic">No phone provided</p>
                </div>
              </div>
            </Card>

            <Card v-if="lead.notes">
              <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Notes
              </h2>
              <p class="text-gray-700 leading-relaxed whitespace-pre-wrap">{{ lead.notes }}</p>
            </Card>
          </div>

          <!-- Sidebar Info -->
          <div class="space-y-6">
            <Card>
              <h2 class="text-lg font-bold text-gray-900 mb-4">Metadata</h2>
              <div class="space-y-4">
                <div>
                  <label class="text-xs font-semibold text-gray-500 uppercase block mb-1">Source</label>
                  <p class="text-sm font-medium text-gray-900">{{ lead.source }}</p>
                </div>
                <div>
                  <label class="text-xs font-semibold text-gray-500 uppercase block mb-1">UUID</label>
                  <code class="text-[10px] bg-gray-50 p-1 rounded text-gray-600 break-all">{{ lead.uuid }}</code>
                </div>
                <div>
                  <label class="text-xs font-semibold text-gray-500 uppercase block mb-1">Last Updated</label>
                  <p class="text-sm text-gray-900">{{ formatDate(lead.updated_at) }}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
        <div class="inline-flex items-center justify-center p-4 bg-red-50 rounded-full mb-4">
          <svg class="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 class="text-xl font-bold text-gray-900">Lead Not Found</h2>
        <p class="text-gray-500 mt-2">The lead you are looking for might have been moved or deleted.</p>
        <router-link
          to="/crm/leads"
          class="inline-flex items-center mt-6 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
        >
          Back to Leads
        </router-link>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import { useLeadStore } from '../../stores/lead'
import AppLayout from '../../layouts/AppLayout.vue'
import Card from '../../components/common/Card.vue'
import Spinner from '../../components/common/Spinner.vue'
import type { Lead } from '../../services'

const route = useRoute()
const router = useRouter()
const leadStore = useLeadStore()

const lead = ref<Lead | null>(null)
const loading = ref(true)
const converting = ref(false)

const fetchLead = async () => {
  loading.value = true
  try {
    const uuid = route.params.uuid as string
    lead.value = await leadStore.getLeadByUuid(uuid)
  } catch (error) {
    console.error('Failed to fetch lead:', error)
  } finally {
    loading.value = false
  }
}

const handleConvert = async () => {
  if (!lead.value) return
  
  const result = await Swal.fire({
    title: 'Convert Lead?',
    text: `Are you sure you want to convert "${lead.value.lead_name}" to a Prospect?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#10b981',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes, convert it!',
    cancelButtonText: 'Cancel'
  })

  if (result.isConfirmed) {
    converting.value = true
    try {
      const response = await leadStore.convertLead(lead.value.uuid)
      
      await Swal.fire({
        title: 'Converted!',
        text: response.message || 'Lead successfully converted to Prospect',
        icon: 'success',
        confirmButtonColor: '#10b981'
      })
      
      // Update local status so the button disappears and status badge updates
      lead.value.status = 'converted'
    } catch (error: any) {
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to convert lead',
        icon: 'error',
        confirmButtonColor: '#10b981'
      })
    } finally {
      converting.value = false
    }
  }
}

const handleDelete = async () => {
  if (!lead.value) return
  
  const result = await Swal.fire({
    title: 'Delete Lead?',
    text: `Are you sure you want to delete lead "${lead.value.lead_name}"? This action cannot be undone.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  })

  if (result.isConfirmed) {
    try {
      // await leadStore.deleteLead(lead.value.uuid)
      Swal.fire({
        title: 'Note',
        text: 'Delete functionality not yet fully implemented in store',
        icon: 'info',
        confirmButtonColor: '#4f46e5'
      })
    } catch (error: any) {
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to delete lead',
        icon: 'error',
        confirmButtonColor: '#ef4444'
      })
    }
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('en-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusClass = (status: string) => {
  if (!status) return 'bg-gray-100 text-gray-800'
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

onMounted(() => {
  fetchLead()
})
</script>
