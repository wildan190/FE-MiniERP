<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Prospects</h1>
            <p class="text-gray-600 mt-1">Nurture and convert leads into customers</p>
          </div>
          <button
            @click="showCreateModal = true"
            class="w-full sm:w-auto px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Create Prospect
          </button>
        </div>

        <!-- Global Alert -->
        <Alert v-if="prospectStore.error" :message="prospectStore.error" type="error" @close="prospectStore.clearError()" />

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <div class="text-center">
              <p class="text-sm text-gray-500 font-medium">Total Prospects</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">{{ prospectStore.totalProspects }}</p>
            </div>
          </Card>
          <Card>
            <div class="text-center">
              <p class="text-sm text-gray-500 font-medium">In Negotiation</p>
              <p class="text-2xl font-bold text-orange-600 mt-1">{{ countByStatus('negotiation') }}</p>
            </div>
          </Card>
          <Card>
            <div class="text-center">
              <p class="text-sm text-gray-500 font-medium">Won This Month</p>
              <p class="text-2xl font-bold text-green-600 mt-1">{{ countByStatus('won') }}</p>
            </div>
          </Card>
          <Card>
            <div class="text-center">
              <p class="text-sm text-gray-500 font-medium">Conversion Rate</p>
              <p class="text-2xl font-bold text-primary-600 mt-1">{{ conversionRate }}%</p>
            </div>
          </Card>
        </div>

        <!-- Main Content -->
        <div class="space-y-4">
          <div v-if="prospectStore.isLoading && prospectStore.isEmpty" class="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <Spinner class="w-10 h-10 text-primary-600" />
            <p class="mt-4 text-gray-500 font-medium">Loading prospects...</p>
          </div>

          <template v-else>
            <ProspectTable
              :prospects="prospectStore.prospects"
              @view="handleViewProspect"
              @updateStatus="handleOpenStatusModal"
              @delete="handleDeleteProspect"
            />

            <!-- Pagination -->
            <div v-if="prospectStore.totalPages > 1" class="flex flex-col sm:flex-row justify-between items-center bg-white px-6 py-4 rounded-xl shadow-sm border border-gray-100 gap-4">
              <p class="text-sm text-gray-600">
                Page <span class="font-semibold text-gray-900">{{ prospectStore.currentPage }}</span> of <span class="font-semibold text-gray-900">{{ prospectStore.totalPages }}</span>
              </p>
              <div class="flex gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  class="flex-1 sm:flex-none"
                  @click="prospectStore.fetchProspects(prospectStore.currentPage - 1)"
                  :disabled="prospectStore.currentPage === 1"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  class="flex-1 sm:flex-none"
                  @click="prospectStore.fetchProspects(prospectStore.currentPage + 1)"
                  :disabled="prospectStore.currentPage === prospectStore.totalPages"
                >
                  Next
                </Button>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Create Modal -->
    <CreateProspectModal
      :is-open="showCreateModal"
      @close="showCreateModal = false"
      @created="handleProspectCreated"
    />

    <!-- Status Update Modal -->
    <div v-if="showStatusModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen px-2 py-4 sm:px-4 sm:py-0 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="showStatusModal = false"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full max-w-md">
          <div class="bg-white px-6 py-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4">Update Status</h3>
            <div class="space-y-4">
              <p class="text-sm text-gray-600">
                Update status for <span class="font-semibold">{{ selectedProspect?.customer?.name }}</span>
              </p>
              <select
                v-model="statusForm.status"
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
              @click="handleUpdateStatus"
              :disabled="isUpdating"
              class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 text-sm font-medium"
            >
              {{ isUpdating ? 'Updating...' : 'Update' }}
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
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProspectStore } from '../stores/prospect'
import AppLayout from '../layouts/AppLayout.vue'
import Card from '../components/common/Card.vue'
import Button from '../components/common/Button.vue'
import Alert from '../components/common/Alert.vue'
import Spinner from '../components/common/Spinner.vue'
import ProspectTable from '../components/crm/ProspectTable.vue'
import CreateProspectModal from '../components/crm/CreateProspectModal.vue'
import type { Prospect } from '../services'

const prospectStore = useProspectStore()
const router = useRouter()
const showCreateModal = ref(false)
const showStatusModal = ref(false)
const isUpdating = ref(false)
const selectedProspect = ref<Prospect | null>(null)
const statusForm = reactive({
  status: ''
})

const handleProspectCreated = () => {
  prospectStore.fetchProspects(1)
}

const handleViewProspect = (prospect: Prospect) => {
  router.push(`/crm/prospects/${prospect.uuid}`)
}

const handleOpenStatusModal = (prospect: Prospect) => {
  selectedProspect.value = prospect
  statusForm.status = prospect.status
  showStatusModal.value = true
}

const handleUpdateStatus = async () => {
  if (!selectedProspect.value) return
  isUpdating.value = true
  try {
    await prospectStore.updateProspectStatus(selectedProspect.value.uuid, {
      status: statusForm.status
    })
    showStatusModal.value = false
  } catch (error) {
    console.error('Failed to update status:', error)
  } finally {
    isUpdating.value = false
  }
}

const handleDeleteProspect = async (prospect: Prospect) => {
  if (confirm(`Are you sure you want to delete prospect for "${prospect.customer?.name}"?`)) {
    console.log('Delete prospect', prospect)
    alert('Delete functionality not yet implemented in store')
  }
}

const countByStatus = (status: string) => {
  return prospectStore.prospects.filter(p => p.status === status).length
}

const conversionRate = computed(() => {
  if (prospectStore.totalProspects === 0) return 0
  const wonCount = prospectStore.prospects.filter(p => p.status === 'won').length
  return Math.round((wonCount / prospectStore.prospects.length) * 100) || 0
})

onMounted(() => {
  prospectStore.fetchProspects(1)
})
</script>
