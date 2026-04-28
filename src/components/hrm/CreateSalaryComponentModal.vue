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
                Create Salary Component
              </h3>
              
              <div v-if="errorMessage" class="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
                <p class="text-sm text-red-700">{{ errorMessage }}</p>
              </div>

              <form @submit.prevent="handleSubmit" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Name <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="formData.name"
                    type="text"
                    required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g. Basic Salary, Transport Allowance"
                  />
                  <p v-if="errors?.name" class="mt-1 text-xs text-red-600">{{ errors.name[0] }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Type <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="formData.type"
                    required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="earning">Earning</option>
                    <option value="deduction">Deduction</option>
                  </select>
                  <p v-if="errors?.type" class="mt-1 text-xs text-red-600">{{ errors.type[0] }}</p>
                </div>

                <div class="flex items-center gap-6 py-2">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" v-model="formData.is_taxable" class="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500">
                    <span class="text-sm font-medium text-gray-700">Taxable</span>
                  </label>

                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" v-model="formData.is_fixed" class="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500">
                    <span class="text-sm font-medium text-gray-700">Fixed Value</span>
                  </label>
                </div>
                <div class="flex gap-4">
                  <div class="flex-1">
                    <p v-if="errors?.is_taxable" class="mt-1 text-xs text-red-600">{{ errors.is_taxable[0] }}</p>
                  </div>
                  <div class="flex-1">
                    <p v-if="errors?.is_fixed" class="mt-1 text-xs text-red-600">{{ errors.is_fixed[0] }}</p>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Value <span v-if="!formData.is_fixed" class="text-gray-500 font-normal">(Percentage)</span> <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="formData.value"
                    type="number"
                    step="0.01"
                    required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g. 5000000 or 10"
                  />
                  <p v-if="errors?.value" class="mt-1 text-xs text-red-600">{{ errors.value[0] }}</p>
                </div>

                <div v-if="!formData.is_fixed">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Percentage Of
                  </label>
                  <input
                    v-model="formData.percentage_of"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g. Basic Salary"
                  />
                  <p v-if="errors?.percentage_of" class="mt-1 text-xs text-red-600">{{ errors.percentage_of[0] }}</p>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
          <button
            @click="handleSubmit"
            :disabled="loading || !formData.name || !formData.value"
            class="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
          >
            {{ loading ? 'Creating...' : 'Create Component' }}
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
import type { CreateSalaryComponentRequest } from '../../services/hrm/types/salary-component.types'

interface Props {
  isOpen: boolean
  loading?: boolean
  errors?: Record<string, string[]> | null
  errorMessage?: string | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', data: CreateSalaryComponentRequest): void
}>()

const formData = ref<CreateSalaryComponentRequest>({
  name: '',
  type: 'earning',
  is_taxable: true,
  is_fixed: true,
  value: '',
  percentage_of: ''
})

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    formData.value = {
      name: '',
      type: 'earning',
      is_taxable: true,
      is_fixed: true,
      value: '',
      percentage_of: ''
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
