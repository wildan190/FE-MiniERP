<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Leads</h1>
            <p class="text-gray-600 mt-1">Manage and track all your potential business leads</p>
          </div>
          <button
            @click="showCreateModal = true"
            class="hidden md:flex w-full sm:w-auto px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium items-center justify-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Create Lead
          </button>
        </div>

        <!-- Global Alert -->
        <Alert v-if="leadStore.error" :message="leadStore.error" type="error" @close="leadStore.clearError()" />

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <div class="flex items-center gap-4">
              <div class="p-3 bg-primary-50 rounded-lg">
                <svg class="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Total Leads</p>
                <p class="text-2xl font-bold text-gray-900">{{ leadStore.totalLeads }}</p>
              </div>
            </div>
          </Card>
          <Card>
            <div class="flex items-center gap-4">
              <div class="p-3 bg-green-50 rounded-lg">
                <svg class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Active Sources</p>
                <p class="text-2xl font-bold text-gray-900">{{ activeSourcesCount }}</p>
              </div>
            </div>
          </Card>
          <div class="hidden lg:block">
            <Card>
              <div class="flex items-center gap-4">
                <div class="p-3 bg-orange-50 rounded-lg">
                  <svg class="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">Recent Leads (24h)</p>
                  <p class="text-2xl font-bold text-gray-900">{{ recentLeadsCount }}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <!-- Main Content -->
        <div class="space-y-4">
          <div v-if="leadStore.isLoading && leadStore.isEmpty" class="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <Spinner class="w-10 h-10 text-primary-600" />
            <p class="mt-4 text-gray-500 font-medium">Loading leads...</p>
          </div>

          <template v-else>
            <LeadTable
              :leads="leadStore.leads"
              @view="handleViewLead"
              @convert="handleConvertLead"
              @edit="handleEditLead"
              @delete="handleDeleteLead"
            />

            <!-- Pagination -->
            <ResponsivePagination
              v-if="leadStore.totalPages > 1"
              :current-page="leadStore.currentPage"
              :last-page="leadStore.totalPages"
              :from="(leadStore.currentPage - 1) * 10 + 1"
              :to="Math.min(leadStore.currentPage * 10, leadStore.totalLeads)"
              :total="leadStore.totalLeads"
              :links="leadStore.paginationLinks"
              @page-change="leadStore.fetchLeads"
            />
          </template>
        </div>
      </div>
    </div>

    <!-- Create Modal -->
    <CreateLeadModal
      :is-open="showCreateModal"
      @close="showCreateModal = false"
      @created="handleLeadCreated"
    />
    <!-- Mobile Floating Actions -->
    <MobileActions 
      :primary-action="{
        label: 'New Lead',
        icon: Plus,
        onClick: () => showCreateModal = true
      }"
    />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import { useLeadStore } from '../stores/lead'
import AppLayout from '../layouts/AppLayout.vue'
import Card from '../components/common/Card.vue'
import Button from '../components/common/Button.vue'
import Alert from '../components/common/Alert.vue'
import Spinner from '../components/common/Spinner.vue'
import LeadTable from '../components/crm/LeadTable.vue'
import CreateLeadModal from '../components/crm/CreateLeadModal.vue'
import MobileActions from '../components/common/MobileActions.vue'
import ResponsivePagination from '../components/common/ResponsivePagination.vue'
import { Plus } from 'lucide-vue-next'
import type { Lead } from '../services'

const leadStore = useLeadStore()
const router = useRouter()
const showCreateModal = ref(false)

const activeSourcesCount = computed(() => {
  const sources = new Set(leadStore.leads.map(l => l.source))
  return sources.size
})

const recentLeadsCount = computed(() => {
  const oneDayAgo = new Date()
  oneDayAgo.setDate(oneDayAgo.getDate() - 1)
  return leadStore.leads.filter(l => new Date(l.created_at) > oneDayAgo).length
})

const handleLeadCreated = () => {
  leadStore.fetchLeads(1)
}

const handleViewLead = (lead: Lead) => {
  router.push(`/crm/leads/${lead.uuid}`)
}

const handleConvertLead = async (lead: Lead) => {
  const result = await Swal.fire({
    title: 'Convert Lead?',
    text: `Are you sure you want to convert "${lead.lead_name}" to a Prospect? This will also create a Customer record.`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#4f46e5',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes, convert it!',
    cancelButtonText: 'Cancel'
  })

  if (result.isConfirmed) {
    try {
      const response = await leadStore.convertLead(lead.uuid)
      
      Swal.fire({
        title: 'Converted!',
        text: response.message || 'Lead successfully converted to Prospect',
        icon: 'success',
        confirmButtonColor: '#4f46e5'
      })
    } catch (error: any) {
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to convert lead',
        icon: 'error',
        confirmButtonColor: '#4f46e5'
      })
    }
  }
}

const handleEditLead = (lead: Lead) => {
  console.log('Edit lead', lead)
  // TODO: Implement edit functionality in a modal
}

const handleDeleteLead = async (lead: Lead) => {
  if (confirm(`Are you sure you want to delete lead "${lead.lead_name}"?`)) {
    try {
      // In a real app, you'd call a delete action on the store
      // await leadStore.deleteLead(lead.uuid)
      console.log('Delete lead', lead)
      alert('Delete functionality not yet implemented in store')
    } catch (error) {
      console.error('Failed to delete lead:', error)
    }
  }
}

onMounted(() => {
  leadStore.fetchLeads(1)
})
</script>
