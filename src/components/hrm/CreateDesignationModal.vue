<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen px-2 py-4 sm:px-4 sm:py-0 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="handleClose"></div>

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full max-w-full sm:max-w-md">
        <div class="bg-white px-3 py-4 sm:px-6 sm:py-6">
          <div class="sm:flex sm:items-start text-left w-full">
            <div class="w-full">
              <h3 class="text-lg leading-6 font-bold text-gray-900 mb-6" id="modal-title">
                {{ editingDesignation ? 'Edit Designation' : 'Create Designation' }}
              </h3>
              
              <div v-if="errorMessage" class="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
                <p class="text-sm text-red-700">{{ errorMessage }}</p>
              </div>

              <form @submit.prevent="handleSubmit" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Designation Name <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="formData.name"
                    type="text"
                    required
                    maxLength="255"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g. Software Engineer, Sales Manager"
                  />
                  <p v-if="errors?.name" class="mt-1 text-xs text-red-600">{{ errors.name[0] }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    v-model="formData.description"
                    rows="3"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter designation description..."
                  ></textarea>
                  <p v-if="errors?.description" class="mt-1 text-xs text-red-600">{{ errors.description[0] }}</p>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
          <button
            @click="handleSubmit"
            :disabled="loading || !formData.name"
            class="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
          >
            {{ loading ? (editingDesignation ? 'Updating...' : 'Creating...') : (editingDesignation ? 'Update Designation' : 'Create Designation') }}
          </button>
          <button
            type="button"
            @click="handleClose"
            class="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:w-auto sm:text-sm"
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
import type { CreateDesignationRequest, Designation } from '../../services/hrm/types/designation.types'

interface Props {
  isOpen: boolean
  loading?: boolean
  editingDesignation?: Designation | null
  errors?: Record<string, string[]> | null
  errorMessage?: string | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', data: CreateDesignationRequest): void
}>()

const formData = ref<CreateDesignationRequest>({
  name: '',
  description: ''
})

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    if (props.editingDesignation) {
      formData.value = {
        name: props.editingDesignation.name,
        description: props.editingDesignation.description || ''
      }
    } else {
      formData.value = {
        name: '',
        description: ''
      }
    }
  }
})

const handleSubmit = () => {
  emit('submit', { ...formData.value })
}

const handleClose = () => {
  emit('close')
}
</script>
