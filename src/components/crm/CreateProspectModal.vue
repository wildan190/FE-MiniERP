<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen px-2 py-4 sm:px-4 sm:py-0 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="handleClose"></div>

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full max-w-full sm:max-w-xl">
        <div class="bg-white px-3 py-4 sm:px-6 sm:py-6">
          <div class="sm:flex sm:items-start">
            <div class="text-left w-full">
              <h3 class="text-lg leading-6 font-bold text-gray-900 mb-6" id="modal-title">Create New Prospect</h3>
              
              <div v-if="errorMessage" class="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm text-red-700">
                      {{ errorMessage }}
                    </p>
                  </div>
                </div>
              </div>

              <form @submit.prevent="handleSubmit" class="space-y-4">
                <!-- Customer Selection -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Customer <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="formData.customer_id"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  >
                    <option value="">Select a customer</option>
                    <option v-for="customer in customers" :key="customer.uuid" :value="customer.uuid">
                      {{ customer.name }} - {{ customer.email }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Opportunity Title <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="formData.title"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Q1 Expansion Project"
                    required
                  />
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Initial Status <span class="text-red-500">*</span>
                    </label>
                    <select
                      v-model="formData.status"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    >
                      <option value="">Select status...</option>
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="qualified">Qualified</option>
                      <option value="proposal">Proposal</option>
                      <option value="negotiation">Negotiation</option>
                      <option value="won">Won</option>
                      <option value="lost">Lost</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Probability (%)
                    </label>
                    <input
                      v-model.number="formData.probability"
                      type="number"
                      min="0"
                      max="100"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., 50"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Expected Value
                    </label>
                    <input
                      v-model.number="formData.expected_value"
                      type="number"
                      min="0"
                      step="0.01"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., 5000000"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Expected Closing Date
                    </label>
                    <input
                      v-model="formData.expected_closing_date"
                      type="date"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    v-model="formData.notes"
                    rows="3"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter additional details..."
                  ></textarea>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
          <button
            @click="handleSubmit"
            :disabled="loading || !formData.customer_id || !formData.status"
            class="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
          >
            {{ loading ? 'Creating...' : 'Create Prospect' }}
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
import { ref, onMounted } from 'vue'
import { prospectService, customerService } from '../../services'
import type { Customer } from '../../services'

interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'created'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const customers = ref<Customer[]>([])
const loading = ref(false)
const errorMessage = ref('')

const formData = ref({
  customer_id: '',
  title: '',
  status: 'new',
  expected_value: undefined as number | undefined,
  expected_closing_date: '',
  probability: undefined as number | undefined,
  notes: ''
})

const fetchCustomers = async () => {
  try {
    const response = await customerService.getCustomers(1)
    customers.value = response.data.data
  } catch (error) {
    console.error('Failed to fetch customers:', error)
  }
}

const handleSubmit = async () => {
  errorMessage.value = ''
  
  if (!formData.value.customer_id) {
    errorMessage.value = 'Customer is required'
    return
  }
  
  if (!formData.value.status) {
    errorMessage.value = 'Status is required'
    return
  }

  loading.value = true
  try {
    await prospectService.createProspect({
      customer_id: formData.value.customer_id,
      title: formData.value.title,
      status: formData.value.status,
      expected_value: formData.value.expected_value,
      expected_closing_date: formData.value.expected_closing_date || undefined,
      probability: formData.value.probability,
      notes: formData.value.notes || undefined
    })
    
    emit('created')
    handleClose()
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Failed to create prospect'
  } finally {
    loading.value = false
  }
}

const handleClose = () => {
  formData.value = {
    customer_id: '',
    title: '',
    status: 'new',
    expected_value: undefined,
    expected_closing_date: '',
    probability: undefined,
    notes: ''
  }
  errorMessage.value = ''
  emit('close')
}

onMounted(() => {
  fetchCustomers()
})
</script>
