<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Leave Management</h1>
          <p class="text-gray-600 mt-1">Manage leave requests and policies in one place</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            v-if="activeTab === 'Requests'"
            @click="openApplyModal"
            class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium flex items-center gap-2"
          >
            <Plus class="h-5 w-5" />
            Apply for Leave
          </button>
          <button
            v-if="activeTab === 'Types'"
            @click="openCreateTypeModal"
            class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium flex items-center gap-2"
          >
            <Plus class="h-5 w-5" />
            New Leave Type
          </button>
        </div>
      </div>

      <!-- Tab Selection -->
      <div class="flex gap-4 border-b border-gray-200 mb-8">
        <button
          v-for="tab in tabs"
          :key="tab"
          @click="activeTab = tab"
          :class="
            activeTab === tab
              ? 'border-b-2 border-primary-600 text-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          "
          class="px-4 py-3 font-medium text-sm transition-colors whitespace-nowrap"
        >
          {{ tab }}
        </button>
      </div>

      <!-- Tab Content -->
      <div v-if="activeTab === 'Requests'">
        <!-- Leave Balance Cards -->
        <div v-if="isLoadingRequests || myLeaveBalance.length > 0" class="mb-8">
          <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">My Leave Balance</h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <template v-if="isLoadingRequests">
              <Card v-for="i in 4" :key="i" class="p-4">
                <div class="flex items-center gap-4">
                  <Skeleton width="3rem" height="3rem" borderRadius="0.75rem" />
                  <div class="space-y-2">
                    <Skeleton width="5rem" height="0.75rem" />
                    <Skeleton width="3rem" height="1.5rem" />
                    <Skeleton width="6rem" height="0.625rem" />
                  </div>
                </div>
              </Card>
            </template>
            <template v-else>
              <Card v-for="balance in myLeaveBalance" :key="balance.id" class="p-4">
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
            </template>
          </div>
        </div>

        <!-- Requests Content -->
        <!-- Stats -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <Card v-for="stat in requestStats" :key="stat.label">
            <div class="text-center">
              <p class="text-gray-600 text-sm">{{ stat.label }}</p>
              <div v-if="isLoadingRequests" class="flex justify-center mt-1">
                <Skeleton width="3rem" height="2rem" />
              </div>
              <p v-else class="text-3xl font-bold mt-1" :class="stat.colorClass">{{ stat.value }}</p>
            </div>
          </Card>
        </div>

        <div class="space-y-4">
          <div v-if="!isLoadingRequests && leaveRequests.length === 0" class="text-center py-16 bg-white rounded-xl border border-gray-200">
            <CalendarX class="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 class="text-base font-semibold text-gray-900">No leave requests found</h3>
            <p class="text-sm text-gray-500 mt-1 mb-4">Apply for leave to get started.</p>
            <button @click="openApplyModal" class="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium">
              <Plus class="h-4 w-4" />
              Apply for Leave
            </button>
          </div>

          <div v-else class="space-y-3">
            <!-- Table and List -->
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
                  <template v-if="isLoadingRequests">
                    <tr v-for="i in 5" :key="i">
                      <td class="px-6 py-4">
                        <div class="flex items-center gap-3">
                          <Skeleton width="2rem" height="2rem" borderRadius="9999px" />
                          <div class="space-y-2">
                            <Skeleton width="10rem" height="0.875rem" />
                            <Skeleton width="12rem" height="0.75rem" />
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4"><Skeleton width="6rem" height="0.875rem" /></td>
                      <td class="px-6 py-4"><Skeleton width="10rem" height="0.875rem" /></td>
                      <td class="px-6 py-4"><Skeleton width="12rem" height="0.75rem" /></td>
                      <td class="px-6 py-4"><Skeleton width="4rem" height="1.25rem" /></td>
                      <td class="px-6 py-4 text-right"><Skeleton width="6rem" height="2rem" customClass="ml-auto" /></td>
                    </tr>
                  </template>
                  <template v-else>
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
                          @click="openStatusUpdateModal(req)"
                          class="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                        >
                          <ClipboardEdit class="h-3.5 w-3.5" />
                          Update Status
                        </button>
                        <span v-else class="text-xs text-gray-400">—</span>
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>

            <!-- Mobile Card List -->
            <div class="md:hidden space-y-3">
              <template v-if="isLoadingRequests">
                <div v-for="i in 3" :key="i" class="bg-white rounded-xl border border-gray-200 p-4 shadow-sm space-y-4">
                  <div class="flex items-start justify-between">
                    <div class="space-y-2">
                      <Skeleton width="10rem" height="1rem" />
                      <Skeleton width="6rem" height="0.75rem" />
                    </div>
                    <Skeleton width="4rem" height="1.25rem" />
                  </div>
                  <div class="space-y-2">
                    <Skeleton width="100%" height="0.75rem" />
                    <Skeleton width="80%" height="0.75rem" />
                  </div>
                  <Skeleton width="100%" height="2.5rem" />
                </div>
              </template>
              <template v-else>
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
                    @click="openStatusUpdateModal(req)"
                    class="w-full text-center text-sm text-primary-600 font-medium py-1.5 rounded-lg border border-primary-200 hover:bg-primary-50 transition-colors"
                  >
                    Update Status
                  </button>
                </div>
              </template>
            </div>

            <!-- Pagination -->
            <ResponsivePagination
              v-if="!isLoadingRequests && pagination.total > 0"
              :current-page="pagination.current_page"
              :last-page="pagination.last_page"
              :from="pagination.from"
              :to="pagination.to"
              :total="pagination.total"
              :links="pagination.links"
              @page-change="loadRequestsData"
            />
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'Types'">
        <!-- Stats for Types -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card>
            <div class="text-center">
              <p class="text-gray-600 text-sm">Total Leave Types</p>
              <div v-if="isLoadingTypes" class="flex justify-center mt-2">
                <Skeleton width="4rem" height="2rem" />
              </div>
              <p v-else class="text-3xl font-bold text-gray-900 mt-2">{{ leaveTypes.length }}</p>
            </div>
          </Card>
          <Card>
            <div class="text-center">
              <p class="text-gray-600 text-sm">Total Days Allowed</p>
              <div v-if="isLoadingTypes" class="flex justify-center mt-2">
                <Skeleton width="4rem" height="2rem" />
              </div>
              <p v-else class="text-3xl font-bold text-primary-600 mt-2">{{ totalDaysAllowed }}</p>
            </div>
          </Card>
        </div>

        <div class="space-y-4">
          <div class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <!-- Desktop Table for Types -->
            <table class="min-w-full divide-y divide-gray-200 hidden md:table">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Allowed</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <template v-if="isLoadingTypes">
                  <tr v-for="i in 5" :key="i">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <Skeleton width="10rem" height="1rem" />
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap"><Skeleton width="4rem" height="1.25rem" /></td>
                    <td class="px-6 py-4"><Skeleton width="12rem" height="1rem" /></td>
                    <td class="px-6 py-4 text-right"><Skeleton width="5rem" height="1.25rem" customClass="ml-auto" /></td>
                  </tr>
                </template>
                <template v-else>
                  <tr v-for="lt in leaveTypes" :key="lt.uuid" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center gap-3">
                        <div class="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                          <CalendarDays class="h-4 w-4 text-emerald-600" />
                        </div>
                        <span class="text-sm font-medium text-gray-900">{{ lt.name }}</span>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                        {{ lt.days_allowed }} days
                      </span>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-500 truncate max-w-xs" :title="lt.description || undefined">
                      {{ lt.description || '-' }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div class="flex items-center justify-end gap-2">
                        <button
                          @click="handleEditType(lt)"
                          class="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        >
                          <Pencil class="h-4 w-4" />
                        </button>
                        <button
                          @click="handleDeleteType(lt.uuid)"
                          class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 class="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>

            <!-- Mobile List for Types -->
            <div class="md:hidden divide-y divide-gray-200">
              <template v-if="isLoadingTypes">
                <div v-for="i in 3" :key="i" class="p-4 space-y-2">
                  <Skeleton width="12rem" height="1rem" />
                  <Skeleton width="8rem" height="0.75rem" />
                </div>
              </template>
              <template v-else>
                <div v-for="lt in leaveTypes" :key="lt.uuid" class="p-4 flex items-center justify-between">
                  <div>
                    <p class="text-sm font-semibold text-gray-900">{{ lt.name }}</p>
                    <p class="text-xs text-gray-500">{{ lt.days_allowed }} days allowed</p>
                  </div>
                  <div class="flex items-center gap-1">
                    <button @click="handleEditType(lt)" class="p-2 text-gray-400 hover:text-primary-600">
                      <Pencil class="h-4 w-4" />
                    </button>
                    <button @click="handleDeleteType(lt.uuid)" class="p-2 text-gray-400 hover:text-red-600">
                      <Trash2 class="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </template>
            </div>
          </div>

          <!-- Empty State for Types -->
          <div v-if="!isLoadingTypes && leaveTypes.length === 0" class="text-center py-16 bg-white rounded-xl border border-gray-200">
            <CalendarDays class="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 class="text-base font-semibold text-gray-900">No leave types yet</h3>
            <p class="text-sm text-gray-500 mt-1 mb-4">Start by creating a leave type policy.</p>
            <button @click="openCreateTypeModal" class="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium">
              <Plus class="h-4 w-4" />
              New Leave Type
            </button>
          </div>
        </div>
      </div>

      <!-- Modals Reused -->
      <ApplyLeaveModal
        :is-open="isApplyModalOpen"
        :loading="isSubmittingRequest"
        :leave-types="leaveTypes"
        :leave-balance="myLeaveBalance"
        :errors="submitRequestErrors"
        :error-message="submitRequestErrorMessage"
        @close="closeApplyModal"
        @submit="handleApplyLeave"
      />

      <UpdateLeaveStatusModal
        :is-open="isStatusModalOpen"
        :loading="isUpdatingStatus"
        :leave-request="selectedRequest"
        @close="closeStatusModal"
        @submit="handleUpdateStatus"
      />

      <CreateLeaveTypeModal
        :is-open="isTypeModalOpen"
        :loading="isSubmittingType"
        :editing="selectedLeaveType"
        :errors="submitTypeErrors"
        :error-message="submitTypeErrorMessage"
        @close="closeTypeModal"
        @submit="handleSaveType"
      />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2'
import AppLayout from '../layouts/AppLayout.vue'
import Card from '../components/common/Card.vue'
import Skeleton from '../components/common/Skeleton.vue'
import ResponsivePagination from '../components/common/ResponsivePagination.vue'
import ApplyLeaveModal from '../components/hrm/ApplyLeaveModal.vue'
import UpdateLeaveStatusModal from '../components/hrm/UpdateLeaveStatusModal.vue'
import CreateLeaveTypeModal from '../components/hrm/CreateLeaveTypeModal.vue'
import { Plus, CalendarDays, CalendarX, ClipboardEdit, Pencil, Trash2 } from 'lucide-vue-next'
import { useLeaveRequestStore } from '../stores/leave-request'
import { useLeaveTypeStore } from '../stores/leave-type'
import type { LeaveRequest, CreateLeaveRequestRequest, UpdateLeaveRequestStatusRequest, LeaveBalance } from '../services/hrm/types/leave-request.types'
import type { LeaveType, CreateLeaveTypeRequest } from '../services/hrm/types/leave-type.types'
import type { PaginationLink } from '../services/types'

const route = useRoute()
const leaveRequestStore = useLeaveRequestStore()
const leaveTypeStore = useLeaveTypeStore()

// Tabs
const tabs = ['Requests', 'Types']
const activeTab = ref(route.path.includes('leave-types') ? 'Types' : 'Requests')

// Watch path for external navigation
watch(() => route.path, (newPath) => {
  activeTab.value = newPath.includes('leave-types') ? 'Types' : 'Requests'
})

// === Requests Logic ===
const leaveRequests = ref<LeaveRequest[]>([])
const myLeaveBalance = ref<LeaveBalance[]>([])
const isLoadingRequests = ref(false)
const isSubmittingRequest = ref(false)
const isUpdatingStatus = ref(false)
const isApplyModalOpen = ref(false)
const isStatusModalOpen = ref(false)
const selectedRequest = ref<LeaveRequest | null>(null)
const submitRequestErrors = ref<Record<string, string[]> | null>(null)
const submitRequestErrorMessage = ref<string | null>(null)

const pagination = ref({
  current_page: 1,
  from: 0,
  to: 0,
  total: 0,
  last_page: 1,
  links: [] as PaginationLink[],
})

const requestStats = computed(() => [
  { label: 'Total', value: pagination.value.total, colorClass: 'text-gray-900' },
  { label: 'Pending', value: countByStatus('pending'), colorClass: 'text-amber-500' },
  { label: 'Approved', value: countByStatus('approved'), colorClass: 'text-emerald-500' },
  { label: 'Rejected', value: countByStatus('rejected'), colorClass: 'text-red-500' },
])

const countByStatus = (status: string) => 
  leaveRequests.value.filter((r) => r.status === status).length

const loadRequestsData = async (page = 1) => {
  isLoadingRequests.value = true
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
    isLoadingRequests.value = false
  }
}

const loadBalanceData = async () => {
  try {
    await leaveRequestStore.fetchMyLeaveBalance()
    myLeaveBalance.value = leaveRequestStore.myLeaveBalance
  } catch (err) {
    console.error('Failed to load balance:', err)
  }
}

const openApplyModal = () => {
  submitRequestErrors.value = null
  submitRequestErrorMessage.value = null
  isApplyModalOpen.value = true
}

const closeApplyModal = () => {
  isApplyModalOpen.value = false
}

const openStatusUpdateModal = (req: LeaveRequest) => {
  selectedRequest.value = req
  isStatusModalOpen.value = true
}

const closeStatusModal = () => {
  isStatusModalOpen.value = false
  selectedRequest.value = null
}

const handleApplyLeave = async (data: CreateLeaveRequestRequest) => {
  isSubmittingRequest.value = true
  try {
    await leaveRequestStore.createLeaveRequest(data)
    await Swal.fire({ title: 'Success!', text: 'Leave request submitted', icon: 'success', confirmButtonColor: '#10b981' })
    closeApplyModal()
    await loadRequestsData()
    await loadBalanceData()
  } catch (err: any) {
    if (err.response?.status === 422) {
      submitRequestErrors.value = err.response.data.errors
    } else {
      Swal.fire({ title: 'Error!', text: err.response?.data?.message || 'Error', icon: 'error' })
    }
  } finally {
    isSubmittingRequest.value = false
  }
}

const handleUpdateStatus = async (data: UpdateLeaveRequestStatusRequest) => {
  if (!selectedRequest.value) return
  isUpdatingStatus.value = true
  try {
    await leaveRequestStore.updateLeaveRequestStatus(selectedRequest.value.uuid, data)
    await Swal.fire({ title: 'Updated!', text: 'Status updated', icon: 'success' })
    closeStatusModal()
    await loadRequestsData(pagination.value.current_page)
  } catch (err: any) {
    Swal.fire({ title: 'Error!', text: err.response?.data?.message || 'Error', icon: 'error' })
  } finally {
    isUpdatingStatus.value = false
  }
}

// === Types Logic ===
const leaveTypes = ref<LeaveType[]>([])
const isLoadingTypes = ref(false)
const isSubmittingType = ref(false)
const isTypeModalOpen = ref(false)
const selectedLeaveType = ref<LeaveType | null>(null)
const submitTypeErrors = ref<Record<string, string[]> | null>(null)
const submitTypeErrorMessage = ref<string | null>(null)

const totalDaysAllowed = computed(() =>
  leaveTypes.value.reduce((sum, lt) => sum + Number(lt.days_allowed), 0),
)

const loadTypesData = async () => {
  isLoadingTypes.value = true
  try {
    await leaveTypeStore.fetchLeaveTypes()
    leaveTypes.value = leaveTypeStore.leaveTypes
  } catch (err) {
    console.error('Failed to load types:', err)
  } finally {
    isLoadingTypes.value = false
  }
}

const openCreateTypeModal = () => {
  selectedLeaveType.value = null
  isTypeModalOpen.value = true
}

const handleEditType = (lt: LeaveType) => {
  selectedLeaveType.value = lt
  isTypeModalOpen.value = true
}

const closeTypeModal = () => {
  isTypeModalOpen.value = false
  selectedLeaveType.value = null
}

const handleSaveType = async (data: CreateLeaveTypeRequest) => {
  isSubmittingType.value = true
  try {
    if (selectedLeaveType.value) {
      await leaveTypeStore.updateLeaveType(selectedLeaveType.value.uuid, data)
    } else {
      await leaveTypeStore.createLeaveType(data)
    }
    await Swal.fire({ title: 'Success!', text: 'Saved successfully', icon: 'success' })
    closeTypeModal()
    await loadTypesData()
  } catch (err: any) {
    if (err.response?.status === 422) {
      submitTypeErrors.value = err.response.data.errors
    } else {
      Swal.fire({ title: 'Error!', text: err.response?.data?.message || 'Error', icon: 'error' })
    }
  } finally {
    isSubmittingType.value = false
  }
}

const handleDeleteType = async (uuid: string) => {
  const result = await Swal.fire({ title: 'Delete?', text: 'Are you sure?', icon: 'warning', showCancelButton: true })
  if (result.isConfirmed) {
    try {
      await leaveTypeStore.deleteLeaveType(uuid)
      await loadTypesData()
    } catch (err) {
      Swal.fire({ title: 'Error!', text: 'Failed to delete', icon: 'error' })
    }
  }
}

// Helper Utils
const getInitials = (name: string) => 
  name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)

const formatDate = (d: string) => 
  new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })

const getStatusClass = (status: string) => {
  switch (status) {
    case 'approved': return 'bg-emerald-100 text-emerald-700'
    case 'rejected': return 'bg-red-100 text-red-700'
    default: return 'bg-amber-100 text-amber-700'
  }
}

onMounted(() => {
  loadRequestsData()
  loadBalanceData()
  loadTypesData()
})
</script>
