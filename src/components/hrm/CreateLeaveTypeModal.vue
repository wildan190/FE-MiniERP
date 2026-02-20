<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 overflow-y-auto"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div class="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
        @click="handleClose"
      ></div>

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full max-w-md">
        <div class="bg-white px-6 py-6">
          <h3 class="text-lg leading-6 font-bold text-gray-900 mb-6" id="modal-title">
            {{ editing ? 'Edit Leave Type' : 'Create Leave Type' }}
          </h3>

          <div v-if="errorMessage" class="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
            <p class="text-sm text-red-700">{{ errorMessage }}</p>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Name <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.name"
                required
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="E.g. Annual Leave"
              />
              <p v-if="errors?.name" class="mt-1 text-xs text-red-600">{{ errors.name[0] }}</p>
            </div>

            <!-- Days Allowed -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Days Allowed <span class="text-red-500">*</span>
              </label>
              <input
                v-model.number="formData.days_allowed"
                required
                type="number"
                min="1"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="E.g. 12"
              />
              <p v-if="errors?.days_allowed" class="mt-1 text-xs text-red-600">{{ errors.days_allowed[0] }}</p>
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
              <textarea
                v-model="formData.description"
                rows="3"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Brief description of this leave type"
              ></textarea>
              <p v-if="errors?.description" class="mt-1 text-xs text-red-600">{{ errors.description[0] }}</p>
            </div>
          </form>
        </div>

        <div class="bg-gray-50 px-6 py-4 flex flex-row-reverse gap-3">
          <button
            @click="handleSubmit"
            :disabled="loading || !formData.name || !formData.days_allowed"
            class="inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:text-sm disabled:opacity-50"
          >
            {{ loading ? (editing ? 'Updating...' : 'Creating...') : (editing ? 'Update' : 'Create') }}
          </button>
          <button
            type="button"
            @click="handleClose"
            class="inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { LeaveType, CreateLeaveTypeRequest } from '../../services/hrm/types/leave-type.types'

interface Props {
  isOpen: boolean
  loading?: boolean
  editing?: LeaveType | null
  errors?: Record<string, string[]> | null
  errorMessage?: string | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', data: CreateLeaveTypeRequest): void
}>()

const formData = ref<CreateLeaveTypeRequest>({
  name: '',
  days_allowed: 0,
  description: '',
})

watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      if (props.editing) {
        formData.value = {
          name: props.editing.name,
          days_allowed: props.editing.days_allowed,
          description: props.editing.description || '',
        }
      } else {
        formData.value = { name: '', days_allowed: 0, description: '' }
      }
    }
  },
)

const handleSubmit = () => {
  emit('submit', { ...formData.value })
}

const handleClose = () => {
  emit('close')
}
</script>
