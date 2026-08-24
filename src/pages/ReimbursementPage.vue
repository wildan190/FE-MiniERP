<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-gray-900">Reimbursement</h1>
          <p class="text-sm text-gray-500 mt-1">Manage expense claims and employee reimbursements.</p>
        </div>
        <button
          @click="isClaimModalOpen = true"
          class="btn-primary flex items-center justify-center gap-2"
        >
          <Plus class="h-4 w-4" />
          <span>Submit New Claim</span>
        </button>
      </div>

      <!-- Tabs -->
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-6">
          <button
            v-for="tab in availableTabs"
            :key="tab.id"
            @click="currentTab = tab.id"
            class="whitespace-nowrap py-3 px-1 border-b-2 font-semibold text-sm transition-colors"
            :class="currentTab === tab.id
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
          >
            {{ tab.label }}
          </button>
        </nav>
      </div>

      <!-- Filters -->
      <div class="flex flex-wrap items-center gap-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div class="flex-1 min-w-[200px]">
          <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1 mb-1">Status</label>
          <select
            v-model="filters.status"
            class="input"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="paid">Paid</option>
          </select>
        </div>
        <button 
          @click="loadData(1)"
          class="btn-primary mt-5"
        >
          Apply Filters
        </button>
      </div>

      <!-- Table Section -->
      <div class="space-y-4">
        <ReimbursementTable
          :reimbursements="reimbursementStore.reimbursements"
          :loading="reimbursementStore.loading"
          :is-admin="isAdmin"
          @update-status="openStatusModal"
          @view="viewClaim"
        />

        <!-- Pagination -->
        <ResponsivePagination
          v-if="reimbursementStore.totalPages > 1"
          :current-page="reimbursementStore.currentPage"
          :last-page="reimbursementStore.totalPages"
          :from="reimbursementStore.from"
          :to="reimbursementStore.to"
          :total="reimbursementStore.total"
          :links="reimbursementStore.links"
          @page-change="loadData"
        />
      </div>

      <!-- Claim Submission Modal -->
      <ReimbursementModal
        :is-open="isClaimModalOpen"
        :loading="reimbursementStore.loading"
        @close="isClaimModalOpen = false"
        @submit="handleClaimSubmit"
      />

      <!-- Approval Modal -->
      <ReimbursementStatusModal
        :is-open="isStatusModalOpen"
        :loading="reimbursementStore.loading"
        :claim="selectedClaim"
        @close="isStatusModalOpen = false"
        @submit="handleStatusUpdate"
      />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed } from 'vue'
import { Plus } from 'lucide-vue-next'
import Swal from 'sweetalert2'
import AppLayout from '@/layouts/AppLayout.vue'
import ReimbursementTable from '@/components/hrm/ReimbursementTable.vue'
import ReimbursementModal from '@/components/hrm/ReimbursementModal.vue'
import ReimbursementStatusModal from '@/components/hrm/ReimbursementStatusModal.vue'
import ResponsivePagination from '@/components/common/ResponsivePagination.vue'
import { useReimbursementStore } from '@/stores/reimbursement'
import { useAuthStore } from '@/stores/auth'
import type { CreateReimbursementRequest, Reimbursement, ReimbursementStatus, UpdateReimbursementStatusRequest } from '@/services/hrm/types/reimbursement.types'

const reimbursementStore = useReimbursementStore()
const authStore = useAuthStore()

const currentTab = ref<'all' | 'my'>('my')
const isClaimModalOpen = ref(false)
const isStatusModalOpen = ref(false)
const selectedClaim = ref<Reimbursement | null>(null)

const filters = reactive({
  status: '' as ReimbursementStatus | '',
})

// Simplified role check - assuming admin can see "all"
const isAdmin = computed(() => {
  return true // Replace with actual auth logic if available
})

const availableTabs = computed(() => {
  const tabs: { id: 'all' | 'my'; label: string }[] = [{ id: 'my', label: 'My Claims' }]
  if (isAdmin.value) {
    tabs.unshift({ id: 'all', label: 'All Reimbursements' })
  }
  return tabs
})

// Default to 'all' if admin
onMounted(() => {
  if (isAdmin.value) currentTab.value = 'all'
  loadData()
})

const loadData = async (page: number = 1) => {
  try {
    const filterData = { status: filters.status || undefined }
    if (currentTab.value === 'all') {
      await reimbursementStore.fetchReimbursements(filterData, page)
    } else {
      await reimbursementStore.fetchMyClaims(filterData, page)
    }
  } catch (error: any) {
    Swal.fire({ title: 'Error!', text: error.message || 'Failed to load data', icon: 'error' })
  }
}

watch(currentTab, () => {
  loadData(1)
})

const handleClaimSubmit = async (data: CreateReimbursementRequest) => {
  try {
    await reimbursementStore.submitClaim(data)
    isClaimModalOpen.value = false
    Swal.fire({ title: 'Success!', text: 'Claim submitted successfully', icon: 'success' })
    loadData(1)
  } catch (error: any) {
    Swal.fire({ title: 'Error!', text: error.message || 'Failed to submit claim', icon: 'error' })
  }
}

const openStatusModal = (claim: Reimbursement) => {
  selectedClaim.value = claim
  isStatusModalOpen.value = true
}

const handleStatusUpdate = async (data: UpdateReimbursementStatusRequest) => {
  if (!selectedClaim.value) return
  try {
    await reimbursementStore.updateStatus(selectedClaim.value.uuid, data)
    isStatusModalOpen.value = false
    Swal.fire({ title: 'Success!', text: `Claim marked as ${data.status}`, icon: 'success' })
    // No need to reload if store updates local state, but good for sync
    loadData(reimbursementStore.currentPage)
  } catch (error: any) {
    Swal.fire({ title: 'Error!', text: error.message || 'Failed to update claim', icon: 'error' })
  }
}

const viewClaim = (claim: Reimbursement) => {
  let details = `
    <div class="text-left space-y-2 text-sm">
      <p><strong>Employee:</strong> ${claim?.employee?.user?.name || '-'}</p>
      <p><strong>Type:</strong> ${claim?.type || '-'}</p>
      <p><strong>Amount:</strong> ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(claim?.amount || 0)}</p>
      <p><strong>Description:</strong> ${claim?.description || '-'}</p>
      <p><strong>Status:</strong> <span class="uppercase font-bold">${claim?.status || '-'}</span></p>
  `
  
  if (claim?.approved_at) {
    details += `<p><strong>Processed At:</strong> ${new Date(claim.approved_at).toLocaleString()}</p>`
  }
  if (claim?.rejection_reason) {
    details += `<p class="text-red-600"><strong>Rejection Reason:</strong> ${claim.rejection_reason}</p>`
  }
  
  details += `</div>`

  Swal.fire({
    title: 'Claim Details',
    html: details,
    showCloseButton: true,
    showConfirmButton: false
  })
}
</script>
