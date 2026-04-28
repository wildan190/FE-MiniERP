<template>
  <AppLayout>
    <div class="max-w-4xl mx-auto px-4 py-8">
      <!-- Loading State -->
      <div v-if="isLoading" class="space-y-6">
        <Skeleton width="100%" height="4rem" />
        <Skeleton width="100%" height="20rem" />
      </div>

      <template v-else-if="resignation">
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div class="flex items-center gap-4">
            <RouterLink
              to="/hrm/resignations"
              class="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-primary-600 hover:border-primary-200 transition-all shadow-sm"
            >
              <ArrowLeft class="h-5 w-5" />
            </RouterLink>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Resignation Detail</h1>
              <p class="text-gray-500 text-sm">Request ID: {{ resignation.uuid.substring(0, 8).toUpperCase() }}</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span
              :class="getStatusClass(resignation.status)"
              class="px-4 py-1.5 text-xs font-black uppercase rounded-full border shadow-sm"
            >
              {{ resignation.status }}
            </span>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Main Info -->
          <div class="md:col-span-2 space-y-6">
            <Card>
              <h3 class="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FileText class="h-5 w-5 text-primary-500" />
                Resignation Information
              </h3>
              
              <div class="space-y-6">
                <div>
                  <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Reason</label>
                  <div class="bg-gray-50 rounded-2xl p-4 text-gray-700 leading-relaxed italic border border-gray-100">
                    "{{ resignation.reason }}"
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-6">
                  <div>
                    <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Notice Date</label>
                    <p class="text-sm font-bold text-gray-900">{{ formatDate(resignation.notice_date) }}</p>
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Effective Date</label>
                    <p class="text-sm font-bold text-gray-900">{{ formatDate(resignation.resignation_date) }}</p>
                  </div>
                </div>

                <div v-if="resignation.remarks">
                  <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Remarks / Note</label>
                  <p class="text-sm text-gray-600">{{ resignation.remarks }}</p>
                </div>
              </div>
            </Card>

            <!-- Action Buttons (Only for Pending) -->
            <div v-if="resignation.status === 'pending'" class="space-y-3">
              <div class="flex gap-4">
                <button
                  @click="openStatusModal('rejected')"
                  class="flex-1 px-6 py-4 bg-white border-2 border-red-100 text-red-600 font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-red-50 transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <XCircle class="h-5 w-5" />
                  Reject Request
                </button>
                <button
                  @click="openStatusModal('approved')"
                  class="flex-1 px-6 py-4 bg-primary-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-primary-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-200"
                >
                  <CheckCircle class="h-5 w-5" />
                  Approve Request
                </button>
              </div>
              <button
                @click="openStatusModal('withdrawn')"
                class="w-full px-6 py-3 bg-gray-100 text-gray-600 font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw class="h-4 w-4" />
                Withdraw Request
              </button>
            </div>
          </div>

          <!-- Sidebar Info -->
          <div class="space-y-6">
            <Card>
              <h3 class="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Employee Details</h3>
              <div class="flex flex-col items-center text-center p-4">
                <div class="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg mb-4">
                  {{ getInitials(resignation.employee?.user?.name || resignation.employee?.first_name || 'NA') }}
                </div>
                <h4 class="font-bold text-gray-900">{{ resignation.employee?.user?.name || (resignation.employee?.first_name + ' ' + resignation.employee?.last_name) }}</h4>
                <p class="text-xs text-gray-500 mt-1">{{ resignation.employee?.emp_code }}</p>
              </div>
              <div class="border-t border-gray-50 pt-4 mt-4 space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-xs text-gray-500">Department</span>
                  <span class="text-xs font-bold text-gray-900">{{ resignation.employee?.department?.name || 'N/A' }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-xs text-gray-500">Designation</span>
                  <span class="text-xs font-bold text-gray-900">{{ resignation.employee?.designation?.name || 'N/A' }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-xs text-gray-500">Joined</span>
                  <span class="text-xs font-bold text-gray-900">{{ formatDate(resignation.employee?.joining_date || '') }}</span>
                </div>
              </div>
            </Card>

            <Card v-if="resignation.handover_to" class="bg-indigo-50/50 border-indigo-100">
              <h3 class="text-sm font-bold text-indigo-900 mb-4 uppercase tracking-wider">Handover Person</h3>
              <div class="flex items-center gap-3">
                <div class="h-10 w-10 rounded-full bg-white border border-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold">
                  {{ getInitials('Person') }}
                </div>
                <div>
                  <p class="text-sm font-bold text-indigo-900">ID: {{ resignation.handover_to }}</p>
                  <p class="text-[10px] text-indigo-500">Designated Handover</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </template>

      <!-- Not Found -->
      <div v-else class="text-center py-20">
        <h2 class="text-xl font-bold text-gray-900">Resignation record not found</h2>
        <RouterLink to="/hrm/resignations" class="text-primary-600 font-bold mt-2 inline-block">Back to list</RouterLink>
      </div>
    </div>

    <!-- Approval/Rejection Modal -->
    <Modal :show="isStatusModalOpen" @close="closeStatusModal" :title="statusAction === 'approved' ? 'Approve Resignation' : 'Reject Resignation'" maxWidth="md">
      <div class="p-1 space-y-6">
        <div class="p-4 rounded-xl" :class="statusAction === 'approved' ? 'bg-green-50 text-green-700' : statusAction === 'rejected' ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-700'">
          <p class="text-sm font-medium">
            Are you sure you want to <strong>{{ statusAction }}</strong> this resignation request?
            <span v-if="statusAction === 'approved'">The employee will be marked as resigning on {{ formatDate(resignation?.resignation_date || '') }}.</span>
          </p>
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Remarks / Notes (Optional)</label>
          <textarea
            v-model="statusRemarks"
            rows="4"
            class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm resize-none"
            placeholder="Add any additional notes here..."
          ></textarea>
        </div>

        <div class="flex gap-3">
          <button
            @click="closeStatusModal"
            class="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-all text-sm"
          >
            Cancel
          </button>
          <button
            @click="handleStatusUpdate"
            :disabled="isUpdating"
            class="flex-1 px-4 py-3 text-white font-bold rounded-2xl transition-all shadow-md flex items-center justify-center gap-2"
            :class="statusAction === 'approved' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'"
          >
            <span v-if="isUpdating">Updating...</span>
            <span v-else>Confirm {{ statusAction }}</span>
          </button>
        </div>
      </div>
    </Modal>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { ArrowLeft, FileText, CheckCircle, XCircle, Clock, RotateCcw } from 'lucide-vue-next'
import AppLayout from '../../layouts/AppLayout.vue'
import Card from '../../components/common/Card.vue'
import Modal from '../../components/common/Modal.vue'
import Skeleton from '../../components/common/Skeleton.vue'
import { useResignationStore } from '../../stores/resignation'
import Swal from 'sweetalert2'

const route = useRoute()
const resignationStore = useResignationStore()

const isLoading = ref(true)
const isUpdating = ref(false)
const isStatusModalOpen = ref(false)
const statusAction = ref<'approved' | 'rejected' | 'withdrawn'>('approved')
const statusRemarks = ref('')

const resignation = computed(() => resignationStore.currentResignation)

const openStatusModal = (action: 'approved' | 'rejected' | 'withdrawn') => {
  statusAction.value = action
  statusRemarks.value = ''
  isStatusModalOpen.value = true
}

const closeStatusModal = () => {
  isStatusModalOpen.value = false
}

const handleStatusUpdate = async () => {
  if (!resignation.value) return
  
  isUpdating.value = true
  try {
    await resignationStore.updateStatus(resignation.value.uuid, {
      status: statusAction.value,
      remarks: statusRemarks.value
    })
    
    await Swal.fire({
      title: 'Success!',
      text: `Resignation request has been ${statusAction.value}.`,
      icon: 'success',
      confirmButtonColor: '#4f46e5',
    })
    closeStatusModal()
  } catch (err: any) {
    console.error(err)
    Swal.fire({
      title: 'Error!',
      text: err.response?.data?.message || 'Failed to update resignation status.',
      icon: 'error',
      confirmButtonColor: '#4f46e5',
    })
  } finally {
    isUpdating.value = false
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
}

const getStatusClass = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'pending': return 'bg-yellow-50 text-yellow-600 border-yellow-200'
    case 'approved': return 'bg-green-50 text-green-600 border-green-200'
    case 'rejected': return 'bg-red-50 text-red-600 border-red-200'
    case 'withdrawn': return 'bg-gray-50 text-gray-500 border-gray-200'
    default: return 'bg-gray-50 text-gray-600 border-gray-200'
  }
}

onMounted(async () => {
  const uuid = route.params.uuid as string
  if (uuid) {
    isLoading.value = true
    try {
      await resignationStore.fetchResignationDetail(uuid)
    } catch (err) {
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }
})
</script>
