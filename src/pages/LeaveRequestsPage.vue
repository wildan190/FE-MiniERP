<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Leave Requests</h1>
          <p class="text-gray-600 mt-1">Manage and track employee leave applications</p>
        </div>
        <button
          @click="openApplyModal"
          class="hidden md:flex px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium items-center gap-2"
        >
          <Plus class="h-5 w-5" />
          Apply for Leave
        </button>
      </div>

      <!-- Leave Balance Cards -->
      <div v-if="myLeaveBalance.length > 0" class="mb-8">
        <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">My Leave Balance</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <Card v-for="balance in myLeaveBalance" :key="balance.id" class="p-0">
            <div class="flex items-center gap-4">
              <div class="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <CalendarDays class="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p class="text-xs text-gray-500 font-medium">{{ balance.leave_type?.name || 'Leave' }}</p>
                <p class="text-2xl font-bold text-gray-900">{{ balance.remaining_days }}</p>
                <p class="text-xs text-gray-400">of {{ balance.total_days }} days remaining</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <Card>
          <div class="text-center">
            <p class="text-gray-600 text-sm">Total</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">{{ pagination.total }}</p>
          </div>
        </Card>
        <Card>
          <div class="text-center">
            <p class="text-gray-600 text-sm">Pending</p>
            <p class="text-3xl font-bold text-amber-500 mt-1">{{ countByStatus('pending') }}</p>
          </div>
        </Card>
        <Card>
          <div class="text-center">
            <p class="text-gray-600 text-sm">Approved</p>
            <p class="text-3xl font-bold text-emerald-500 mt-1">{{ countByStatus('approved') }}</p>
          </div>
        </Card>
        <Card>
          <div class="text-center">
            <p class="text-gray-600 text-sm">Rejected</p>
            <p class="text-3xl font-bold text-red-500 mt-1">{{ countByStatus('rejected') }}</p>
          </div>
        </Card>
      </div>

      <!-- Content -->
      <div class="space-y-4">
        <div v-if="isLoading" class="flex justify-center py-12">
          <Spinner />
        </div>

        <div v-else-if="leaveRequests.length === 0" class="text-center py-16 bg-white rounded-xl border border-gray-200">
          <CalendarX class="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <h3 class="text-base font-semibold text-gray-900">No leave requests found</h3>
          <p class="text-sm text-gray-500 mt-1 mb-4">Apply for leave to get started.</p>
          <button @click="openApplyModal" class="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium">
            <Plus class="h-4 w-4" />
            Apply for Leave
          </button>
        </div>

        <div v-else class="space-y-3">
          <!-- Mobile Card List -->
          <div class="md:hidden space-y-3">
            <div
              v-for="req in leaveRequests"
              :key="req.uuid"
              class="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
            >
              <div class="flex items-start justify-between mb-3">
                <div>
                  <p class="text-sm font-semibold text-gray-900">{{ req.employee?.user?.name || req.employee?.first_name || 'N/A' }}</p>
                  <p class="text-xs text-gray-500 mt-0.5">{{ req.leave_type?.name || '-' }}</p>
                </div>
                <span :class="getStatusClass(req.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold">
                  {{ req.status }}
                </span>
              </div>
              <div class="text-xs text-gray-600 space-y-1 mb-3">
                <p><span class="font-medium">Period:</span> {{ formatDate(req.start_date) }} – {{ formatDate(req.end_date) }}</p>
                <p><span class="font-medium">Reason:</span> {{ req.reason }}</p>
              </div>
              <button
                v-if="req.status === 'pending'"
                @click="openStatusModal(req)"
                class="w-full text-center text-sm text-primary-600 font-medium py-1.5 rounded-lg border border-primary-200 hover:bg-primary-50 transition-colors"
              >
                Update Status
              </button>
            </div>
          </div>

          <!-- Desktop Table -->
          <div class="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="req in leaveRequests" :key="req.uuid" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center gap-3">
                      <div class="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-sm font-bold flex-shrink-0">
                        {{ getInitials(req.employee?.user?.name || `${req.employee?.first_name || 'NA'}`) }}
                      </div>
                      <div>
                        <p class="text-sm font-medium text-gray-900">{{ req.employee?.user?.name || `${req.employee?.first_name} ${req.employee?.last_name}` }}</p>
                        <p class="text-xs text-gray-500">{{ req.employee?.user?.email || '-' }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ req.leave_type?.name || '-' }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {{ formatDate(req.start_date) }} – {{ formatDate(req.end_date) }}
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" :title="req.reason">{{ req.reason }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getStatusClass(req.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold">
                      {{ req.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button
                      v-if="req.status === 'pending'"
                      @click="openStatusModal(req)"
                      class="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                    >
                      <ClipboardEdit class="h-3.5 w-3.5" />
                      Update Status
                    </button>
                    <span v-else class="text-xs text-gray-400">—</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <ResponsivePagination
            v-if="pagination.total > 0"
            :current-page="pagination.current_page"
            :last-page="pagination.last_page"
            :from="pagination.from"
            :to="pagination.to"
            :total="pagination.total"
            :links="pagination.links"
            @page-change="loadData"
          />
        </div>
      </div>

      <!-- Apply Leave Modal -->
      <ApplyLeaveModal
        :is-open="isApplyModalOpen"
        :loading="isSubmitting"
        :leave-types="leaveTypes"
        :leave-balance="myLeaveBalance"
        :errors="submitErrors"
        :error-message="submitErrorMessage"
        @close="closeApplyModal"
        @submit="handleApplyLeave"
      />

      <!-- Update Status Modal -->
      <UpdateLeaveStatusModal
        :is-open="isStatusModalOpen"
        :loading="isUpdatingStatus"
        :leave-request="selectedRequest"
        @close="closeStatusModal"
        @submit="handleUpdateStatus"
      />

      <!-- Mobile Floating Action -->
      <MobileActions
        :primary-action="{
          label: 'Apply for Leave',
          icon: Plus,
          onClick: openApplyModal,
        }"
      />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Swal from 'sweetalert2'
import AppLayout from '../layouts/AppLayout.vue'
import Card from '../components/common/Card.vue'
import Spinner from '../components/common/Spinner.vue'
import MobileActions from '../components/common/MobileActions.vue'
import ResponsivePagination from '../components/common/ResponsivePagination.vue'
import ApplyLeaveModal from '../components/hrm/ApplyLeaveModal.vue'
import UpdateLeaveStatusModal from '../components/hrm/UpdateLeaveStatusModal.vue'
import { Plus, CalendarDays, CalendarX, ClipboardEdit } from 'lucide-vue-next'
import { useLeaveRequestStore } from '../stores/leave-request'
import { useLeaveTypeStore } from '../stores/leave-type'
import type { LeaveRequest, CreateLeaveRequestRequest, UpdateLeaveRequestStatusRequest } from '../services/hrm/types/leave-request.types'
import type { LeaveBalance } from '../services/hrm/types/leave-request.types'
import type { LeaveType } from '../services/hrm/types/leave-type.types'
import type { PaginationLink } from '../services/types'

const leaveRequestStore = useLeaveRequestStore()
const leaveTypeStore = useLeaveTypeStore()

const leaveRequests = ref<LeaveRequest[]>([])
const myLeaveBalance = ref<LeaveBalance[]>([])
const leaveTypes = ref<LeaveType[]>([])
const isLoading = ref(false)
const isSubmitting = ref(false)
const isUpdatingStatus = ref(false)

const isApplyModalOpen = ref(false)
const isStatusModalOpen = ref(false)
const selectedRequest = ref<LeaveRequest | null>(null)

const pagination = ref({
  current_page: 1,
  from: 0,
  to: 0,
  total: 0,
  last_page: 1,
  links: [] as PaginationLink[],
})

const submitErrors = ref<Record<string, string[]> | null>(null)
const submitErrorMessage = ref<string | null>(null)

const countByStatus = computed(() => (status: string) =>
  leaveRequests.value.filter((r) => r.status === status).length,
)

const getStatusClass = (status: string) => {
  switch (status) {
    case 'approved': return 'bg-emerald-100 text-emerald-700'
    case 'rejected': return 'bg-red-100 text-red-700'
    default: return 'bg-amber-100 text-amber-700'
  }
}

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })

const loadData = async (page = 1) => {
  isLoading.value = true
  try {
    await leaveRequestStore.fetchLeaveRequests(page)
    leaveRequests.value = leaveRequestStore.leaveRequests
    pagination.value = {
      current_page: leaveRequestStore.currentPage,
      from: (leaveRequestStore.currentPage - 1) * leaveRequestStore.perPage + 1,
      to: Math.min(leaveRequestStore.currentPage * leaveRequestStore.perPage, leaveRequestStore.total),
      total: leaveRequestStore.total,
      last_page: leaveRequestStore.totalPages,
      links: [],
    }
  } catch (err) {
    console.error('Failed to load leave requests:', err)
  } finally {
    isLoading.value = false
  }
}

const loadSupportingData = async () => {
  try {
    await Promise.all([
      leaveTypeStore.fetchLeaveTypes(),
      leaveRequestStore.fetchMyLeaveBalance(),
    ])
    leaveTypes.value = leaveTypeStore.leaveTypes
    myLeaveBalance.value = leaveRequestStore.myLeaveBalance
  } catch (err) {
    console.error('Failed to load supporting data:', err)
  }
}

const openApplyModal = () => {
  submitErrors.value = null
  submitErrorMessage.value = null
  isApplyModalOpen.value = true
}

const closeApplyModal = () => {
  isApplyModalOpen.value = false
}

const openStatusModal = (req: LeaveRequest) => {
  selectedRequest.value = req
  isStatusModalOpen.value = true
}

const closeStatusModal = () => {
  isStatusModalOpen.value = false
  selectedRequest.value = null
}

const handleApplyLeave = async (data: CreateLeaveRequestRequest) => {
  isSubmitting.value = true
  submitErrors.value = null
  submitErrorMessage.value = null

  try {
    await leaveRequestStore.createLeaveRequest(data)
    await Swal.fire({ title: 'Success!', text: 'Leave request submitted successfully', icon: 'success', confirmButtonColor: '#10b981' })
    closeApplyModal()
    await loadData()
    await loadSupportingData()
  } catch (err: any) {
    if (err.response?.status === 422) {
      submitErrors.value = err.response.data.errors
      submitErrorMessage.value = 'Please correct the errors below.'
    } else {
      submitErrorMessage.value = err.response?.data?.message || 'Failed to submit leave request.'
      Swal.fire({ title: 'Error!', text: submitErrorMessage.value || 'Error', icon: 'error', confirmButtonColor: '#ef4444' })
    }
  } finally {
    isSubmitting.value = false
  }
}

const handleUpdateStatus = async (data: UpdateLeaveRequestStatusRequest) => {
  if (!selectedRequest.value) return

  isUpdatingStatus.value = true
  try {
    await leaveRequestStore.updateLeaveRequestStatus(selectedRequest.value.uuid, data)
    await Swal.fire({
      title: 'Updated!',
      text: `Leave request has been ${data.status}.`,
      icon: 'success',
      confirmButtonColor: '#10b981',
    })
    closeStatusModal()
    await loadData(pagination.value.current_page)
  } catch (err: any) {
    Swal.fire({ title: 'Error!', text: err.response?.data?.message || 'Failed to update status', icon: 'error', confirmButtonColor: '#ef4444' })
  } finally {
    isUpdatingStatus.value = false
  }
}

onMounted(async () => {
  await Promise.all([loadData(), loadSupportingData()])
})
</script>
