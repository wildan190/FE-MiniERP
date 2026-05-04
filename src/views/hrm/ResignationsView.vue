<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Header Section -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Resignation Management</h1>
          <p class="text-gray-500 mt-1">Manage and track employee resignation requests</p>
        </div>
        <button
          @click="openResignationModal"
          class="inline-flex items-center px-5 py-2.5 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-all shadow-sm hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus class="h-5 w-5 mr-2" />
          Submit Resignation
        </button>
      </div>

      <!-- Stats Overview -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card class="bg-white border-l-4 border-yellow-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Pending</p>
              <p class="text-2xl font-black text-gray-900">{{ stats.pending }}</p>
            </div>
            <div class="h-10 w-10 bg-yellow-50 rounded-lg flex items-center justify-center text-yellow-600">
              <Clock class="h-6 w-6" />
            </div>
          </div>
        </Card>
        <Card class="bg-white border-l-4 border-green-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Approved</p>
              <p class="text-2xl font-black text-gray-900">{{ stats.approved }}</p>
            </div>
            <div class="h-10 w-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
              <CheckCircle class="h-6 w-6" />
            </div>
          </div>
        </Card>
        <Card class="bg-white border-l-4 border-red-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Rejected</p>
              <p class="text-2xl font-black text-gray-900">{{ stats.rejected }}</p>
            </div>
            <div class="h-10 w-10 bg-red-50 rounded-lg flex items-center justify-center text-red-600">
              <XCircle class="h-6 w-6" />
            </div>
          </div>
        </Card>
        <Card class="bg-white border-l-4 border-primary-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Total</p>
              <p class="text-2xl font-black text-gray-900">{{ pagination.total }}</p>
            </div>
            <div class="h-10 w-10 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600">
              <FileText class="h-6 w-6" />
            </div>
          </div>
        </Card>
      </div>

      <!-- Main Content -->
      <Card class="overflow-hidden">
        <div v-if="isLoading" class="p-8 space-y-4">
          <Skeleton v-for="i in 5" :key="i" width="100%" height="3rem" />
        </div>
        
        <div v-else-if="resignations.length === 0" class="p-20 text-center">
          <div class="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText class="h-10 w-10 text-gray-300" />
          </div>
          <h3 class="text-lg font-bold text-gray-900">No resignation requests found</h3>
          <p class="text-gray-500 mt-1 max-w-xs mx-auto">There are no resignation requests recorded in the system yet.</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-100">
                <th class="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Employee</th>
                <th class="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Notice Date</th>
                <th class="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Resignation Date</th>
                <th class="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th class="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="resignation in resignations" :key="resignation.uuid" class="hover:bg-gray-50/50 transition-colors group">
                <td class="py-4 px-6">
                  <div class="flex items-center gap-3">
                    <div class="h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      {{ getInitials(resignation.employee?.user?.name || resignation.employee?.first_name || 'NA') }}
                    </div>
                    <div>
                      <p class="text-sm font-bold text-gray-900">{{ resignation.employee?.user?.name || (resignation.employee?.first_name + ' ' + resignation.employee?.last_name) }}</p>
                      <p class="text-xs text-gray-500">{{ resignation.employee?.emp_code }}</p>
                    </div>
                  </div>
                </td>
                <td class="py-4 px-6 text-sm text-gray-600">{{ formatDate(resignation.notice_date) }}</td>
                <td class="py-4 px-6 text-sm text-gray-600">{{ formatDate(resignation.resignation_date) }}</td>
                <td class="py-4 px-6">
                  <span
                    :class="getStatusClass(resignation.status)"
                    class="inline-flex px-2.5 py-1 text-[10px] font-black uppercase rounded-full border shadow-sm"
                  >
                    {{ resignation.status }}
                  </span>
                </td>
                <td class="py-4 px-6 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button
                      v-if="resignation.status === 'pending'"
                      @click="handleWithdraw(resignation.uuid)"
                      class="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
                      title="Withdraw Request"
                    >
                      <RotateCcw class="h-5 w-5" />
                    </button>
                    <RouterLink
                      :to="`/hrm/resignations/${resignation.uuid}`"
                      class="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                    >
                      <Eye class="h-5 w-5" />
                    </RouterLink>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <div v-if="pagination.lastPage > 1" class="p-4 border-t border-gray-100 flex items-center justify-between">
          <p class="text-xs text-gray-500">
            Showing <span class="font-bold text-gray-900">{{ resignations.length }}</span> of <span class="font-bold text-gray-900">{{ pagination.total }}</span> results
          </p>
          <div class="flex gap-2">
            <button
              @click="fetchPage(pagination.currentPage - 1)"
              :disabled="pagination.currentPage === 1"
              class="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft class="h-4 w-4" />
            </button>
            <button
              @click="fetchPage(pagination.currentPage + 1)"
              :disabled="pagination.currentPage === pagination.lastPage"
              class="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight class="h-4 w-4" />
            </button>
          </div>
        </div>
      </Card>
    </div>

    <!-- Submit Resignation Modal -->
    <Modal :show="isModalOpen" @close="closeResignationModal" title="Submit Resignation Request" maxWidth="lg">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="space-y-4">
          <!-- User will be automatically detected by backend -->

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Notice Date -->
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Notice Date</label>
              <input
                v-model="formData.notice_date"
                type="date"
                required
                class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm"
              />
            </div>

            <!-- Resignation Date -->
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Resignation Date</label>
              <input
                v-model="formData.resignation_date"
                type="date"
                required
                class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm"
              />
            </div>
          </div>

          <!-- Handover To -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Handover To (Optional)</label>
            <select
              v-model="formData.handover_to_uuid"
              class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm"
            >
              <option :value="null">No specific person</option>
              <option v-for="emp in employees" :key="'handover-' + emp.uuid" :value="emp.uuid">
                {{ emp.user?.name || (emp.first_name + ' ' + emp.last_name) }} ({{ emp.emp_code }})
              </option>
            </select>
          </div>

          <!-- Reason -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Reason for Resignation</label>
            <textarea
              v-model="formData.reason"
              required
              rows="4"
              class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm resize-none"
              placeholder="Please provide a clear reason for your resignation..."
            ></textarea>
          </div>
        </div>

        <div class="flex gap-3 pt-2">
          <button
            type="button"
            @click="closeResignationModal"
            class="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="flex-1 px-4 py-2.5 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all shadow-sm disabled:opacity-50 text-sm flex items-center justify-center gap-2"
          >
            <span v-if="isSubmitting">Submitting...</span>
            <span v-else>Submit Request</span>
          </button>
        </div>
      </form>
    </Modal>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue'
import { Plus, Eye, FileText, Clock, CheckCircle, XCircle, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-vue-next'
import AppLayout from '../../layouts/AppLayout.vue'
import Card from '../../components/common/Card.vue'
import Modal from '../../components/common/Modal.vue'
import Skeleton from '../../components/common/Skeleton.vue'
import { useResignationStore } from "../../stores/resignation";
import { useEmployeeStore } from "../../stores/employee";
import type { CreateResignationRequest } from "../../services/hrm/types/resignation.types";
import Swal from 'sweetalert2'

const resignationStore = useResignationStore()
const employeeStore = useEmployeeStore()

const isLoading = ref(false)
const isSubmitting = ref(false)
const isModalOpen = ref(false)

const resignations = computed(() => resignationStore.resignations)
const pagination = computed(() => resignationStore.pagination)
const employees = computed(() => employeeStore.employees)

const stats = computed(() => {
  return {
    pending: resignations.value.filter(r => r.status === 'pending').length,
    approved: resignations.value.filter(r => r.status === 'approved').length,
    rejected: resignations.value.filter(r => r.status === 'rejected').length
  }
})

const formData = reactive<CreateResignationRequest>({
  employee_uuid: '',
  notice_date: new Date().toISOString().split('T')[0],
  resignation_date: '',
  reason: '',
  handover_to_uuid: null
})

const fetchPage = (page: number) => {
  resignationStore.fetchResignations(page)
}

const openResignationModal = () => {
  isModalOpen.value = true
}

const closeResignationModal = () => {
  isModalOpen.value = false
  resetForm()
}

const resetForm = () => {
  formData.employee_uuid = ''
  formData.notice_date = new Date().toISOString().split('T')[0]
  formData.resignation_date = ''
  formData.reason = ''
  formData.handover_to_uuid = null
}

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    const submitData = { ...formData }
    if (!submitData.employee_uuid) delete (submitData as any).employee_uuid
    await resignationStore.submitResignation(submitData)
    await Swal.fire({
      title: 'Success!',
      text: 'Resignation request submitted successfully.',
      icon: 'success',
      confirmButtonColor: '#4f46e5',
    })
    closeResignationModal()
  } catch (err: any) {
    console.error(err)
    Swal.fire({
      title: 'Error!',
      text: err.response?.data?.message || 'Failed to submit resignation request.',
      icon: 'error',
      confirmButtonColor: '#4f46e5',
    })
  } finally {
    isSubmitting.value = false
  }
}

const handleWithdraw = async (uuid: string) => {
  const result = await Swal.fire({
    title: 'Withdraw Request?',
    text: 'Are you sure you want to withdraw this resignation request?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#f97316',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes, withdraw it'
  })

  if (result.isConfirmed) {
    try {
      await resignationStore.updateStatus(uuid, { status: 'withdrawn' })
      await Swal.fire({
        title: 'Withdrawn!',
        text: 'Your resignation request has been withdrawn.',
        icon: 'success',
        confirmButtonColor: '#f97316',
      })
    } catch (err: any) {
      console.error(err)
      Swal.fire({
        title: 'Error!',
        text: err.response?.data?.message || 'Failed to withdraw request.',
        icon: 'error',
        confirmButtonColor: '#4f46e5',
      })
    }
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
  switch (status.toLowerCase()) {
    case 'pending': return 'bg-yellow-50 text-yellow-600 border-yellow-200'
    case 'approved': return 'bg-green-50 text-green-600 border-green-200'
    case 'rejected': return 'bg-red-50 text-red-600 border-red-200'
    default: return 'bg-gray-50 text-gray-600 border-gray-200'
  }
}

onMounted(async () => {
  isLoading.value = true
  await Promise.all([
    resignationStore.fetchResignations(),
    employeeStore.fetchEmployees(1) // Fetch employees for handover selection
  ])
  isLoading.value = false
})
</script>
