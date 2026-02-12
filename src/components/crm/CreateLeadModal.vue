<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen px-2 py-4 sm:px-4 sm:py-0 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="handleClose"></div>

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full max-w-full sm:max-w-xl">
        <div class="bg-white px-3 py-4 sm:px-6 sm:py-6">
          <div class="sm:flex sm:items-start">
            <div class="text-left w-full">
              <h3 class="text-lg leading-6 font-bold text-gray-900 mb-6" id="modal-title">Create New Lead</h3>
              
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
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Lead Name <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="formData.lead_name"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Andi - Procurement"
                    required
                  />
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                       Email
                    </label>
                    <input
                      v-model="formData.email"
                      type="email"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      v-model="formData.phone"
                      type="text"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., +62..."
                    />
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    <input
                      v-model="formData.company"
                      type="text"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Company Name"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Source <span class="text-red-500">*</span>
                    </label>
                    <select
                      v-model="formData.source"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    >
                      <option value="">Select source...</option>
                      <option value="Website">Website</option>
                      <option value="Phone">Phone</option>
                      <option value="Email">Email</option>
                      <option value="Referral">Referral</option>
                      <option value="Social">Social Media</option>
                      <option value="Other">Other</option>
                    </select>
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
                    placeholder="Enter additional notes..."
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
            :disabled="loading || !formData.lead_name || !formData.source"
            class="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
          >
            {{ loading ? 'Creating...' : 'Create Lead' }}
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
import { ref } from 'vue'
import { leadService } from '../../services'

interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'created'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const loading = ref(false)
const errorMessage = ref('')

const formData = ref({
  lead_name: '',
  email: '',
  phone: '',
  company: '',
  source: '',
  notes: ''
})

const handleSubmit = async () => {
  errorMessage.value = ''
  
  if (!formData.value.lead_name.trim()) {
    errorMessage.value = 'Lead name is required'
    return
  }
  
  if (!formData.value.source) {
    errorMessage.value = 'Source is required'
    return
  }

  loading.value = true
  try {
    await leadService.createLead({
      lead_name: formData.value.lead_name.trim(),
      email: formData.value.email || undefined,
      phone: formData.value.phone || undefined,
      company: formData.value.company || undefined,
      source: formData.value.source,
      notes: formData.value.notes || undefined
    })
    
    emit('created')
    handleClose()
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Failed to create lead'
  } finally {
    loading.value = false
  }
}

const handleClose = () => {
  formData.value = {
    lead_name: '',
    email: '',
    phone: '',
    company: '',
    source: '',
    notes: ''
  }
  errorMessage.value = ''
  emit('close')
}
</script>
