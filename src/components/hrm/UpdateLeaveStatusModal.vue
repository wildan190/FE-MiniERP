<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
    <div class="flex items-center justify-center min-h-screen px-4">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75" @click="handleClose"></div>

      <div class="relative inline-block bg-white rounded-xl text-left shadow-xl w-full max-w-sm z-10">
        <div class="p-6">
          <h3 class="text-base font-bold text-gray-900 mb-1">Update Request Status</h3>
          <p class="text-sm text-gray-500 mb-6">Update the status of this leave request.</p>

          <!-- Current request info -->
          <div v-if="leaveRequest" class="mb-5 bg-gray-50 rounded-xl p-4 space-y-2">
            <p class="text-sm text-gray-700">
              <span class="font-medium">Employee:</span>
              {{ leaveRequest.employee?.user?.name || leaveRequest.employee?.first_name }}
            </p>
            <p class="text-sm text-gray-700">
              <span class="font-medium">Leave Type:</span>
              {{ leaveRequest.leave_type?.name || '-' }}
            </p>
            <p class="text-sm text-gray-700">
              <span class="font-medium">Period:</span>
              {{ formatDate(leaveRequest.start_date) }} – {{ formatDate(leaveRequest.end_date) }}
            </p>
            <p class="text-sm text-gray-700">
              <span class="font-medium">Reason:</span>
              {{ leaveRequest.reason }}
            </p>
          </div>

          <!-- Status Select -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">New Status</label>
            <div class="flex gap-3">
              <button
                @click="formData.status = 'approved'"
                :class="formData.status === 'approved' ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-emerald-700 border-emerald-300 hover:bg-emerald-50'"
                class="flex-1 border-2 rounded-lg py-2 text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle class="h-4 w-4" />
                Approve
              </button>
              <button
                @click="formData.status = 'rejected'"
                :class="formData.status === 'rejected' ? 'bg-red-500 text-white border-red-500' : 'bg-white text-red-700 border-red-300 hover:bg-red-50'"
                class="flex-1 border-2 rounded-lg py-2 text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <XCircle class="h-4 w-4" />
                Reject
              </button>
            </div>
          </div>

          <!-- Rejection Reason (optional, shown when rejected) -->
          <div v-if="formData.status === 'rejected'" class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Rejection Reason (Optional)</label>
            <textarea
              v-model="formData.rejection_reason"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Brief reason for rejection..."
            ></textarea>
          </div>
        </div>

        <div class="bg-gray-50 px-6 py-4 flex flex-row-reverse gap-3 rounded-b-xl">
          <button
            @click="handleSubmit"
            :disabled="loading || !formData.status"
            class="inline-flex justify-center rounded-lg shadow-sm px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            :class="formData.status === 'rejected' ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'"
          >
            {{ loading ? 'Saving...' : 'Confirm' }}
          </button>
          <button @click="handleClose" class="inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { CheckCircle, XCircle } from 'lucide-vue-next'
import type { LeaveRequest, UpdateLeaveRequestStatusRequest } from '../../services/hrm/types/leave-request.types'

interface Props {
  isOpen: boolean
  loading?: boolean
  leaveRequest?: LeaveRequest | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', data: UpdateLeaveRequestStatusRequest): void
}>()

const formData = ref<UpdateLeaveRequestStatusRequest>({
  status: 'approved',
  rejection_reason: '',
})

watch(() => props.isOpen, (v) => {
  if (v) {
    formData.value = { status: 'approved', rejection_reason: '' }
  }
})

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })

const handleSubmit = () => {
  emit('submit', {
    status: formData.value.status,
    rejection_reason: formData.value.status === 'rejected' ? (formData.value.rejection_reason || null) : null,
  })
}

const handleClose = () => emit('close')
</script>
