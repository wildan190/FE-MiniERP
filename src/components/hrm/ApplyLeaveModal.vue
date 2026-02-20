<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75" @click="handleClose"></div>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full max-w-lg">
        <div class="bg-white px-6 py-6">
          <h3 class="text-lg font-bold text-gray-900 mb-6">Apply for Leave</h3>

          <div v-if="errorMessage" class="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
            <p class="text-sm text-red-700">{{ errorMessage }}</p>
          </div>

          <!-- Leave Balance Summary -->
          <div v-if="leaveBalance.length > 0" class="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p class="text-xs font-semibold text-blue-700 mb-2 uppercase tracking-wide">Your Leave Balance</p>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div v-for="balance in leaveBalance" :key="balance.id" class="bg-white rounded-lg p-2.5 text-center border border-blue-100">
                <p class="text-xs text-gray-500 truncate">{{ balance.leave_type?.name || 'Leave' }}</p>
                <p class="text-lg font-bold text-blue-600">{{ balance.remaining_days }}</p>
                <p class="text-xs text-gray-400">/ {{ balance.total_days }} days</p>
              </div>
            </div>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- Leave Type -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Leave Type <span class="text-red-500">*</span>
              </label>
              <select
                v-model="formData.leave_type_uuid"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="" disabled>Select leave type</option>
                <option v-for="lt in leaveTypes" :key="lt.uuid" :value="lt.uuid">
                  {{ lt.name }} ({{ lt.days_allowed }} days)
                </option>
              </select>
              <p v-if="errors?.leave_type_uuid" class="mt-1 text-xs text-red-600">{{ errors.leave_type_uuid[0] }}</p>
            </div>

            <!-- Dates -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Start Date <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.start_date"
                  required
                  type="date"
                  :min="today"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <p v-if="errors?.start_date" class="mt-1 text-xs text-red-600">{{ errors.start_date[0] }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  End Date <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.end_date"
                  required
                  type="date"
                  :min="formData.start_date || today"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <p v-if="errors?.end_date" class="mt-1 text-xs text-red-600">{{ errors.end_date[0] }}</p>
              </div>
            </div>

            <!-- Days Calculated -->
            <div v-if="calculatedDays > 0" class="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
              <CalendarDays class="h-4 w-4 text-gray-500" />
              <span class="text-sm text-gray-700">Duration: <strong>{{ calculatedDays }} day(s)</strong></span>
            </div>

            <!-- Reason -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Reason <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="formData.reason"
                required
                rows="3"
                maxlength="500"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Describe the reason for your leave..."
              ></textarea>
              <div class="flex justify-between mt-1">
                <p v-if="errors?.reason" class="text-xs text-red-600">{{ errors.reason[0] }}</p>
                <p class="text-xs text-gray-400 ml-auto">{{ formData.reason.length }}/500</p>
              </div>
            </div>
          </form>
        </div>

        <div class="bg-gray-50 px-6 py-4 flex flex-row-reverse gap-3">
          <button
            @click="handleSubmit"
            :disabled="loading || !formData.leave_type_uuid || !formData.start_date || !formData.end_date || !formData.reason"
            class="inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
          >
            {{ loading ? 'Submitting...' : 'Submit Request' }}
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
import { ref, computed, watch } from 'vue'
import { CalendarDays } from 'lucide-vue-next'
import type { CreateLeaveRequestRequest } from '../../services/hrm/types/leave-request.types'
import type { LeaveType } from '../../services/hrm/types/leave-type.types'
import type { LeaveBalance } from '../../services/hrm/types/leave-request.types'

interface Props {
  isOpen: boolean
  loading?: boolean
  leaveTypes: LeaveType[]
  leaveBalance: LeaveBalance[]
  errors?: Record<string, string[]> | null
  errorMessage?: string | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', data: CreateLeaveRequestRequest): void
}>()

const today = new Date().toISOString().split('T')[0]

const formData = ref<CreateLeaveRequestRequest>({
  leave_type_uuid: '',
  start_date: '',
  end_date: '',
  reason: '',
})

const calculatedDays = computed(() => {
  if (!formData.value.start_date || !formData.value.end_date) return 0
  const start = new Date(formData.value.start_date)
  const end = new Date(formData.value.end_date)
  const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
  return diff > 0 ? diff : 0
})

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    formData.value = { leave_type_uuid: '', start_date: '', end_date: '', reason: '' }
  }
})

const handleSubmit = () => {
  emit('submit', { ...formData.value })
}

const handleClose = () => {
  emit('close')
}
</script>
